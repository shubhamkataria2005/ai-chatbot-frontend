import React, { useState, useEffect } from 'react';
import './Tools.css';

const RobotCar = ({ sessionToken }) => {
  const [robotIP, setRobotIP] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [videoUrl, setVideoUrl] = useState('');

  // Default IP - change this to your ESP32's IP
  const defaultIP = '192.168.1.100';

  const connectToRobot = () => {
    if (!robotIP.trim()) {
      alert('Please enter robot IP address');
      return;
    }

    const ip = robotIP.trim();
    setIsConnected(true);
    setConnectionStatus('Connected');
    setVideoUrl(`http://${ip}:81/stream`);
    
    // Save to localStorage for future use
    localStorage.setItem('robotIP', ip);
  };

  const disconnectFromRobot = () => {
    setIsConnected(false);
    setConnectionStatus('Disconnected');
    setVideoUrl('');
  };

  const sendCommand = async (command) => {
    if (!isConnected) return;

    try {
      const response = await fetch(`http://${robotIP}/${command}`);
      if (response.ok) {
        console.log(`Command ${command} sent successfully`);
      }
    } catch (error) {
      console.error('Failed to send command:', error);
      setConnectionStatus('Connection Error');
    }
  };

  // Load saved IP on component mount
  useEffect(() => {
    const savedIP = localStorage.getItem('robotIP') || defaultIP;
    setRobotIP(savedIP);
  }, []);

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1>🚗 Robot Car Control</h1>
        <p>Remote control your ESP32 robot car with live video streaming</p>
      </div>

      {/* Connection Section */}
      <div className="form-section">
        <div className="form-group">
          <label>Robot IP Address</label>
          <input
            type="text"
            value={robotIP}
            onChange={(e) => setRobotIP(e.target.value)}
            placeholder="e.g., 192.168.1.100"
            disabled={isConnected}
          />
        </div>

        {!isConnected ? (
          <button onClick={connectToRobot} className="analyze-btn">
            🔗 Connect to Robot
          </button>
        ) : (
          <button onClick={disconnectFromRobot} className="analyze-btn" style={{background: '#ef4444'}}>
            🔌 Disconnect
          </button>
        )}

        <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
          Status: {connectionStatus}
        </div>
      </div>

      {/* Live Video Stream */}
      {isConnected && (
        <div className="video-section">
          <h3>📹 Live Camera Feed</h3>
          <div className="video-container">
            <img 
              src={videoUrl} 
              alt="Live Robot Camera" 
              className="live-video"
              onError={() => setConnectionStatus('Video Stream Error')}
            />
          </div>
        </div>
      )}

      {/* Control Buttons */}
      {isConnected && (
        <div className="control-section">
          <h3>🎮 Robot Controls</h3>
          
          <div className="robot-control-grid">
            {/* Forward */}
            <button 
              className="control-btn forward"
              onMouseDown={() => sendCommand('go')}
              onMouseUp={() => sendCommand('stop')}
              onTouchStart={() => sendCommand('go')}
              onTouchEnd={() => sendCommand('stop')}
            >
              🔼 Forward
            </button>

            {/* Left */}
            <button 
              className="control-btn left"
              onMouseDown={() => sendCommand('left')}
              onMouseUp={() => sendCommand('stop')}
              onTouchStart={() => sendCommand('left')}
              onTouchEnd={() => sendCommand('stop')}
            >
              ↩️ Left
            </button>

            {/* Stop */}
            <button 
              className="control-btn stop"
              onClick={() => sendCommand('stop')}
            >
              🛑 Stop
            </button>

            {/* Right */}
            <button 
              className="control-btn right"
              onMouseDown={() => sendCommand('right')}
              onMouseUp={() => sendCommand('stop')}
              onTouchStart={() => sendCommand('right')}
              onTouchEnd={() => sendCommand('stop')}
            >
              ↪️ Right
            </button>

            {/* Backward */}
            <button 
              className="control-btn backward"
              onMouseDown={() => sendCommand('back')}
              onMouseUp={() => sendCommand('stop')}
              onTouchStart={() => sendCommand('back')}
              onTouchEnd={() => sendCommand('stop')}
            >
              🔽 Backward
            </button>
          </div>

          {/* Light Controls */}
          <div className="light-controls">
            <button 
              className="light-btn"
              onClick={() => sendCommand('ledon')}
            >
              💡 Light ON
            </button>
            <button 
              className="light-btn"
              onClick={() => sendCommand('ledoff')}
            >
              🌙 Light OFF
            </button>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="tool-info">
        <h4>📋 Setup Instructions:</h4>
        <ol>
          <li>Make sure your ESP32 robot car is powered on and connected to WiFi</li>
          <li>Find your robot's IP address (check Serial Monitor)</li>
          <li>Enter the IP address above and click "Connect"</li>
          <li>Use the control buttons while watching the live video</li>
        </ol>
        <p><strong>💡 Tip:</strong> For remote access, setup port forwarding on your router.</p>
      </div>
    </div>
  );
};

export default RobotCar;