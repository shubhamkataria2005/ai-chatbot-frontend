import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Chat from './components/Chat';
import { API_BASE_URL } from './config';

function App() {
  const [currentView, setCurrentView] = useState('public-chat');
  const [user, setUser] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('sessionToken');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
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
    
    localStorage.setItem('sessionToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = async () => {
    if (sessionToken) {
      try {
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
    
    setUser(null);
    setSessionToken(null);
    setCurrentView('public-chat');
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('user');
  };

  const switchToSignup = () => setCurrentView('signup');
  const switchToLogin = () => setCurrentView('login');
  const switchToPublicChat = () => setCurrentView('public-chat');
  const switchToDashboard = () => {
    if (user) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('login');
    }
  };

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
      {/* Background Video - Applies to entire app */}
      <div className="video-background">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          preload="auto"
          className="background-video"
        >
          <source src="/videos/background_video_main.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-overlay"></div>
      </div>

      {/* App Content Container */}
      <div className="app-content">
        {/* Public Chat - Default landing page for guests */}
        {currentView === 'public-chat' && (
          <div className="public-chat-container">
            <div className="public-header">
              <div className="header-content">
                <h1>🤖 SHUBHAM AI Studio</h1>
                <p>Chat with our AI assistant - No login required!</p>
                <p className="premium-tools">✨ Sign up for premium AI tools</p>
              </div>
              <div className="auth-buttons">
                {!user ? (
                  <>
                    <button className="auth-btn" onClick={switchToLogin}>
                      Login
                    </button>
                    <button className="auth-btn signup" onClick={switchToSignup}>
                      Sign Up
                    </button>
                  </>
                ) : (
                  <button className="auth-btn dashboard" onClick={switchToDashboard}>
                    🚀 Go to Dashboard
                  </button>
                )}
              </div>
            </div>
            <Chat user={user || { username: 'Guest' }} sessionToken={sessionToken} />
          </div>
        )}
        
        {/* Authentication Views */}
        {currentView === 'login' && (
          <Login 
            onLoginSuccess={handleLoginSuccess}
            onSwitchToSignup={switchToSignup}
            onSwitchToChat={switchToPublicChat}
          />
        )}
        
        {currentView === 'signup' && (
          <Signup 
            onSignupSuccess={handleLoginSuccess}
            onSwitchToLogin={switchToLogin}
            onSwitchToChat={switchToPublicChat}
          />
        )}
        
        {/* Dashboard - Only for authenticated users */}
        {currentView === 'dashboard' && user && (
          <Dashboard 
            user={user}
            sessionToken={sessionToken}
            onLogout={handleLogout}
            onSwitchToChat={switchToPublicChat}
          />
        )}
      </div>
    </div>
  );
}

export default App;