import React, { useState } from 'react';
import './Tools.css';

const WeatherPredictor = ({ sessionToken }) => {
  const [formData, setFormData] = useState({
    temperature: '',
    humidity: '',
    windSpeed: '',
    pressure: '',
    rainfall: ''
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const predictWeather = async () => {
    // Validate inputs
    if (!formData.temperature || !formData.humidity || !formData.windSpeed || 
        !formData.pressure || !formData.rainfall) {
      setError('Please fill in all weather parameters');
      return;
    }

    setLoading(true);
    setError('');
    setPrediction(null);

    try {
      const response = await fetch('http://localhost:8080/api/ai-tools/weather-prediction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionToken
        },
        body: JSON.stringify({
          temperature: parseFloat(formData.temperature),
          humidity: parseFloat(formData.humidity),
          windSpeed: parseFloat(formData.windSpeed),
          pressure: parseFloat(formData.pressure),
          rainfall: parseFloat(formData.rainfall)
        })
      });

      const data = await response.json();
      
      if (data.error) {
        setError(data.message || 'Weather prediction failed');
      } else if (data.success) {
        setPrediction(data);
      } else {
        setError('Weather prediction failed. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please check if backend is running.');
      console.error('Weather prediction error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const getWeatherIcon = (condition) => {
    const icons = {
      'Sunny': '☀️',
      'Partly Cloudy': '⛅',
      'Cloudy': '☁️',
      'Light Rain': '🌦️',
      'Heavy Rain': '🌧️',
      'Drizzle': '💧',
      'Foggy': '🌫️',
      'Cold': '❄️'
    };
    return icons[condition] || '🌤️';
  };

  const loadSampleData = () => {
    setFormData({
      temperature: '21.5',
      humidity: '75',
      windSpeed: '15.0',
      pressure: '1012.0',
      rainfall: '0.5'
    });
    setError('');
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1>🌤️ Weather Predictor</h1>
        <p>AI-powered next-day weather prediction for Auckland</p>
      </div>

      <div className="form-section">
        <div className="form-group">
          <label>Current Temperature (°C)</label>
          <input
            type="number"
            step="0.1"
            value={formData.temperature}
            onChange={(e) => handleInputChange('temperature', e.target.value)}
            placeholder="e.g., 21.5"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Humidity (%)</label>
          <input
            type="number"
            step="0.1"
            value={formData.humidity}
            onChange={(e) => handleInputChange('humidity', e.target.value)}
            placeholder="e.g., 75"
            min="0"
            max="100"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Wind Speed (km/h)</label>
          <input
            type="number"
            step="0.1"
            value={formData.windSpeed}
            onChange={(e) => handleInputChange('windSpeed', e.target.value)}
            placeholder="e.g., 15.0"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Pressure (hPa)</label>
          <input
            type="number"
            step="0.1"
            value={formData.pressure}
            onChange={(e) => handleInputChange('pressure', e.target.value)}
            placeholder="e.g., 1012.0"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Rainfall (mm)</label>
          <input
            type="number"
            step="0.1"
            value={formData.rainfall}
            onChange={(e) => handleInputChange('rainfall', e.target.value)}
            placeholder="e.g., 0.5"
            min="0"
            disabled={loading}
          />
        </div>

        <div className="form-actions">
          <button 
            onClick={predictWeather} 
            disabled={loading}
            className="predict-btn"
          >
            {loading ? '🌤️ Predicting...' : '🌤️ Predict Weather'}
          </button>
          
          <button 
            onClick={loadSampleData}
            type="button"
            className="sample-btn"
          >
            📊 Load Sample Data
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      {prediction && (
        <div className="prediction-result">
          <h3>🌤️ Tomorrow's Weather Forecast</h3>
          
          <div className="weather-display">
            <div className="weather-icon">
              {getWeatherIcon(prediction.weatherCondition)}
            </div>
            <div className="weather-details">
              <div className="temperature">
                {prediction.predictedTemperature}°C
              </div>
              <div className="condition">
                {prediction.weatherCondition}
              </div>
              <div className="rainfall">
                Rainfall: {prediction.predictedRainfall} mm
              </div>
            </div>
          </div>
          
          {prediction.confidence && (
            <div className="confidence-badge">
              🤖 ML Confidence: {prediction.confidence}%
            </div>
          )}

          {prediction.factors && prediction.factors.length > 0 && (
            <div className="factors">
              <h4>📊 Prediction Factors:</h4>
              <ul>
                {prediction.factors.map((factor, index) => (
                  <li key={index}>• {factor}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="location-info">
            <strong>📍 Location:</strong> {prediction.location || 'Auckland, New Zealand'}
          </div>
        </div>
      )}

      <div className="tool-info">
        <h4>🤖 Weather Model Info:</h4>
        <p>
          <strong>Model:</strong> Trained on Auckland weather data<br/>
          <strong>Training Data:</strong> auckland_weather.csv<br/>
          <strong>Features:</strong> Temperature, Humidity, Wind Speed, Pressure, Rainfall<br/>
          <strong>Predicts:</strong> Next day temperature and rainfall
        </p>
      </div>
    </div>
  );
};

export default WeatherPredictor;