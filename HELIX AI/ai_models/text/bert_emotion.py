import random

class BertEmotionAnalyzer:
    def __init__(self):
        # In a real scenario, we would load the model/tokenizer here
        self.emotions = ["happy", "sad", "angry", "fear", "neutral", "surprise"]

    def predict(self, text: str):
        """
        Mock prediction function.
        In reality, this would tokenize input and run inference.
        """
        # Simple rule-based mock for testing
        text = text.lower()
        if "sad" in text or "depressed" in text or "lonely" in text:
            return {"emotion": "sad", "confidence": 0.95}
        elif "happy" in text or "joy" in text or "great" in text:
            return {"emotion": "happy", "confidence": 0.95}
        elif "angry" in text or "mad" in text or "hate" in text:
            return {"emotion": "angry", "confidence": 0.90}
        
        # Random fallback
        return {
            "emotion": "neutral",
            "confidence": round(random.uniform(0.5, 0.8), 2)
        }
