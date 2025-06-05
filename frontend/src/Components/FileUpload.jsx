import React, { useState } from 'react';
import axios from 'axios';
import './FileUpload.css';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setResult('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('audio', file);

    try {
      const response = await axios.post('http://localhost:5000/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data.result);
    } catch (error) {
      console.error('Error uploading file:', error);
      setResult('Error processing file.');
    }
  };

  return (
    <div className="file-upload-container">
      <h1 className="title">🎧 AI Voice Detection Portal</h1>
      <h2 className="subtitle">📁 Upload Audio</h2>

      <div className="upload-box">
        <label className="label">Upload Audio File</label>
        <input type="file" onChange={handleFileChange} accept="audio/*" className="input-file" />
        <button onClick={handleUpload} className="upload-button">Upload and Predict</button>
      </div>

      {result && <p className="result">Result: {result}</p>}
    </div>
  );
};

export default FileUpload;
