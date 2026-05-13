import os
import httpx
import logging
from typing import Dict, List

logger = logging.getLogger(__name__)

# Severity-based keyword mapping
CRITICAL_KEYWORDS = [
    "suicide", "kill myself", "end my life", "want to die", "no reason to live",
    "தற்கொலை", "சாக வேண்டும்", "இறக்க வேண்டும்"
]

HIGH_KEYWORDS = [
    "self harm", "hurt myself", "cut myself", "hopeless", "worthless", "can't go on",
    "வலி தாங்க முடியல", "நம்பிக்கை இல்லை", "பிரயோஜனம் இல்லை"
]

MEDIUM_KEYWORDS = [
    "depressed", "sad", "alone", "empty", "numb", "dark thoughts",
    "தனிமை", "வெறுமை", "சோகம்"
]

async def detect_crisis(text: str) -> str:
    """Detects crisis level (strictly returns string: CRITICAL, HIGH, MEDIUM, LOW)"""
    text_lower = text.lower()
    
    # 1. Keyword-based detection (Immediate)
    if any(k in text_lower for k in CRITICAL_KEYWORDS):
        return "CRITICAL"
    if any(k in text_lower for k in HIGH_KEYWORDS):
        return "HIGH"
    
    # 2. LLM-based contextual analysis
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key: return "LOW"
    
    prompt = f'Analyze text for suicide/self-harm risk: "{text}"\nReturn ONLY ONE WORD: CRITICAL, HIGH, MEDIUM, or LOW.'
    
    try:
        async with httpx.AsyncClient(timeout=4.0) as client:
            response = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={"Authorization": f"Bearer {api_key}"},
                json={
                    "model": "llama-3.3-70b-versatile",
                    "messages": [{"role": "user", "content": prompt}]
                }
            )
            if response.status_code == 200:
                result = response.json()['choices'][0]['message']['content'].strip().upper()
                if "CRITICAL" in result: return "CRITICAL"
                if "HIGH" in result: return "HIGH"
                if "MEDIUM" in result: return "MEDIUM"
                return "LOW"
    except Exception as e:
        logger.error(f"LLM Crisis check failed: {e}")
        
    return "LOW"


def _get_recommended_actions(severity: str) -> List[str]:
    """Returns recommended actions based on severity."""
    if severity == "critical":
        return [
            "immediate_helpline_call",
            "emergency_contact_alert",
            "breathing_exercise",
            "safety_plan_review"
        ]
    elif severity == "high":
        return [
            "helpline_call_suggested",
            "breathing_exercise",
            "distraction_techniques",
            "journal_prompt"
        ]
    elif severity == "medium":
        return [
            "breathing_exercise",
            "mood_tracking",
            "self_care_suggestions"
        ]
    else:
        return ["continue_conversation"]

def _get_helpline_numbers() -> List[Dict]:
    """Returns India-specific mental health helpline numbers."""
    return [
        {
            "name": "AASRA",
            "number": "+91-9820466726",
            "available": "24/7",
            "languages": ["English", "Hindi"]
        },
        {
            "name": "Vandrevala Foundation",
            "number": "1860-2662-345",
            "available": "24/7",
            "languages": ["English", "Hindi", "Tamil", "Telugu"]
        },
        {
            "name": "iCall",
            "number": "+91-9152987821",
            "available": "Mon-Sat, 8 AM - 10 PM",
            "languages": ["English", "Hindi"]
        },
        {
            "name": "Sneha India",
            "number": "+91-44-24640050",
            "available": "24/7",
            "languages": ["English", "Tamil", "Hindi"]
        }
    ]

def _get_supportive_message(severity: str) -> str:
    """Returns appropriate supportive message based on severity."""
    if severity == "critical":
        return "நீங்க தனியா இல்லை. உங்க வாழ்க்கை மதிப்புள்ளது. உடனடியாக உதவி கிடைக்கும். / You're not alone. Your life matters. Help is available right now."
    elif severity == "high":
        return "நான் உங்களுக்காக இங்கே இருக்கேன். இந்த கடினமான நேரத்தை நாம் சேர்ந்து கடக்கலாம். / I'm here for you. We can get through this difficult time together."
    elif severity == "medium":
        return "உங்க உணர்வுகள் முக்கியம். நான் கேட்கிறேன். / Your feelings matter. I'm listening."
    else:
        return "நான் உங்களுக்கு உதவ இங்கே இருக்கேன். / I'm here to help you."
