import React from 'react';
import './FileUpload.css'

const FileUpload = ({ handleFileChange, handleSubmit, selectedFile }) => {
  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className='upload-file' style={{ marginBottom: '10px' }}>
        <input type="file" name="file" id="fileUpload" onChange={handleFileChange} />
        {selectedFile && <p style={{ marginTop: '5px' }}>Selected file: {selectedFile.name}</p>}
      
      <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px' }}>
        Upload File
      </button>
      </div>
    </form>
  );
};

export default FileUpload;
