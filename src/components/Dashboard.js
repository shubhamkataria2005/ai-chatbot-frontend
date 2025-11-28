import React, { useState } from 'react';
import './Dashboard.css';
import Chat from './Chat';
import SentimentAnalyzer from './tools/SentimentAnalyzer';
import SalaryPredictor from './tools/SalaryPredictor';
import RobotCar from './tools/RobotCar';
import WeatherPredictor from './tools/WeatherPredictor';
import CarRecognizer from './tools/CarRecognizer';
import RetailDealsPredictor from './tools/RetailDealsPredictor';

const Dashboard = ({ user, sessionToken, onLogout, onSwitchToChat }) => {
  const [activeTool, setActiveTool] = useState('chat');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const tools = [
    { id: 'chat', name: 'AI Chatbot', icon: '💬', description: 'Chat with AI assistant' },
    { id: 'salary', name: 'Salary Predictor', icon: '💰', description: 'AI-powered salary estimates' },
    { id: 'retail', name: 'Retail Deals Predictor', icon: '🛍️', description: 'Predict retail deals and discounts' },
    { id: 'sentiment', name: 'Sentiment Analyzer', icon: '📊', description: 'Analyze text emotions using AI' },
    { id: 'weather', name: 'Weather Predictor', icon: '🌤️', description: 'Next-day weather forecasts' },
    { id: 'car', name: 'Car Recognizer', icon: '🚗', description: 'Identify BMW, Mercedes, or Audi from photos' },
    { id: 'robot', name: 'Robot Car', icon: '🤖', description: 'Control ESP32 robot with live video' },
  ];

  const handleToolClick = (toolId) => {
    setActiveTool(toolId);
    setShowMobileMenu(false);
  };

  const handleLogout = () => {
    setShowMobileMenu(false);
    onLogout();
  };

  const renderActiveTool = () => {
    switch (activeTool) {
      case 'chat':
        return <Chat user={user} sessionToken={sessionToken} />;
      case 'sentiment':
        return <SentimentAnalyzer sessionToken={sessionToken} />;
      case 'salary':
        return <SalaryPredictor sessionToken={sessionToken} />;
      case 'robot':
        return <RobotCar sessionToken={sessionToken} />;
      case 'retail':
        return <RetailDealsPredictor sessionToken={sessionToken} />;
      case 'weather':
        return <WeatherPredictor sessionToken={sessionToken} />;
      case 'car':
        return <CarRecognizer sessionToken={sessionToken} />;
      default:
        return <ComingSoon toolName={tools.find(t => t.id === activeTool)?.name} />;
    }
  };

  return (
    <div className="dashboard">
      {/* Mobile Header */}
      <div className="mobile-header">
        <div className="mobile-header-top">
          <div className="mobile-menu-toggle">
            <button 
              className="menu-button"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              ☰
            </button>
          </div>
          <div className="mobile-welcome">
            <span>Welcome, {user.username}!</span>
          </div>
        </div>
        
        {/* Mobile Tools Navigation */}
        <div className="mobile-tools-container">
          <div className="mobile-tools-scroll">
            {tools.map(tool => (
              <div
                key={tool.id}
                className={`mobile-tool-item ${activeTool === tool.id ? 'active' : ''}`}
                onClick={() => handleToolClick(tool.id)}
              >
                <span className="mobile-tool-icon">{tool.icon}</span>
                <span className="mobile-tool-name">{tool.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {showMobileMenu && (
          <div className="mobile-menu-overlay">
            <div className="mobile-menu-content">
              <div className="mobile-menu-header">
                <h3>🤖 SHUBHAM AI Studio</h3>
                <button 
                  className="close-menu"
                  onClick={() => setShowMobileMenu(false)}
                >
                  ✕
                </button>
              </div>
              <div className="mobile-menu-items">
                <button 
                  className="mobile-menu-item logout"
                  onClick={handleLogout}
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content - No fixed margins, let flexbox handle it */}
      <div className="main-content">
        {renderActiveTool()}
      </div>

      {/* Desktop Sidebar */}
      <div className="desktop-sidebar">
        <div className="sidebar-header">
          <h2>🤖 SHUBHAM AI Studio</h2>
          <p>Welcome, {user.username}!</p>
        </div>
        
        <div className="tools-list">
          {tools.map(tool => (
            <div
              key={tool.id}
              className={`tool-item ${activeTool === tool.id ? 'active' : ''}`}
              onClick={() => handleToolClick(tool.id)}
            >
              <span className="tool-icon">{tool.icon}</span>
              <div className="tool-info">
                <div className="tool-name">{tool.name}</div>
                <div className="tool-desc">{tool.description}</div>
              </div>
            </div>
          ))}
        </div>

        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

const ComingSoon = ({ toolName }) => (
  <div className="coming-soon">
    <h1>🚧 Under Construction</h1>
    <p>{toolName} is coming soon!</p>
    <p>We're working hard to bring you more AI tools! ✨</p>
  </div>
);

export default Dashboard;