from ai_models.face.cnn_expression import CNNExpressionModel

model = CNNExpressionModel()

def analyze_face_emotion(image_data):
    return model.predict(image_data)
