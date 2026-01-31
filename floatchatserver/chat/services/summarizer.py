def summarize_dataframe(df):
    if df.empty:
        return "No data available for this location in the last 5 days."

    return (
        f"Total records: {len(df)}\n"
        f"Time range: {df['time'].min()} to {df['time'].max()}\n"
        f"Mean depth: {df['depth'].mean():.1f} m"
    )
