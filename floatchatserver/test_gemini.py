import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
print(f"API Key found: {'Yes' if api_key else 'No'}")

if api_key:
    client = genai.Client(api_key=api_key)
    
    print("Listing available models...")
    try:
        for m in client.models.list():
            if 'gemini' in m.name:
                print(f"Found: {m.name}")
    except Exception as e:
        print(f"List Error: {e}")

    # Fallback dry run if list fails
    models_to_try = [
        'models/gemini-1.5-flash', 
        'models/gemini-1.5-pro',
        'models/gemini-3-flash-preview'
    ]
    for model_name in models_to_try:
        # ... (keep existing loop logic if needed, but the list is more important)
        pass
