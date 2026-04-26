import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiUsers, FiShield, FiSettings, FiLogOut, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.png';
import './Sidebar.css';

const Sidebar = () => {
  const { logout } = useAuth();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={logoImg} alt="InstAlert Logo" className="logo-image" />
        <h2><span style={{color: '#de4e86'}}>Inst</span><span style={{color: '#f9dce9'}}>Alert</span></h2>
      </div>
      
      <nav className="sidebar-nav">
        <p className="nav-label">MENU</p>
        
        <NavLink to="/" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <FiHome className="nav-icon" />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink to="/circles" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <FiUsers className="nav-icon" />
          <span>Trusted Circles</span>
        </NavLink>
        
        <NavLink to="/safety" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <FiShield className="nav-icon" />
          <span>Safety Protocols</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <nav className="sidebar-nav">
          <p className="nav-label">ACCOUNT</p>
          <NavLink to="/profile" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <FiUser className="nav-icon" />
            <span>Registration Profile</span>
          </NavLink>
          <NavLink to="/settings" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <FiSettings className="nav-icon" />
            <span>Settings</span>
          </NavLink>
          <button className="nav-item logout-btn" onClick={logout}>
            <FiLogOut className="nav-icon" />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
