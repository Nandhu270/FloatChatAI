def classify_location(lat, lon):
    # LAND (India mainland)
    if 8 <= lat <= 37 and 68 <= lon <= 97:
        # Exclude known ocean regions
        if (lon <= 75 and lat <= 23) or (lon >= 80 and lat <= 22):
            pass
        else:
            return "Land", "Coordinates fall on land within India"

    # INDIAN WATERS (approx EEZ)
    if 5 <= lat <= 25 and 60 <= lon <= 90:
        return "Indian Waters", "Location lies within Indian maritime waters"

    return "Outside India", "Location is outside Indian maritime boundaries"
