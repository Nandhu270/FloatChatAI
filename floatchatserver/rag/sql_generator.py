from .gemini_client import get_model

PROMPT = """
You are an oceanographic SQL assistant.

Table: ArgoProfile
Columns:
float_id, latitude, longitude, timestamp, depth, temperature, salinity

Rules:
- ONLY SELECT queries
- MySQL syntax
- Always add LIMIT 100

Question:
{question}

SQL:
"""

def nl_to_sql(question: str) -> str:
    model = get_model()
    response = model.generate_content(
        PROMPT.format(question=question)
    )
    return response.text.strip()
