import json
from datetime import datetime, timedelta
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from erddap.catalog import ERDDAP_DATASETS
from erddap.client import fetch_erddap

from chat.services.geo_rules import classify_location
from chat.services.rama_grid import nearest_rama
from chat.services.gemini import ask_gemini
from chat.services.rag import retrieve

@csrf_exempt
def chat_api(request):
    body = json.loads(request.body)
    lat, lon = float(body["lat"]), float(body["lon"])
    message = body["message"]

    loc = classify_location(lat, lon)

    # RULE 1: LAND
    if loc["type"] == "land":
        return JsonResponse({
            "reply": f"The given coordinates fall on land in {loc['place']}."
        })


    # RULE 2: OUTSIDE INDIAN WATERS
    if loc["type"] == "other_ocean":
        return JsonResponse({
            "reply": "This location lies in ocean waters outside the Indian Ocean RAMA observation domain. No data is available for this region."
        })

    # RULE 3 & 4: INDIAN WATERS
    lat_n, lon_n = nearest_rama(lat, lon)

    end = datetime.utcnow() - timedelta(days=10)
    start = end - timedelta(days=5)

    summaries = []
    for key, meta in ERDDAP_DATASETS.items():
        dataset, vars_ = meta["5day"]
        df = fetch_erddap(dataset, vars_, lat_n, lon_n, start.isoformat(), end.isoformat())
        if not df.empty:
            summaries.append(f"{meta['label']}: {len(df)} records")

    if not summaries:
        return JsonResponse({
            "reply": f"No RAMA observations found near this location. Nearest checked point was {lat_n}°N, {lon_n}°E."
        })

    rag_context = "\n".join(retrieve(message))

    prompt = f"""
    You are an oceanographic assistant.

    Background knowledge:
    {rag_context}

    User question:
    {message}

    Nearest RAMA location used:
    {lat_n}°N, {lon_n}°E

    Available data:
    {chr(10).join(summaries)}

    Explain scientifically and clearly.
    """

    reply = ask_gemini(prompt)

    return JsonResponse({
        "reply": reply,
        "used_lat": lat_n,
        "used_lon": lon_n,
    })
