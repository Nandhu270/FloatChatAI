from core.models import ArgoProfile
from .netcdf_reader import read_argo_netcdf

def ingest_file(file_path: str):
    df = read_argo_netcdf(file_path)

    objs = []
    for _, row in df.iterrows():
        objs.append(
            ArgoProfile(
                float_id=row["PLATFORM_NUMBER"],
                latitude=row["LATITUDE"],
                longitude=row["LONGITUDE"],
                timestamp=row["TIME"],
                depth=row["DEPTH"],
                temperature=row["TEMP"],
                salinity=row.get("PSAL"),
            )
        )

    ArgoProfile.objects.bulk_create(objs, batch_size=1000)
