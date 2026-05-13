import os
import httpx
import logging

logger = logging.getLogger(__name__)

async def classify_risk(text: str) -> str:
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key: return "LOW"
    
    prompt = f"""Analyze the following text for psychological crisis or extreme distress: "{text}"
    Classify the risk level as strictly one of: HIGH, MEDIUM, LOW.
    Return ONLY: HIGH, MEDIUM, or LOW."""
    
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
                return "LOW"
            
            data = response.json()
            result = data['choices'][0]['message']['content'].strip().upper()
            if "HIGH" in result: return "HIGH"
            if "MEDIUM" in result: return "MEDIUM"
            return "LOW"
    except Exception as e:
        logger.error(f"Risk classification failed: {e}")
        return "LOW"

