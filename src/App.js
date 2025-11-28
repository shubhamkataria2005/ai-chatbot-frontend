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
  const [error, setError] = useState('');

  // Check if user is already logged in - FIXED JSON PARSE
  useEffect(() => {
    const token = localStorage.getItem('sessionToken');
    const savedUser = localStorage.getItem('user');
    
    console.log('🔍 App mounted - Checking auth:', { token, savedUser });
    
    // FIX: Safe JSON parsing
    let parsedUser = null;
    if (savedUser) {
      try {
        parsedUser = JSON.parse(savedUser);
      } catch (error) {
        console.error('❌ Error parsing user from localStorage:', error);
        // Clear corrupted data
        localStorage.removeItem('user');
        localStorage.removeItem('sessionToken');
      }
    }
    
    if (token && parsedUser) {
      validateSession(token, parsedUser);
    } else {
      console.log('🚫 No valid session found');
      setLoading(false);
      setCurrentView('public-chat');
    }
  }, []);

  const validateSession = async (token, savedUser) => {
    try {
      console.log('🔐 Validating session...');
      const response = await fetch(`${API_BASE_URL}/api/auth/validate`, {
        method: 'GET',
        headers: {
          'Authorization': token
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Session validation response:', data);
      
      if (data.valid) {
        console.log('✅ Session valid, going to dashboard');
        setSessionToken(token);
        setUser(savedUser);
        setCurrentView('dashboard');
      } else {
        console.log('❌ Session invalid, clearing storage');
        localStorage.removeItem('sessionToken');
        localStorage.removeItem('user');
        setCurrentView('public-chat');
      }
    } catch (error) {
      console.error('❌ Session validation failed:', error);
      // On error, fall back to public chat
      localStorage.removeItem('sessionToken');
      localStorage.removeItem('user');
      setCurrentView('public-chat');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (userData, token) => {
    console.log('✅ Login/Signup successful:', { userData, token });
    
    // Validate that we have the required data
    if (!userData || !token) {
      console.error('❌ Missing userData or token in handleLoginSuccess');
      setError('Authentication failed. Please try logging in again.');
      setCurrentView('login');
      return;
    }

    setUser(userData);
    setSessionToken(token);
    setCurrentView('dashboard');
    
    // Store in localStorage - FIXED: Safe stringify
    try {
      localStorage.setItem('sessionToken', token);
      localStorage.setItem('user', JSON.stringify(userData));
      console.log('✅ User stored in localStorage');
    } catch (error) {
      console.error('❌ Error storing in localStorage:', error);
    }
    
    console.log('✅ User stored, redirecting to dashboard');
  };

  const handleLogout = async () => {
    console.log('🚪 Logging out...');
    
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
    
    // FIXED: Safe localStorage removal
    try {
      localStorage.removeItem('sessionToken');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('❌ Error clearing localStorage:', error);
    }
  };

  const switchToSignup = () => {
    console.log('🔄 Switching to signup');
    setCurrentView('signup');
  };

  const switchToLogin = () => {
    console.log('🔄 Switching to login');
    setCurrentView('login');
  };

  const switchToPublicChat = () => {
    console.log('🔄 Switching to public chat');
    setCurrentView('public-chat');
  };

  const switchToDashboard = () => {
    console.log('🔄 Switching to dashboard');
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

  console.log('🎯 Current view:', currentView);

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

        {/* Error Fallback - If something goes wrong */}
        {!currentView && (
          <div className="error-fallback">
            <div className="error-content">
              <h2>😕 Something went wrong</h2>
              <p>Please refresh the page or try going back to the main chat.</p>
              <button onClick={switchToPublicChat} className="auth-button">
                Back to Main Chat
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;