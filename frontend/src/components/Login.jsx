import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiSmartphone, FiArrowRight } from 'react-icons/fi';
import { FaGoogle, FaApple } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.png';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const navigate = useNavigate();
  const { loginUser, loginWithGoogle } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Mocking login for now since we have a demo system
      // In a real app, this would call authContext.login(email, password)
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        // Force refresh or update context
        window.location.href = '/'; 
      } else {
        setError(data.message || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Network connection failed. Please check your internet.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <img src={logoImg} alt="InstAlert" className="login-logo" />
          <h1>InstAlert</h1>
          <p>Your Safety, Always Connected</p>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email or Phone Number</label>
            <div className="input-wrapper">
              <input 
                type="text" 
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <FiMail className="input-icon" />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div onClick={() => setShowPassword(!showPassword)} className="input-icon">
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </div>
            </div>
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember Me
            </label>
            <Link to="/forgot-password" disable className="forgot-password">Forgot Password?</Link>
          </div>

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? <div className="loader"></div> : (
              <>Login <FiArrowRight /></>
            )}
          </button>
        </form>

        <div className="divider">
          <span>OR CONTINUE WITH</span>
        </div>

        <div className="social-logins">
          <button className="social-btn" onClick={async () => {
            const res = await loginWithGoogle();
            if (res.success) window.location.href = '/';
            else alert(res.message);
          }}>
            <FaGoogle /> Google
          </button>
          <button className="social-btn">
            <FaApple /> Apple
          </button>
        </div>

        <button className="otp-btn">
          <FiSmartphone /> Login with OTP
        </button>

        <div className="signup-prompt">
          New to InstAlert? <Link to="/profile">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
