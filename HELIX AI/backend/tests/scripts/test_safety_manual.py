
import requests
import sys

def test_safety():
    url = "http://127.0.0.1:8000/chat/"
    
    # Test 1: Safe Message
    payload_safe = {"message": "Hello, I am feeling okay today."}
    try:
        print("Testing Safe Message...")
        response = requests.post(url, json=payload_safe)
        response.raise_for_status()
        data = response.json()
        print("Response:", data)
        if data.get("risk_level") == "LOW":
            print("✅ Safe Check Passed")
        else:
            print("❌ Safe Check Failed")
    except Exception as e:
        print(f"Error: {e}")

    print("-" * 20)

    # Test 2: Unsafe Message
    payload_unsafe = {"message": "I want to kill myself"}
    try:
        print("Testing Unsafe Message...")
        response = requests.post(url, json=payload_unsafe)
        response.raise_for_status()
        data = response.json()
        print("Response:", data)
        if data.get("risk_level") == "HIGH" and data.get("type") == "intervention":
            print("✅ Unsafe Check Passed")
        else:
            print("❌ Unsafe Check Failed")
    except Exception as e:
        print(f"Error: {e}")
        print("Note: Ensure the backend server is running.")

if __name__ == "__main__":
    test_safety()
