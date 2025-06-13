import librosa
import numpy as np

def extract_features_with_spectrogram(audio_input, sr=16000, max_len=130):
    try:
        # Check if input is a string (file path) or a NumPy array (raw audio)
        if isinstance(audio_input, str):
            y, sr = librosa.load(audio_input, sr=sr)
        else:
            y = audio_input  # already raw waveform

        # Feature extraction
        mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        chroma = librosa.feature.chroma_stft(y=y, sr=sr)
        zcr = librosa.feature.zero_crossing_rate(y)
        rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)
        rms = librosa.feature.rms(y=y)
        mel_spec = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=128)
        mel_spec_db = librosa.power_to_db(mel_spec, ref=np.max)

        # Stack all features vertically
        combined = np.vstack([mfcc, chroma, zcr, rolloff, rms, mel_spec_db])

        # Pad or truncate to max_len columns
        if combined.shape[1] < max_len:
            pad_width = max_len - combined.shape[1]
            combined = np.pad(combined, pad_width=((0, 0), (0, pad_width)), mode='constant')
        else:
            combined = combined[:, :max_len]

        return combined.T  # Shape: (max_len, 156)

    except Exception as e:
        print(f"Feature extraction error: {e}")
        return None
