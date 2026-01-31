import google.generativeai as genai
import os

# configure once
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# ✅ STABLE MODEL (v1beta compatible)
model = genai.GenerativeModel("gemini-3-flash-preview")

def ask_gemini(prompt):
    response = model.generate_content(prompt)
    return response.text
