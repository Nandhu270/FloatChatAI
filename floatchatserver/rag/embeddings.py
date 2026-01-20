from google import genai
import os

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def embed_text(text: str) -> list:
    result = client.models.embed_content(
        model="text-embedding-004",
        contents=text
    )
    return result.embeddings[0].values
