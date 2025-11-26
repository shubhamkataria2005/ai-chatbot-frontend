import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import { API_BASE_URL } from './config';

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [user, setUser] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('sessionToken');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      // Validate session with backend
      validateSession(token, JSON.parse(savedUser));
    } else {
      setLoading(false);
    }
  }, []);

  const validateSession = async (token, savedUser) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/validate`, {
        method: 'GET',
        headers: {
          'Authorization': token
        }
      });
      
      const data = await response.json();
      
      if (data.valid) {
        setSessionToken(token);
        setUser(savedUser);
        setCurrentView('dashboard');
      } else {
        // Session invalid, clear storage
        localStorage.removeItem('sessionToken');
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Session validation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (userData, token) => {
    setUser(userData);
    setSessionToken(token);
    setCurrentView('dashboard');
    
    // Save to localStorage
    localStorage.setItem('sessionToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = async () => {
    if (sessionToken) {
      try {
        // Call logout API
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': sessionToken
          }
        });
      } catch (error) {
        console.error('Logout API error:', error);
      }
    }
    
    // Clear state and storage
    setUser(null);
    setSessionToken(null);
    setCurrentView('login');
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('user');
  };

  const switchToSignup = () => setCurrentView('signup');
  const switchToLogin = () => setCurrentView('login');

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h2>🤖 AI Studio</h2>
          <p>Loading your AI experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {currentView === 'login' && (
        <Login 
          onLoginSuccess={handleLoginSuccess}
          onSwitchToSignup={switchToSignup}
        />
      )}
      
      {currentView === 'signup' && (
        <Signup 
          onSignupSuccess={switchToLogin}
          onSwitchToLogin={switchToLogin}
        />
      )}
      
      {currentView === 'dashboard' && user && (
        <Dashboard 
          user={user}
          sessionToken={sessionToken}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;