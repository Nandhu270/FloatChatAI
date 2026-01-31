import numpy as np

RAMA_LAT_GRID = np.arange(-15, 15.1, 2)
RAMA_LON_GRID = np.arange(40, 100.1, 5)

def nearest_rama(lat, lon):
    lat_n = RAMA_LAT_GRID[np.abs(RAMA_LAT_GRID - lat).argmin()]
    lon_n = RAMA_LON_GRID[np.abs(RAMA_LON_GRID - lon).argmin()]
    return float(lat_n), float(lon_n)
