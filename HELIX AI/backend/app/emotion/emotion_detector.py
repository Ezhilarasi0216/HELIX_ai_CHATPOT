import os
import json
from groq import Groq

def get_client():
    return Groq(api_key=os.getenv("GROQ_API_KEY"))

async def detect_emotion(text: str):
    """
    Detects Plutchnik's 8 emotions from text using Groq.
    """
    prompt = f"""Analyze the emotions in this text: "{text}"
    Return ONLY a JSON object with Plutchnik's 8 emotions (Joy, Trust, Fear, Surprise, Sadness, Disgust, Anger, Anticipation) as keys and values from 0.0 to 1.0.
    Example: {{"Joy": 0.5, "Trust": 0.3, "Fear": 0, "Surprise": 0, "Sadness": 0.2, "Disgust": 0, "Anger": 0, "Anticipation": 0.5}}
    """
    
    try:
        completion = get_client().chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        return json.loads(completion.choices[0].message.content)
    except Exception as e:
        print(f"Error in emotion detection: {e}")
        return {"Joy": 0, "Trust": 0, "Fear": 0, "Surprise": 0, "Sadness": 0, "Disgust": 0, "Anger": 0, "Anticipation": 0}
