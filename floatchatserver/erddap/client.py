import requests
import pandas as pd

BASE = "https://coastwatch.pfeg.noaa.gov/erddap/tabledap"

def fetch(dataset, variables, lat, lon, start_date, end_date):
    vars_all = ["time", "latitude", "longitude"] + variables
    var_str = ",".join(vars_all)

    url = (
        f"{BASE}/{dataset}.json?"
        f"{var_str}"
        f"&latitude>={lat-1}&latitude<={lat+1}"
        f"&longitude>={lon-1}&longitude<={lon+1}"
        f"&time>={start_date}&time<={end_date}"
        f"&array=\"RAMA\""
    )

    try:
        r = requests.get(url, timeout=10)
        if r.status_code != 200:
            return pd.DataFrame()

        data = r.json()
        if "table" not in data or "rows" not in data["table"]:
            return pd.DataFrame()

        rows = data["table"]["rows"]
        cols = data["table"]["columnNames"]

        return pd.DataFrame(rows, columns=cols)

    except Exception:
        return pd.DataFrame()
