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


- Model/
  - feature.py
  - predict.py
  - cnn_lstm_model.h5
- Backend/
  - app.js
  - uploads/
  - routes/
- frontend/
  - src/
  - public/
  - package.json
- requirements.txt
- README.md





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


## 🧠 Model Architecture Explanation

The core of our system is a **hybrid deep learning model** that combines **Convolutional Neural Networks (CNNs)** with **Long Short-Term Memory (LSTM)** layers. This architecture is designed to effectively capture both spatial and temporal patterns in audio features, enabling accurate classification of **AI-generated vs real human voices**.

### 🏗️ Architecture Overview

The model accepts input of shape **`(130, 156)`**, where:
- `130` = fixed time steps
- `156` = number of extracted MFCC features per frame

The layers are structured as follows:


### 📋 Model Summary

| Layer               | Output Shape | Parameters |
|--------------------|--------------|------------|
| Conv1D             | (128, 64)    | 30,784     |
| BatchNormalization | (128, 64)    | 256        |
| MaxPooling1D       | (64, 64)     | 0          |
| Dropout            | (64, 64)     | 0          |
| LSTM               | (64)         | 33,024     |
| Dense (ReLU)       | (64)         | 4,160      |
| Output (Sigmoid)   | (1)          | 65         |
| **Total Parameters**| —            | **68,289** |

### ⚙️ Training Configuration

- **Loss Function:** Binary Crossentropy  
- **Optimizer:** Adam  
- **Metric:** Accuracy  
- **Epochs:** Up to 50  
- **Batch Size:** 16  
- **Early Stopping:** Enabled (`patience=3` on `val_loss`)  
- **Validation:** Uses separate validation dataset

### 💻 Hardware / Software Requirements

| Component             | Specification                |
|----------------------|------------------------------|
| **Operating System** | Windows 10 / 11              |
| **RAM**              | 8 GB                         |
| **GPU** (Optional)   | NVIDIA GTX 1650              |
| **Python**           | 3.9                          |
| **TensorFlow**       | 2.12+                        |
| **librosa**          | 0.10+                        |
| **Node.js**          | 18.x (Backend)               |
| **React.js**         | 18.x (Frontend)              |
