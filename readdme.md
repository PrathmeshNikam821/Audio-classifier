# 🎙️ Audio Classifier – Real vs Synthetic Voice Detection

This project detects whether a given audio file contains a **real human voice** or an **AI-generated synthetic voice** using a trained deep learning model. It includes a complete full-stack web app with a Python-based backend for ML inference and a React-based frontend for user interaction.

---

## 📌 Features

- Real-time audio upload and classification
- Uses MFCC features for voice representation
- Trained CNN + LSTM deep learning model in Keras
- User-friendly web interface (React.js)
- REST API backend (Node.js + Express)
- Preprocessed and normalized `.wav` audio input supported

---

## 🧠 Model Details

- **Architecture**: CNN + LSTM
- **Input Shape**: (130, 156)
- **Features Used**: MFCC
- **Framework**: TensorFlow / Keras
- **Trained on**: Custom dataset of real vs synthetic voice `.wav` files

---

## 📁 Project Structure

Audio-classifier/
│
├── Model/ # Trained model + feature extraction
│ ├── Models/ # model.h5 file
│ ├── feature.py # MFCC extraction logic
│ └── predict.py # Model inference
│
├── Backend/ # Node.js backend for API
│ ├── app.js
│ ├── routes/
│ ├── controllers/
│ └── uploads/ # Uploaded audio files
│
├── frontend/ # React frontend
│ └── (React components and config)
│
├── requirements.txt # Python dependencies
├── README.md




---

## 🚀 How to Run the Project

> ⚠️ Prerequisite: Install **Python 3**, **Node.js**, and **npm**



Open terminal in the root folder:

```bash
python -m venv venv
venv\Scripts\activate   # Activate python environment 
pip install -r requirements.txt


cd frontend
npm install  # install frontend dependencies 
npm run dev


cd backend
npm install  # install backend dependencies 
node app.js
```