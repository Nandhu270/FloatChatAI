from math import sqrt
from datetime import date, timedelta

from chat.services.gemini import classify_intent_and_extract, summarize_with_gemini
from chat.services.location import classify_location
from chat.services.date import resolve_dates
from chat.services.prompt_builder import build_summary_prompt
from erddap.catalog import ERDDAP_DAILY, ERDDAP_5DAY
from erddap.client import fetch
from vectorstore.store import add_doc


# 🔒 RAMA dataset coverage end date
RAMA_DATA_END = date(2025, 12, 1)

# Approximate RAMA buoy positions
RAMA_BUOYS = [
    (12.0, 67.0),
    (8.0, 67.0),
    (10.0, 75.0),
    (15.0, 90.0),
    (0.0, 90.0),
    (-1.5, 80.5),
    (5.0, 95.0),
]


def get_nearest_buoy(lat, lon):
    return min(
        RAMA_BUOYS,
        key=lambda p: sqrt((p[0] - lat) ** 2 + (p[1] - lon) ** 2)
    )


def process_interaction(message: str) -> dict:
    analysis = classify_intent_and_extract(message)
    intent = analysis.get("intent", "general_qa")

    # --------- GREETING / GENERAL ---------
    if intent in ["greeting", "general_qa"]:
        reply = analysis.get("reply")
        if not reply:
            reply = summarize_with_gemini(message)
        return {"reply": reply}

    # --------- DATA QUERY ---------
    entities = analysis.get("entities", {})
    lat = entities.get("latitude")
    lon = entities.get("longitude")
    date_str = entities.get("date")

    if lat is None or lon is None:
        return {"reply": "Please provide valid latitude and longitude."}

    target_date, _ = resolve_dates(date_str)

    # 🚨 DATASET COVERAGE CHECK
    if target_date > RAMA_DATA_END:
        return {
            "reply": (
                f"RAMA buoy observations are available only up to "
                f"{RAMA_DATA_END}. The requested date ({target_date}) "
                "falls outside the observation period.\n\n"
                "You can instead:\n"
                "- request the most recent available observations, or\n"
                "- ask for a prediction based on historical data."
            ),
            "meta": {
                "requested_date": str(target_date),
                "dataset_end": str(RAMA_DATA_END),
                "status": "outside_dataset_range"
            }
        }

    # --------- LOCATION & BUOY ---------
    region, loc_desc = classify_location(lat, lon)
    n_lat, n_lon = get_nearest_buoy(lat, lon)

    facts = {}

    for param in ERDDAP_DAILY.keys():
        daily_ds, daily_vars = ERDDAP_DAILY[param]

        # 1️⃣ Try daily data
        df = fetch(
            daily_ds,
            daily_vars,
            n_lat,
            n_lon,
            target_date,
            target_date
        )

        if not df.empty:
            val = df.iloc[0, -1]
            facts[param] = (
                f"{val} (daily, nearest RAMA buoy at {n_lat}°, {n_lon}°)"
            )
            continue

        # 2️⃣ Try 5-day window
        five_ds, five_vars = ERDDAP_5DAY.get(param, (None, None))
        if five_ds:
            start = target_date - timedelta(days=2)
            end = target_date + timedelta(days=2)

            df5 = fetch(
                five_ds,
                five_vars,
                n_lat,
                n_lon,
                start,
                end
            )

            if not df5.empty:
                val = df5.iloc[0, -1]
                facts[param] = (
                    f"{val} (5-day average around {target_date}, "
                    f"nearest RAMA buoy at {n_lat}°, {n_lon}°)"
                )
                continue

        # 3️⃣ True absence
        facts[param] = (
            "No observations for this parameter near the requested date"
        )

    # --------- SUMMARY ---------
    prompt = f"""
Location note:
RAMA buoys are point-based instruments. Data represents the nearest available
buoy, not the exact requested coordinates.

Requested location: {lat}, {lon}
Nearest RAMA buoy: {n_lat}, {n_lon}
Date: {target_date}
Region: {loc_desc}

{build_summary_prompt(facts)}
"""

    summary = summarize_with_gemini(prompt)

    # Gemini fallback → manual summary
    if "temporarily unavailable" in summary.lower():
        summary = (
            f"Oceanographic conditions for {lat}, {lon} on {target_date} "
            f"based on the nearest RAMA buoy ({n_lat}, {n_lon}):\n"
        )
        for k, v in list(facts.items())[:5]:
            summary += f"- {k.replace('_', ' ').title()}: {v}\n"

    add_doc(f"User queried {lat},{lon} on {target_date}")

    return {
        "reply": summary,
        "meta": {
            "requested_location": [lat, lon],
            "nearest_rama_buoy": [n_lat, n_lon],
            "date": str(target_date),
            "region": region
        }
    }
