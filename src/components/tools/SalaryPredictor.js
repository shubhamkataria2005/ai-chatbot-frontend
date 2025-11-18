import React, { useState } from 'react';
import './Tools.css';

const SalaryPredictor = ({ sessionToken }) => {
  const [formData, setFormData] = useState({
    experience: '',
    role: 'Software Developer',
    location: 'New Zealand',
    education: 'Bachelor',
    skills: []
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

  const educationLevels = ['Bachelor', 'Master', 'PhD'];
  
  const skillsList = [
    'JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker',
    'Machine Learning', 'AI', 'Cloud', 'DevOps', 'TypeScript', 'SQL',
    'TensorFlow', 'Kubernetes', 'CI/CD', 'Microservices'
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
          location: formData.location,
          education: formData.education,
          skills: formData.skills
        })
      });

      const data = await response.json();
      
      if (data.error) {
        setError(data.message || 'Prediction failed');
      } else if (data.success) {
        setPrediction(data);
      } else {
        setError('Prediction failed. Please try again.');
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

  const handleSkillToggle = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const formatSalary = (salary, currency) => {
    const formatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });

    const symbols = {
      'USD': '$',
      'NZD': 'NZ$',
      'INR': '₹',
      'GBP': '£',
      'EUR': '€',
      'CAD': 'C$',
      'AUD': 'A$'
    };

    return `${symbols[currency] || currency}${formatter.format(salary)}`;
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1>🤖 ML Salary Predictor</h1>
        <p>AI-powered salary predictions trained on real tech salary data</p>
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

        <div className="form-group">
          <label>Education Level</label>
          <select 
            value={formData.education} 
            onChange={(e) => handleInputChange('education', e.target.value)}
            disabled={loading}
          >
            {educationLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Skills (Select relevant ones)</label>
          <div className="skills-grid">
            {skillsList.map(skill => (
              <div
                key={skill}
                className={`skill-chip ${formData.skills.includes(skill) ? 'selected' : ''}`}
                onClick={() => handleSkillToggle(skill)}
              >
                {skill}
              </div>
            ))}
          </div>
          <div className="selected-skills">
            {formData.skills.length > 0 && (
              <>
                <strong>Selected: </strong>
                {formData.skills.join(', ')}
              </>
            )}
          </div>
        </div>

        <button 
          onClick={predictSalary} 
          disabled={loading || !formData.experience}
          className="predict-btn"
        >
          {loading ? '🤖 Predicting...' : '💰 Predict Salary'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      {prediction && (
        <div className="prediction-result">
          <h3>🎯 ML-Predicted Salary</h3>
          <div className="salary-display">
            <span className="salary-amount">
              {formatSalary(prediction.predictedSalary, prediction.currency)}
            </span>
            <span className="salary-period">/year</span>
          </div>
          
          {prediction.salaryUSD && (
            <div className="usd-equivalent">
              (Approx. {formatSalary(prediction.salaryUSD, 'USD')} USD)
            </div>
          )}
          
          {prediction.confidence && (
            <div className="confidence-badge">
              🤖 ML Confidence: {prediction.confidence}%
            </div>
          )}

          {prediction.factors && prediction.factors.length > 0 && (
            <div className="factors">
              <h4>📊 ML Analysis Factors:</h4>
              <ul>
                {prediction.factors.map((factor, index) => (
                  <li key={index}>• {factor}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="disclaimer">
            <small>
              💡 This prediction is generated by our ML model trained on real tech salary data. 
              The model considers experience, location, education, skills, and current market trends.
            </small>
          </div>
        </div>
      )}

      <div className="tool-info">
        <h4>🤖 ML Model Info:</h4>
        <p>
          <strong>Model:</strong> Random Forest Regressor<br/>
          <strong>Training Data:</strong> tech_salaries.csv<br/>
          <strong>Features:</strong> Experience, Role, Location, Education, Skills<br/>
          <strong>Accuracy:</strong> ~85% on test data
        </p>
      </div>
    </div>
  );
};

export default SalaryPredictor;