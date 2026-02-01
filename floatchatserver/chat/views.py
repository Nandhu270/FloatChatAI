import json
from math import sqrt
from datetime import date
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from chat.services.location import classify_location
from chat.services.date import resolve_dates
from chat.services.gemini import summarize_with_gemini
from chat.services.prompt_builder import build_summary_prompt

from erddap.client import fetch
from erddap.catalog import ERDDAP_DAILY, ERDDAP_5DAY


# -------------------------------------------------
# Dataset last available dates (from ERDDAP metadata)
# -------------------------------------------------
DATASET_LAST_DATE = {
    "daily": date(2025, 12, 2),
    "5day": date(2025, 6, 29),
}


# -------------------------------------------------
# Known RAMA buoy locations (Indian Ocean subset)
# -------------------------------------------------
RAMA_BUOYS = [
    (12.0, 67.0),   # Central Arabian Sea
    (8.0, 67.0),    # South Arabian Sea
    (10.0, 75.0),   # Lakshadweep Sea
    (15.0, 90.0),   # Bay of Bengal
    (0.0, 90.0),    # Equatorial Indian Ocean
    (-1.5, 80.5),   # South Indian Ocean
    (5.0, 95.0),    # Eastern Bay of Bengal
]


# -------------------------------------------------
# Nearest RAMA buoy (true KNN on buoy registry)
# -------------------------------------------------
def nearest_rama_buoy(lat, lon):
    return min(
        RAMA_BUOYS,
        key=lambda p: sqrt((p[0] - lat) ** 2 + (p[1] - lon) ** 2),
    )


@csrf_exempt
def chat_api(request):
    # -------------------------------------------------
    # 1. INPUT VALIDATION
    # -------------------------------------------------
    try:
        body = json.loads(request.body)
        lat = float(body["latitude"])
        lon = float(body["longitude"])
        user_date = body.get("date")
    except Exception:
        return JsonResponse(
            {"error": "Latitude and longitude are required."},
            status=400,
        )

    # -------------------------------------------------
    # 2. DATE VALIDATION (60-DAY RULE)
    # -------------------------------------------------
    date_used, start_date, date_ok = resolve_dates(user_date)
    if not date_ok:
        return JsonResponse(
            {
                "input": {
                    "latitude": lat,
                    "longitude": lon,
                    "date_used": user_date,
                    "analysis_range": "N/A",
                },
                "location_status": {
                    "region": "Indian Waters",
                    "description": "No data available. Date is outside the permitted 60-day range.",
                },
                "ocean_data_summary": {
                    "parameters_analyzed": [],
                    "key_insights": [],
                },
                "data_confidence": "Low",
            }
        )

    # -------------------------------------------------
    # 3. LOCATION CLASSIFICATION
    # -------------------------------------------------
    region, description = classify_location(lat, lon)

    if region in ("Land", "Outside India"):
        return JsonResponse(
            {
                "input": {
                    "latitude": lat,
                    "longitude": lon,
                    "date_used": str(date_used),
                    "analysis_range": f"{start_date} to {date_used}",
                },
                "location_status": {
                    "region": region,
                    "description": description,
                },
                "ocean_data_summary": {
                    "parameters_analyzed": [],
                    "key_insights": [],
                },
                "data_confidence": "High",
            }
        )

    # -------------------------------------------------
    # 4. CLAMP DATE WINDOWS
    # -------------------------------------------------
    daily_end = min(date_used, DATASET_LAST_DATE["daily"])
    daily_start = min(start_date, daily_end)

    five_end = min(date_used, DATASET_LAST_DATE["5day"])
    five_start = min(start_date, five_end)

    # -------------------------------------------------
    # 5. DATA FETCH USING REAL RAMA BUOYS
    # -------------------------------------------------
    facts = {}
    parameters_analyzed = []
    available_count = 0
    resolution_used = set()

    nearest_lat, nearest_lon = nearest_rama_buoy(lat, lon)

    for param in ERDDAP_DAILY.keys():
        parameters_analyzed.append(param)

        # ===============================
        # TRY DAILY AT EXACT LOCATION
        # ===============================
        daily_dataset, daily_vars = ERDDAP_DAILY[param]
        df = fetch(
            daily_dataset,
            daily_vars,
            lat,
            lon,
            daily_start,
            daily_end,
        )

        if not df.empty:
            facts[param] = "Exact location data available (daily resolution)"
            available_count += 1
            resolution_used.add("daily")
            continue

        # ===============================
        # TRY DAILY AT NEAREST RAMA BUOY
        # ===============================
        df_near = fetch(
            daily_dataset,
            daily_vars,
            nearest_lat,
            nearest_lon,
            daily_start,
            daily_end,
        )

        if not df_near.empty:
            facts[param] = "Nearest RAMA buoy data used (daily resolution)"
            available_count += 1
            resolution_used.add("daily")
            continue

        # ===============================
        # FALLBACK TO 5-DAY AT NEAREST BUOY
        # ===============================
        five_dataset, five_vars = ERDDAP_5DAY[param]
        df5 = fetch(
            five_dataset,
            five_vars,
            nearest_lat,
            nearest_lon,
            five_start,
            five_end,
        )

        if not df5.empty:
            facts[param] = "Nearest RAMA buoy data used (5-day resolution)"
            available_count += 1
            resolution_used.add("5-day")
        else:
            facts[param] = "Data not available"

    # -------------------------------------------------
    # 6. GEMINI SUMMARY (FACTS ONLY)
    # -------------------------------------------------
    summary_prompt = build_summary_prompt(facts)
    summary_text = summarize_with_gemini(summary_prompt)

    key_insights = [
        line.strip("- ").strip()
        for line in summary_text.split("\n")
        if line.strip()
    ]

    # -------------------------------------------------
    # 7. CONFIDENCE SCORE
    # -------------------------------------------------
    if available_count >= 6:
        confidence = "High"
    elif available_count >= 3:
        confidence = "Medium"
    else:
        confidence = "Low"

    # -------------------------------------------------
    # 8. HONEST ANALYSIS RANGE
    # -------------------------------------------------
    actual_start = min(daily_start, five_start)
    actual_end = max(daily_end, five_end)

    # -------------------------------------------------
    # 9. FINAL RESPONSE
    # -------------------------------------------------
    return JsonResponse(
        {
            "input": {
                "latitude": lat,
                "longitude": lon,
                "date_used": str(date_used),
                "analysis_range": f"{actual_start} to {actual_end}",
            },
            "location_status": {
                "region": "Indian Waters",
                "description": (
                    f"Nearest RAMA buoy used at "
                    f"{nearest_lat}°N, {nearest_lon}°E when exact data was unavailable."
                ),
            },
            "ocean_data_summary": {
                "parameters_analyzed": parameters_analyzed,
                "key_insights": key_insights,
            },
            "data_confidence": confidence,
        }
    )
