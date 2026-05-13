from ai_models.voice.lstm_stress import LSTMStressModel

model = LSTMStressModel()

def analyze_voice_stress(audio_data):
    return model.predict(audio_data)
