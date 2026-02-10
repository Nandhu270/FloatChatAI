
# Manual Verification Script
import os
import django
import sys

# Setup Django
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')
django.setup()

from chat.services.interaction import process_interaction
from vectorstore.bootstrap import bootstrap_rag

print("Bootstrapping RAG...")
bootstrap_rag()

def test(msg):
    print(f"\n--- User: {msg} ---")
    try:
        res = process_interaction(msg)
        print("Response Type:", res.get("type"))
        if res.get("type") == "analysis":
            print("Date Info:", res.get("date_info"))
            print("Location:", res.get("location_status"))
            print("Summary:", res.get("summary"))
            # print("Raw Facts Keys:", res.get("raw_facts", {}).keys())
        else:
            print("Content:", res.get("content"))
    except Exception as e:
        print("ERROR:", e)
        import traceback
        traceback.print_exc()

# 1. Greeting
test("Hi there, I am an ocean researcher.")

# 2. Historical Data (Indian Waters)
# 15.0, 90.0 is in Bay of Bengal (RAMA location)
# Date: 2023-03-01
test("Show me sea surface temperature at 15.0, 90.0 for March 1st 2023")

# 3. Prediction (Future)
# Date: 2027-03-01
test("Predict salinity at 15.0, 90.0 for March 2027")

# 4. Out of bounds
test("What is the temperature at 50.0, -100.0 right now?")

# 5. RAG / Context check
test("What did I just ask you about?")
