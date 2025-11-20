import React, { useState } from 'react';
import './Tools.css';

const CarRecognizer = ({ sessionToken }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setPrediction(null);
      setError('');
    }
  };

  const recognizeCar = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Convert image URL back to file
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      const file = new File([blob], 'car.jpg', { type: 'image/jpeg' });

      const formData = new FormData();
      formData.append('image', file);

      const apiResponse = await fetch('http://localhost:8080/api/ai-tools/car-recognition', {
        method: 'POST',
        headers: {
          'Authorization': sessionToken
        },
        body: formData
      });

      const data = await apiResponse.json();
      
      if (data.success) {
        setPrediction(data);
      } else {
        setError(data.error || 'Recognition failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getBrandEmoji = (brand) => {
    const emojis = {
      'BMW': '🚗',
      'Mercedes': '🏎️',
      'Audi': '🚙'
    };
    return emojis[brand] || '🚗';
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1>🚗 Car Brand Recognizer</h1>
        <p>Upload a car photo to identify BMW, Mercedes, or Audi</p>
      </div>

      <div className="upload-section">
        <div className="image-upload-area">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
            id="car-upload"
          />
          <label htmlFor="car-upload" className="upload-label">
            {selectedImage ? (
              <img src={selectedImage} alt="Selected car" className="preview-image" />
            ) : (
              <div className="upload-placeholder">
                <div className="upload-icon">📸</div>
                <h3>Upload Car Photo</h3>
                <p>Click to select an image</p>
              </div>
            )}
          </label>
        </div>

        {selectedImage && (
          <button 
            onClick={recognizeCar} 
            disabled={loading}
            className="predict-btn"
          >
            {loading ? '🔍 Recognizing...' : '🚗 Identify Car'}
          </button>
        )}
      </div>

      {error && (
        <div className="error-message">❌ {error}</div>
      )}

      {prediction && (
        <div className="prediction-result">
          <h3>🎯 Recognition Result</h3>
          <div className="car-result">
            <div className="brand-emoji">
              {getBrandEmoji(prediction.predicted_brand)}
            </div>
            <div className="brand-details">
              <div className="brand-name">{prediction.predicted_brand}</div>
              <div className="confidence">
                Confidence: {prediction.confidence?.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarRecognizer;