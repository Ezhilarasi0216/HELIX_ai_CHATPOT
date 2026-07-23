import os
import json
import httpx
import logging

logger = logging.getLogger(__name__)

async def analyze_text_emotion(text: str):
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return {"Joy": 0, "Trust": 0, "Fear": 0, "Surprise": 0, "Sadness": 0, "Disgust": 0, "Anger": 0, "Anticipation": 0}
    
    prompt = f"""Analyze the emotions in this text: "{text}"
    Return ONLY a JSON object with Plutchnik's 8 emotions (Joy, Trust, Fear, Surprise, Sadness, Disgust, Anger, Anticipation) as keys and values from 0.0 to 1.0.
    Example: {{"Joy": 0.5, "Trust": 0.3, ...}}"""
    
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "llama-3.3-70b-versatile",
                    "messages": [{"role": "user", "content": prompt}]
                }
            )
            if response.status_code != 200:
                return {"Joy": 0, "Trust": 0, "Fear": 0, "Surprise": 0, "Sadness": 0, "Disgust": 0, "Anger": 0, "Anticipation": 0}
            
            data = response.json()
            content = data['choices'][0]['message']['content']
            
            # Simple extractor
            import re
            match = re.search(r'\{.*\}', content, re.DOTALL)
            if match:
                return json.loads(match.group(0))
            return json.loads(content)
            
    except Exception as e:
        logger.error(f"Emotion analysis failed: {e}")
        return {"Joy": 0, "Trust": 0, "Fear": 0, "Surprise": 0, "Sadness": 0, "Disgust": 0, "Anger": 0, "Anticipation": 0}

