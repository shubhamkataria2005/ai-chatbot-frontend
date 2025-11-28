import React from 'react';
import './Profile.css';

const Profile = ({ user, onLogout, onBackToDashboard }) => {
  const userData = {
    username: user?.username || 'Guest User',
    email: user?.email || 'Not provided'
  };

  return (
    <div className="profile-container">
      {/* Header Section */}
      <div className="profile-header">
        <div className="header-content">
          <h1>👤 User Profile</h1>
          <p>Your account information</p>
        </div>
      </div>

      <div className="profile-content">
        {/* Main Profile Card */}
        <div className="profile-card">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {userData.username.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="profile-details">
            <div className="detail-group">
              <label>Name</label>
              <div className="detail-value">{userData.username}</div>
            </div>

            <div className="detail-group">
              <label>Email</label>
              <div className="detail-value">{userData.email}</div>
            </div>
          </div>

          <div className="profile-actions">
            <button 
              className="back-button"
              onClick={onBackToDashboard}
            >
              ← Back to Dashboard
            </button>
            
            <button 
              className="logout-button"
              onClick={onLogout}
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;