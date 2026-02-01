import numpy as np

LAT_GRID = np.arange(-5, 25.1, 1.0)
LON_GRID = np.arange(60, 95.1, 1.0)

def nearest_location(lat, lon):
    lat_n = LAT_GRID[np.abs(LAT_GRID - lat).argmin()]
    lon_n = LON_GRID[np.abs(LON_GRID - lon).argmin()]
    return float(lat_n), float(lon_n)
