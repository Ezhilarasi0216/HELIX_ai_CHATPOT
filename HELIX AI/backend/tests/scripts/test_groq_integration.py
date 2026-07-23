import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

def test_groq_direct():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        print("❌ GROQ_API_KEY not found in .env")
        return

    print(f"Connecting to Groq with API Key: {api_key[:10]}...")
    client = Groq(api_key=api_key)
    
    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a helpful assistant. Respond with a JSON object containing a 'message' key."},
                {"role": "user", "content": "Hello!"}
            ],
            response_format={"type": "json_object"}
        )
        print("✅ Connection successful!")
        print("Response:", completion.choices[0].message.content)
    except Exception as e:
        print(f"❌ Connection failed: {e}")

if __name__ == "__main__":
    test_groq_direct()
