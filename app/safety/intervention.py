def get_intervention(risk_level: str):
    """
    Returns intervention resources based on risk level.
    """
    if risk_level == "HIGH":
        return {
            "action": "SOS",
            "message": "It sounds like you are going through a really difficult time. Please know you are not alone.",
            "resources": [
                {"name": "National Suicide Prevention Lifeline", "number": "988"},
                {"name": "Crisis Text Line", "number": "Text HOME to 741741"},
                {"name": "Emergency Services", "number": "911"}
            ],
            "block_chat": True # Optional flag to stop AI processing
        }
    
    if risk_level == "MEDIUM":
        return {
            "action": "SUPPORT",
            "message": "I hear that you are in pain. I'm here to listen.",
            "resources": [],
            "block_chat": False
        }
        
    return None
