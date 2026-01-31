def summarize(df, label):
    if df.empty:
        return "No observations available for this location and time window."

    return (
        f"{label}\n"
        f"Records: {len(df)}\n"
        f"Time range: {df['time'].min()} → {df['time'].max()}\n"
        f"Mean depth: {df['depth'].mean():.1f} m"
    )
