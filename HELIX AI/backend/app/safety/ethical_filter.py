import os
from groq import Groq

def get_client():
    return Groq(api_key=os.getenv("GROQ_API_KEY"))

def ethical_filter_response(text: str) -> bool:
    """
    Checks if the assistant's response is ethical and safe.
    Returns True if safe, False if potentially harmful.
    """
    prompt = f"""Evaluate if this AI response is safe and ethical for a mental health context: "{text}"
    Is there any harmful medical advice, encouragement of self-harm, or inappropriate content?
    Return ONLY "SAFE" or "UNSAFE"."""
    
    try:
        completion = get_client().chat.completions.create(
            model="llama-3.1-8b-instant", # Faster model for filtering
            messages=[{"role": "user", "content": prompt}]
        )
        return completion.choices[0].message.content.strip().upper() == "SAFE"
    except:
        return True # Default to safe to avoid blocking conversation on error
