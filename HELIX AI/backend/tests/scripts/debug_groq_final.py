import os
from groq import Groq
from dotenv import load_dotenv

# Explicitly load from the absolute path to be sure
env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
load_dotenv(dotenv_path=env_path)

def debug_groq():
    api_key = os.getenv("GROQ_API_KEY")
    print(f"DEBUG: Using API Key: {api_key}")
    
    if not api_key:
        print("ERROR: GROQ_API_KEY not found")
        return

    client = Groq(api_key=api_key)
    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": "Say hello"}],
            max_tokens=10
        )
        print("SUCCESS:", completion.choices[0].message.content)
    except Exception as e:
        print(f"FAILED: {type(e).__name__}: {e}")

if __name__ == "__main__":
    debug_groq()
