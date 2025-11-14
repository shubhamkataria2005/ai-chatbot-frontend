import React, { useState } from 'react';
import './Tools.css';

const SalaryPredictor = ({ sessionToken }) => {
  const [formData, setFormData] = useState({
    experience: '',
    role: 'ML Engineer',
    location: 'New Zealand'
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roles = [
    'Software Developer',
    'Data Scientist', 
    'ML Engineer',
    'DevOps Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer'
  ];

  const locations = [
    'New Zealand',
    'United States',
    'India', 
    'United Kingdom',
    'Germany',
    'Canada',
    'Australia'
  ];

  const predictSalary = async () => {
    if (!formData.experience || formData.experience < 0) {
      setError('Please enter valid years of experience');
      return;
    }

    setLoading(true);
    setError('');
    setPrediction(null);

    try {
      const response = await fetch('http://localhost:8080/api/ai-tools/salary-prediction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionToken
        },
        body: JSON.stringify({
          experience: parseInt(formData.experience),
          role: formData.role,
          location: formData.location
        })
      });

      const data = await response.json();
      
      if (data.error) {
        setError(data.message || 'Prediction failed');
      } else {
        setPrediction(data);
      }
    } catch (error) {
      setError('Network error. Please check if backend is running.');
      console.error('Salary prediction error:', error);
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

  const formatSalary = (salary, currency) => {
    return `${currency}${salary.toLocaleString()}`;
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1>💰 Salary Predictor</h1>
        <p>Get AI-powered salary estimates based on experience, role, and location</p>
      </div>

      <div className="form-section">
        <div className="form-group">
          <label>Years of Experience</label>
          <input
            type="number"
            value={formData.experience}
            onChange={(e) => handleInputChange('experience', e.target.value)}
            placeholder="e.g., 3"
            min="0"
            max="30"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Job Role</label>
          <select 
            value={formData.role} 
            onChange={(e) => handleInputChange('role', e.target.value)}
            disabled={loading}
          >
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Location</label>
          <select 
            value={formData.location} 
            onChange={(e) => handleInputChange('location', e.target.value)}
            disabled={loading}
          >
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>

        <button 
          onClick={predictSalary} 
          disabled={loading || !formData.experience}
          className="predict-btn"
        >
          {loading ? 'Predicting...' : 'Predict Salary'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      {prediction && (
        <div className="prediction-result">
          <h3>💰 Predicted Salary:</h3>
          <div className="salary-display">
            <span className="salary-amount">
              {formatSalary(prediction.predictedSalary, prediction.currency)}
            </span>
            <span className="salary-period">/year</span>
          </div>
          
          {prediction.confidence && (
            <div className="confidence-badge">
              Confidence: {prediction.confidence}%
            </div>
          )}

          {prediction.factors && prediction.factors.length > 0 && (
            <div className="factors">
              <h4>Based on:</h4>
              <ul>
                {prediction.factors.map((factor, index) => (
                  <li key={index}>• {factor}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="disclaimer">
            <small>
              💡 This is an AI-powered estimate. Actual salaries may vary based on company, 
              specific skills, and market conditions.
            </small>
          </div>
        </div>
      )}

      <div className="tool-info">
        <h4>ℹ️ How it works:</h4>
        <p>
          Our AI analyzes current market data, industry trends, and location-based salary information 
          to provide accurate salary predictions for tech roles.
        </p>
      </div>
    </div>
  );
};

export default SalaryPredictor;