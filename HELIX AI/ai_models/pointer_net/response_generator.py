import random

class ResponseGenerator:
    def __init__(self):
        # Placeholder for Tokenizer/Model loading (e.g., T5, BART, GPT)
        pass

    def generate(self, user_input: str, emotion_context: dict = None):
        """
        Generates a response based on user input and emotion context.
        """
        # Mock logic to simulate context-aware generation
        user_input = user_input.lower()
        
        emotion = "neutral"
        if emotion_context and "emotion" in emotion_context:
            emotion = emotion_context["emotion"]

        responses = {
            "sad": [
                "I'm sorry to hear you're feeling down. Has something specific happened?",
                "It sounds like a heavy day. I'm here to listen if you want to unload.",
                "I hear sadness in your words. Please take your time, I am here with you."
            ],
            "happy": [
                "That sounds wonderful! What made you feel this way?",
                "It's great to hear some positive news! Tell me more.",
                "I'm glad you're feeling good. Holding onto these moments is so important."
            ],
            "angry": [
                "It sounds like you're really frustrated. Do you want to vent about it?",
                "I can hear the anger in your message. It's safe to let it out here.",
                "That sounds unfair. I understand why you'd be upset."
            ],
            "default": [
                "I hear you. Could you tell me more?",
                "Thank you for sharing that with me.",
                "I am listening. Go on.",
                "How does that make you feel?"
            ]
        }

        # Select response category
        if emotion in responses:
            pool = responses[emotion]
        else:
            pool = responses["default"]

        return random.choice(pool)
