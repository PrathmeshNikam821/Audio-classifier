import os
import sys
import numpy as np
from tensorflow.keras.models import load_model
from feature import extract_features_with_spectrogram

# Path to your trained model
MODEL_PATH = "../Model/Models/model.h5"  # Adjust if your model file is named differently

# Load the trained model
model = load_model(MODEL_PATH)

# Predict function
def predict_audio(file_path):
    try:
        # Extract features from the audio file
        features = extract_features_with_spectrogram(file_path, max_len=130)

        if features is None or features.shape != (130, 156):
            raise ValueError(f"Invalid shape {features.shape if features is not None else None}, expected (130, 156)")

        # Reshape for prediction (batch size = 1)
        input_data = features.reshape(1, 130, 156)

        # Make prediction
        prediction = model.predict(input_data)[0][0]

        # Interpret result (assuming binary classification)
        label = "Real" if prediction < 0.5 else "Synthetic"
        confidence = 1 - prediction if prediction < 0.5 else prediction

        print(f"Prediction: {label} ({confidence:.2f} confidence)")
        return label, confidence

    except Exception as e:
        print(f"Error in prediction: {e}")
        return None, 0.0

# Example usage
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Please provide the audio file path.")
        sys.exit(1)

    test_file = sys.argv[1]  # Now it takes the file dynamically from command-line
    predict_audio(test_file)
