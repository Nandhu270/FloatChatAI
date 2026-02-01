ERDDAP_DAILY = {
    "sea_surface_temperature": ("pmelTaoDySst", ["T_25"]),
    "air_temperature": ("pmelTaoDyT", ["T_20"]),
    "salinity": ("pmelTaoDyS", ["S_41"]),
    "sea_surface_salinity": ("pmelTaoDySss", ["S_41"]),
    "currents": ("pmelTaoDyCur", ["U_320", "V_321"]),
    "wind": ("pmelTaoDyW", ["WU_422", "WV_423"]),
    "heat_content": ("pmelTaoDyHeat", ["HTC_130"]),
    "isotherm_20c": ("pmelTaoDyIso", ["ISO_6"]),
    "sigma_theta": ("pmelTaoDySsd", ["STH_71"]),
}

ERDDAP_5DAY = {
    "sea_surface_temperature": ("pmelTao5daySst", ["T_25"]),
    "air_temperature": ("pmelTao5dayAirt", ["AT_21"]),
    "salinity": ("pmelTao5dayS", ["S_41"]),
    "sea_surface_salinity": ("pmelTao5daySss", ["S_41"]),
    "currents": ("pmelTao5dayCur", ["U_320", "V_321"]),
    "wind": ("pmelTao5dayW", ["WU_422", "WV_423"]),
    "heat_content": ("pmelTao5dayHeat", ["HTC_130"]),
    "isotherm_20c": ("pmelTao5dayIso", ["ISO_6"]),
    "sigma_theta": ("pmelTao5daySsd", ["STH_71"]),
}
