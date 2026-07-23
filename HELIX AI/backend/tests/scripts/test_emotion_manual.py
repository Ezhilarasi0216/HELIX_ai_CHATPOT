
import requests
import sys

def test_emotion():
    url = "http://127.0.0.1:8000/emotion/analyze/text"
    payload = {"text": "I am feeling very sad and lonely today."}
    
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        print("Response:", response.json())
        
        if response.json().get("emotion") == "sad":
            print("✅ Status Check Passed")
        else:
            print("❌ Status Check Failed")
            
    except Exception as e:
        print(f"Error: {e}")
        # We expect a connection error since the server isn't actually running in this environment
        # But this script is for the user or a future 'run' step if I could start the server.
        print("Note: Ensure the backend server is running (uvicorn backend.app.main:app) before running this script.")

if __name__ == "__main__":
    test_emotion()
