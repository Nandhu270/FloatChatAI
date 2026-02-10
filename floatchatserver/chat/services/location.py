def classify_location(lat, lon):
    # LAND (India mainland approximate check - simple bounding box exclusion)
    # This is a Rough approximation. For precise land detection, a shapefile or specialized lib is needed.
    # We keep the previous logic but ensure "Indian Waters" is prioritized correctly if not on land.
    
    # Rough approximation of India Land Mass
    if 8 <= lat <= 37 and 68 <= lon <= 97:
        # Exclude known ocean regions inside this box (Arabian Sea / Bay of Bengal parts)
        # S. Arabian Sea (approx)
        if (lon <= 75 and lat <= 23): 
            pass # It is water
        # Bay of Bengal (approx)
        elif (lon >= 80 and lat <= 22):
            pass # It is water
        else:
            return "Land", "Coordinates appear to fall on the Indian mainland."

    # INDIAN WATERS (Indian Ocean EEZ approximate)
    # Extended box to cover relevant IO region
    if -10 <= lat <= 30 and 40 <= lon <= 110:
        return "Indian Waters", "Location lies within the Indian Ocean region."

    return "Outside Region", "Location is outside the primary Indian Ocean monitoring area."
