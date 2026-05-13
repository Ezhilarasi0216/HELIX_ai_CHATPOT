def final_emotion(text_score: float = 0.0, voice_score: float = 0.0, face_score: float = 0.0, bio_score: float = 0.0):
    """
    Aggregates emotion scores from text, voice, face, and bio data.
    Weights: Text (0.4), Voice (0.3), Face (0.2), Bio (0.1)
    """
    # Note: This implies the scores are normalized (e.g., probability of a specific emotion)
    # The current mock text model returns a dict, so we might need to adjust how we aggregate in a real scenario.
    # For this function, we assume we are aggregating a 'stress' or 'negative' score for simplicity,
    # or we handle dict merging.
    
    # As per request: score = text*0.4 + voice*0.3 + face*0.2 + bio*0.1
    
    combined_score = (text_score * 0.4) + (voice_score * 0.3) + (face_score * 0.2) + (bio_score * 0.1)
    return combined_score
