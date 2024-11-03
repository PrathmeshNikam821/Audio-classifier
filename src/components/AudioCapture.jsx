import React, { useState, useEffect } from 'react';
import './AudioCapture.css'; // Import the CSS file
import axios from 'axios'; // Import axios for uploading the audio

const AudioCapture = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaStream, setMediaStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null); // State to hold recorded audio blob

  useEffect(() => {
    // Clean up media stream when component unmounts
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [mediaStream]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMediaStream(stream);
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      const chunks = [];
      recorder.ondataavailable = (event) => {
        chunks.push(event.data); // Store audio data chunks
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/wav' }); // Create a Blob from the audio chunks
        setAudioBlob(blob); // Save the blob in state
        await uploadAudio(blob); // Upload the audio after stopping
      };

      recorder.start(); // Start recording
      setIsRecording(true);
      console.log('Recording started');
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop(); // Stop the recording
      setIsRecording(false);
      console.log('Recording stopped');
    }
  };

  const uploadAudio = async (blob) => {
    const formData = new FormData();
    formData.append('audiofile', blob, 'recording.wav'); // Append the blob to FormData

    try {
      const response = await axios.post('http://localhost:3000/train', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Audio uploaded successfully:', response.data);
    } catch (error) {
      console.error('Error while uploading the audio:', error);
    }
  };

  return (
    <div className="audio-capture"> {/* Apply CSS class here */}
      
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {isRecording && <p>Recording audio...</p>}
    </div>
  );
};

export default AudioCapture;
