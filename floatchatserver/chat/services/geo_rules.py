# chat/services/geo_rules.py

def classify_location(lat, lon):
    """
    Classify coordinates into:
    - land (India or nearby countries)
    - indian_ocean (within RAMA / Indian Ocean domain)
    - other_ocean
    """

    # ---- LAND MASKS ----

    # India
    if 6 <= lat <= 36 and 68 <= lon <= 97:
        return {"type": "land", "place": "India"}

    # Sri Lanka
    if 5 <= lat <= 10 and 79 <= lon <= 82:
        return {"type": "land", "place": "Sri Lanka"}

    # Pakistan coast
    if 23 <= lat <= 26 and 60 <= lon <= 68:
        return {"type": "land", "place": "Pakistan"}

    # Oman / Arabian Peninsula
    if 16 <= lat <= 26 and 52 <= lon <= 60:
        return {"type": "land", "place": "Oman"}

    # ---- INDIAN OCEAN / RAMA DOMAIN ----
    if -30 <= lat <= 30 and 30 <= lon <= 120:
        return {"type": "indian_ocean", "place": None}

    # ---- OTHER OCEANS ----
    return {"type": "other_ocean", "place": None}
