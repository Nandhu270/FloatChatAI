import os
import google.generativeai as genai

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

MODEL = "gemini-3-flash-preview"

def summarize_with_gemini(prompt):
    try:
        model = genai.GenerativeModel(MODEL)
        res = model.generate_content(prompt)
        return res.text.strip()
    except Exception:
        return "Data available but could not be summarized."
