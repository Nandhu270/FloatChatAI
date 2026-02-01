def build_summary_prompt(facts):
    lines = "\n".join([f"- {k}: {v}" for k, v in facts.items()])

    return f"""
You are an oceanographic summarization assistant.

FACTS (5-day RAMA data):
{lines}

RULES:
- Do NOT invent values
- Do NOT estimate numbers
- Summarize availability and spatial behavior only
- Max 3 bullet points
"""
