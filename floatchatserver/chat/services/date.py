from datetime import date, datetime

def resolve_dates(date_str):
    """
    Resolve user-provided date.
    If missing or invalid → default to today.
    Returns (resolved_date, is_future_relative_to_today)
    """

    if date_str:
        try:
            resolved = datetime.fromisoformat(date_str).date()
        except ValueError:
            resolved = date.today()
    else:
        resolved = date.today()

    today = date.today()
    is_future = resolved > today

    return resolved, is_future
