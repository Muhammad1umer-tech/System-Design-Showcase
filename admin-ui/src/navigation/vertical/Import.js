import React, { useState } from 'react';
import axios from 'axios';
import axiosInstance from '../../Helper/axiosInstance';

const Import = () => {
  const [file, setFile] = useState(null);
  const [Error, setError] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      console.log('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axiosInstance.post('/report_to_insert_database/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('File uploaded successfully:', response.data);
      setError(response.data)
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
        <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload File</button>
        </form>

        <div style={{ marginTop: '30px' }}>
            {Error ? Error : null}
      </div>
    </div>


  );
};


export default Import;
