import React, { useState } from 'react';
import { FiBell, FiUser, FiSettings, FiLogOut, FiSun, FiMoon } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = ({ title }) => {
  const { user, triggerSOS, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const navigate = useNavigate();

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    if (isDarkTheme) {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <h1>{title}</h1>
      </div>
      <div className="header-right">
        <button className="sos-btn" onClick={triggerSOS}>
          <span>SOS EMERGENCY</span>
        </button>
        <div className="header-actions">
          
          {/* Theme Toggle */}
          <button className="icon-btn" onClick={toggleTheme} title="Toggle Theme">
            {isDarkTheme ? <FiSun /> : <FiMoon />}
          </button>
          
          {/* Notifications Dropdown */}
          <div className="dropdown-container">
            <button className="icon-btn" onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}>
              <FiBell />
              <span className="notification-dot"></span>
            </button>
            {showNotifications && (
              <div className="dropdown-menu notifications-menu">
                <div className="dropdown-header">Recent Alerts</div>
                <div className="dropdown-item">✓ System Secure - No issues detected.</div>
                <div className="dropdown-item">ℹ Location sharing inactive until SOS.</div>
              </div>
            )}
          </div>

          {/* Profile Click */}
          <div className="user-profile" onClick={() => navigate('/profile')}>
            <div className="avatar">
              <FiUser />
            </div>
            <div className="user-info">
              <span className="user-name">{user?.name || 'Jane Doe'}</span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
