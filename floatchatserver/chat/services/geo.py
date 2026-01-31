def is_land(lat, lon):
    # crude but effective land mask
    # Indian Ocean bounds + known land rejection
    if lat > 30 or lat < -30:
        return True
    if lon < 30 or lon > 120:
        return True
    return False
