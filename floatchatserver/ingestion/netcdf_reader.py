import xarray as xr
import pandas as pd

def read_argo_netcdf(file_path: str) -> pd.DataFrame:
    ds = xr.open_dataset(file_path)
    return ds.to_dataframe().reset_index()
