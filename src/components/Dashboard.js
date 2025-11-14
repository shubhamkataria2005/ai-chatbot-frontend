import React, { useState } from 'react';
import './Dashboard.css';
import Chat from './Chat';
import SentimentAnalyzer from './tools/SentimentAnalyzer';
import SalaryPredictor from './tools/SalaryPredictor';

const Dashboard = ({ user, sessionToken, onLogout }) => {
  const [activeTool, setActiveTool] = useState('chat');

  const tools = [
    { id: 'chat', name: 'AI Chatbot', icon: '💬', description: 'Chat with AI assistant' },
    { id: 'sentiment', name: 'Sentiment Analyzer', icon: '📊', description: 'Analyze text emotions using AI' },
    { id: 'salary', name: 'Salary Predictor', icon: '💰', description: 'AI-powered salary estimates' },
    { id: 'coming1', name: 'Image AI', icon: '🖼️', description: 'Coming soon!' },
    { id: 'coming2', name: 'Code Helper', icon: '👨‍💻', description: 'Coming soon!' },
  ];

  const renderActiveTool = () => {
    switch (activeTool) {
      case 'chat':
        return <Chat user={user} sessionToken={sessionToken} />;
      case 'sentiment':
        return <SentimentAnalyzer sessionToken={sessionToken} />;
      case 'salary':
        return <SalaryPredictor sessionToken={sessionToken} />;
      default:
        return <ComingSoon toolName={tools.find(t => t.id === activeTool)?.name} />;
    }
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>🤖 SHUBHAM AI Studio</h2>
          <p>Welcome, {user.username}!</p>
        </div>
        
        <div className="tools-list">
          {tools.map(tool => (
            <div
              key={tool.id}
              className={`tool-item ${activeTool === tool.id ? 'active' : ''}`}
              onClick={() => setActiveTool(tool.id)}
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