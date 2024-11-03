import sys
import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
import numpy as np
import librosa
import tensorflow as tf
from tensorflow.keras.layers import Input, Conv2D, MaxPooling2D, Flatten, Dense, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.utils import to_categorical

# Set TensorFlow options to disable oneDNN optimizations (for consistency)


# Ensure UTF-8 encoding for stdout and stderr
if not sys.stdout.encoding.lower() == 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')
if not sys.stderr.encoding.lower() == 'utf-8':
    sys.stderr.reconfigure(encoding='utf-8')

# Ensure the audio file path is passed correctly
audio_file_path = sys.argv[1].strip('"')

# Check if the file exists
if not os.path.exists(audio_file_path):
    raise FileNotFoundError(f"Audio file not found at {audio_file_path}")

# Parameters
SAMPLE_RATE = 16000
DURATION = 5
N_MELS = 128
MAX_TIME_STEPS = 109
NUM_CLASSES = 2

try:
    # Load and process the audio file using librosa
    audio, _ = librosa.load(audio_file_path, sr=SAMPLE_RATE, duration=DURATION)
    mel_spectrogram = librosa.feature.melspectrogram(y=audio, sr=SAMPLE_RATE, n_mels=N_MELS)
    mel_spectrogram = librosa.power_to_db(mel_spectrogram, ref=np.max)

    # Ensure all spectrograms have the same width (time steps)
    if mel_spectrogram.shape[1] < MAX_TIME_STEPS:
        mel_spectrogram = np.pad(mel_spectrogram, ((0, 0), (0, MAX_TIME_STEPS - mel_spectrogram.shape[1])), mode='constant')
    else:
        mel_spectrogram = mel_spectrogram[:, :MAX_TIME_STEPS]

    # Reshape the input to match the expected input shape of the model
    X = np.array([mel_spectrogram]).reshape(1, N_MELS, MAX_TIME_STEPS, 1)
    y = np.array([0])  # Example label; modify this for your dataset

    # One-hot encode the labels
    y_encoded = to_categorical(y, NUM_CLASSES)

    # Define the CNN model architecture
    input_shape = (N_MELS, MAX_TIME_STEPS, 1)
    model_input = Input(shape=input_shape)

    x = Conv2D(32, kernel_size=(3, 3), activation='relu')(model_input)
    x = MaxPooling2D(pool_size=(2, 2))(x)
    x = Conv2D(64, kernel_size=(3, 3), activation='relu')(x)
    x = MaxPooling2D(pool_size=(2, 2))(x)
    x = Flatten()(x)
    x = Dense(128, activation='relu')(x)
    x = Dropout(0.5)(x)
    model_output = Dense(NUM_CLASSES, activation='softmax')(x)

    model = Model(inputs=model_input, outputs=model_output)

    # Compile the model
    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

    # Train the model
    model.fit(X, y_encoded, batch_size=1, epochs=10)

    # Save the model
    model.save('audio_classifier.keras')
    print("Model training completed and saved.")

except Exception as e:
    print(f"Error: {str(e)}", file=sys.stderr)
    sys.exit(1)
