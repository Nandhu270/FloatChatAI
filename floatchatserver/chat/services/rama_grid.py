import numpy as np

RAMA_LAT = np.arange(-15, 15.1, 2)
RAMA_LON = np.arange(40, 100.1, 5)

def nearest_rama(lat, lon):
    lat_n = RAMA_LAT[np.abs(RAMA_LAT - lat).argmin()]
    lon_n = RAMA_LON[np.abs(RAMA_LON - lon).argmin()]
    return float(lat_n), float(lon_n)
