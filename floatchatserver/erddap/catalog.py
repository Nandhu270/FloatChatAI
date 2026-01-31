ERDDAP_DATASETS = {
    "sst": {
        "5day": ("pmelTao5daySst", ["T_25"]),
        "daily": ("pmelTaoDySst", ["T_25"]),
        "monthly": ("pmelTaoMonSst", ["T_25"]),
        "label": "Sea Surface Temperature (°C)",
    },
    "temperature": {
        "5day": ("pmelTao5dayAirt", ["AT_21"]),
        "daily": ("pmelTaoDyT", ["T_20"]),
        "monthly": ("pmelTaoMonT", ["T_20"]),
        "label": "Temperature (°C)",
    },
    "salinity": {
        "5day": ("pmelTao5dayS", ["S_41"]),
        "daily": ("pmelTaoDyS", ["S_41"]),
        "monthly": ("pmelTaoMonS", ["S_41"]),
        "label": "Salinity (PSU)",
    },
    "currents": {
        "5day": ("pmelTao5dayCur", ["U_320","V_321","CS_300","CD_310"]),
        "daily": ("pmelTaoDyCur", ["U_320","V_321","CS_300","CD_310"]),
        "monthly": ("pmelTaoMonCur", ["U_320","V_321","CS_300","CD_310"]),
        "label": "Ocean Currents",
    },
}
