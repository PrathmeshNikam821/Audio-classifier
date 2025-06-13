import os
import sys
import numpy as np
import librosa
from tensorflow.keras.models import load_model
from feature import extract_features_with_spectrogram

# Path to trained model
MODEL_PATH = "../Model/Models/model.h5"

# Load model
model = load_model(MODEL_PATH)

# Constants based on your training setup
SAMPLE_RATE = 16000
CHUNK_DURATION = 5  # in seconds
CHUNK_SAMPLES = SAMPLE_RATE * CHUNK_DURATION
MAX_FRAMES = 130     # Time steps (rows)
FEATURE_DIM = 156    # Features (columns)

def predict_audio(file_path):
    try:
        # Load full audio
        y, sr = librosa.load(file_path, sr=SAMPLE_RATE)
        total_samples = len(y)
        num_chunks = int(np.ceil(total_samples / CHUNK_SAMPLES))

        print(f"\nTotal audio length: {total_samples / SAMPLE_RATE:.2f} sec ({num_chunks} segments of {CHUNK_DURATION} sec)\n")

        predictions = []

        for i in range(num_chunks):
            start = i * CHUNK_SAMPLES
            end = start + CHUNK_SAMPLES
            chunk = y[start:end]

            # Pad if too short
            if len(chunk) < CHUNK_SAMPLES:
                chunk = np.pad(chunk, (0, CHUNK_SAMPLES - len(chunk)))

            # Extract features
            features = extract_features_with_spectrogram(chunk, sr=sr, max_len=MAX_FRAMES)

            if features is None or features.shape != (MAX_FRAMES, FEATURE_DIM):
                print(f"Skipping chunk {i + 1}: Feature shape = {features.shape if features is not None else None}")
                continue

            # Reshape and predict
            input_data = features.reshape(1, MAX_FRAMES, FEATURE_DIM)
            prediction = model.predict(input_data)[0][0]

            label = "Real" if prediction > 0.5 else "Synthetic"
            confidence = 1 - prediction if prediction < 0.5 else prediction

            print(f"Chunk {i + 1}/{num_chunks}: {label} ({confidence:.2f} confidence)")
            predictions.append(label)

        # Final decision by majority vote
        if predictions:
            final_label = max(set(predictions), key=predictions.count)
            print(f"\nFinal decision (majority voting): {final_label}")
        else:
            print("No valid chunks for prediction.")

    except Exception as e:
        print(f"Error in prediction: {e}")

# Entry point
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Please provide the audio file path.")
        sys.exit(1)

    test_file = sys.argv[1]
    predict_audio(test_file)
