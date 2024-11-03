import React, { useState } from 'react';
import axios from 'axios';
import FileUpload from './components/FileUpload';
import PredictionResult from './components/PredictionResult';
import AudioCapture from './components/AudioCapture';  // Import the AudioCapture component
import './App.css'; // Import the CSS file

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setPrediction('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      alert('Please select an audio file first.');
      return;
    }

    const formData = new FormData();
    formData.append('audiofile', selectedFile);

    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/train', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setPrediction(response.data.message);
    } catch (error) {
      console.error('Error while uploading the file:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (

      <div className="app-container">
        <div className="content-container">
          <h2>Audio Classifier</h2>
          <div className='audio-record'>
          <AudioCapture />
          </div>
        
         

          <FileUpload handleFileChange={handleFileChange} handleSubmit={handleSubmit} selectedFile={selectedFile} />

          {isLoading && <p>Loading...</p>}
          {!isLoading && prediction && <PredictionResult prediction={prediction} />}
        </div>
      </div>
  
  );
}

export default App;
