from datetime import datetime, timedelta

def resolve_dates(user_date):
    today = datetime.utcnow().date()
    start = today - timedelta(days=60)

    if user_date:
        try:
            d = datetime.fromisoformat(user_date).date()
        except Exception:
            return None, None, False

        if d < start or d > today:
            return None, None, False

        return d, start, True

    return today, start, True
