import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GROQ_API_KEY")
client = Groq(api_key=api_key)

try:
    print("Listing Groq models...")
    models = client.models.list()
    for model in models.data:
        print(f"Model ID: {model.id}")
except Exception as e:
    print(f"Error listing Groq models: {e}")
