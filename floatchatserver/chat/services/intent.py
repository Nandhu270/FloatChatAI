def detect_intent(text):
    t = text.lower()
    if "salinity" in t:
        return "salinity"
    if "current" in t:
        return "currents"
    if "temperature" in t or "sst" in t:
        return "sst"
    return "sst"
