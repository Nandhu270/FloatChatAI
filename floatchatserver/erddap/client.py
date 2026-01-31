import requests
import pandas as pd

BASE = "https://coastwatch.pfeg.noaa.gov/erddap/tabledap"

def fetch_erddap(dataset, variables, lat, lon, start, end):
    cols = ",".join(["time","latitude","longitude","depth"] + variables)

    url = (
        f"{BASE}/{dataset}.json?"
        f"{cols}"
        f"&latitude>={lat-0.5}&latitude<={lat+0.5}"
        f"&longitude>={lon-0.5}&longitude<={lon+0.5}"
        f"&time>={start}&time<={end}"
        f"&array=\"RAMA\""
    )

    r = requests.get(url, timeout=30)

    if r.status_code == 404:
        return pd.DataFrame()

    r.raise_for_status()
    table = r.json()["table"]
    return pd.DataFrame(table["rows"], columns=table["columnNames"])
