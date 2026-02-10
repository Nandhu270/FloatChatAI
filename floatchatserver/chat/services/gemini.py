import os
import json
from datetime import date
import google.generativeai as genai

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise RuntimeError("GEMINI_API_KEY environment variable not set")

genai.configure(api_key=API_KEY)

MODEL_NAME = "gemini-3-flash-preview"
model = genai.GenerativeModel(MODEL_NAME)


def summarize_with_gemini(prompt: str) -> str:
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print("Gemini summarize error:", e)
        return (
            "AI summarization is temporarily unavailable. "
            "A direct data-based explanation is provided instead."
        )


def classify_intent_and_extract(message: str) -> dict:
    today = date.today().isoformat()

    prompt = f"""
Return JSON only.

Message:
"{message}"

Rules:
- intent: greeting | data_query | general_qa
- date format: YYYY-MM-DD
- if user says today, use {today}

JSON:
{{
  "intent": "",
  "entities": {{
    "latitude": null,
    "longitude": null,
    "date": null
  }},
  "reply": ""
}}
"""

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()

        if "```" in text:
            text = text.replace("```json", "").replace("```", "").strip()

        parsed = json.loads(text)

        if parsed.get("intent") not in ["greeting", "data_query", "general_qa"]:
            parsed["intent"] = "general_qa"

        if "entities" not in parsed:
            parsed["entities"] = {}

        return parsed

    except Exception as e:
        print("Gemini classify fallback:", e)
        return {
            "intent": "general_qa",
            "entities": {},
            "reply": "Please clarify your request."
        }
