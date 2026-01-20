import os
from google import genai

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def get_model(model="gemini-3-flash-preview"):
    return client.models.get(model)
