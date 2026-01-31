def choose_resolution(user_text):
    text = user_text.lower()
    if "monthly" in text or "long term" in text:
        return "monthly"
    if "daily" in text:
        return "daily"
    return "5day"
