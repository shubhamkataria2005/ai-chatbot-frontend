import React, { useState } from 'react';
import './Auth.css';
import { API_BASE_URL } from '../config';

const Signup = ({ onSignupSuccess, onSwitchToLogin, onSwitchToChat }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('📝 Attempting signup...', formData);
      
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      console.log('📡 Signup response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Signup API response:', data);

      if (data.success) {
        setSuccess('Account created successfully! Redirecting...');
        
        // Check if we have user data and session token
        if (data.user && data.sessionToken) {
          console.log('✅ Signup data valid, proceeding with auto-login...');
          setTimeout(() => {
            onSignupSuccess(data.user, data.sessionToken);
          }, 1500);
        } else if (data.userId) {
          // If backend only returns userId (not full user data), redirect to login
          console.log('⚠️ Backend returned userId but no user data, redirecting to login');
          setSuccess('Account created! Please login with your credentials.');
          setTimeout(() => {
            onSwitchToLogin();
          }, 2000);
        } else {
          // Generic success but no user data
          console.log('✅ Account created, redirecting to login');
          setSuccess('Account created successfully! Please login.');
          setTimeout(() => {
            onSwitchToLogin();
          }, 1500);
        }
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('❌ Signup error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account 🚀</h2>
        <p>Join our AI community for premium tools</p>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Choose a username"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a password"
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="auth-switch">
          Already have an account? 
          <span className="switch-link" onClick={onSwitchToLogin}>
            Sign in
          </span>
        </div>

        <div className="auth-actions">
          <button 
            type="button"
            className="back-button"
            onClick={onSwitchToChat}
            disabled={loading}
          >
            ← Back to Public Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;