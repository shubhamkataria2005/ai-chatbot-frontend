import React, { useState } from 'react';
import './Dashboard.css';
import Chat from './Chat';
import SentimentAnalyzer from './tools/SentimentAnalyzer';
import SalaryPredictor from './tools/SalaryPredictor';
import RobotCar from './tools/RobotCar';
import WeatherPredictor from './tools/WeatherPredictor';
import CarRecognizer from './tools/CarRecognizer';
import RetailDealsPredictor from './tools/RetailDealsPredictor';

const Dashboard = ({ user, sessionToken, onLogout }) => {
  const [activeTool, setActiveTool] = useState('chat');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    setMobileMenuOpen(false); // Close mobile menu when tool is selected
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
      {/* Mobile Menu Toggle */}
      <div className="mobile-menu-toggle">
        <button 
          className="menu-button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>
        <div className="mobile-header">
          <h2>🤖 SHUBHAM AI Studio</h2>
          <p>Welcome, {user.username}!</p>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
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

        {/* Mobile Close Button */}
        <button 
          className="mobile-close-btn"
          onClick={() => setMobileMenuOpen(false)}
        >
          ✕
        </button>
      </div>

      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="main-content">
        {renderActiveTool()}
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