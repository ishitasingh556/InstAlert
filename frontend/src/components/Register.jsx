import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiPhone, FiMapPin, FiArrowRight, FiShield } from 'react-icons/fi';
import { FaGoogle, FaApple } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.png';
import './Login.css'; // Reusing Login styles for consistency

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    location: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { registerUser, loginWithGoogle } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const result = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        location: formData.location
      });

      if (result.success) {
        navigate('/');
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card" style={{maxWidth: '500px'}}>
        <div className="login-header">
          <img src={logoImg} alt="InstAlert" className="login-logo" />
          <h1>Create Account</h1>
          <p>Join InstAlert for 24/7 safety monitoring</p>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Full Name</label>
            <div className="input-wrapper">
              <input 
                type="text" name="name" placeholder="Jane Doe" 
                value={formData.name} onChange={handleChange} required 
              />
              <FiUser className="input-icon" />
            </div>
          </div>

          <div className="form-row" style={{display: 'flex', gap: '15px'}}>
            <div className="form-group" style={{flex: 1}}>
              <label>Email Address</label>
              <div className="input-wrapper">
                <input 
                  type="email" name="email" placeholder="jane@example.com" 
                  value={formData.email} onChange={handleChange} required 
                />
                <FiMail className="input-icon" />
              </div>
            </div>
            <div className="form-group" style={{flex: 1}}>
              <label>Phone Number</label>
              <div className="input-wrapper">
                <input 
                  type="tel" name="phoneNumber" placeholder="+91..." 
                  value={formData.phoneNumber} onChange={handleChange} required 
                />
                <FiPhone className="input-icon" />
              </div>
            </div>
          </div>

          <div className="form-row" style={{display: 'flex', gap: '15px'}}>
            <div className="form-group" style={{flex: 1}}>
              <label>Password</label>
              <div className="input-wrapper">
                <input 
                  type="password" name="password" placeholder="••••••••" 
                  value={formData.password} onChange={handleChange} required 
                />
                <FiLock className="input-icon" />
              </div>
            </div>
            <div className="form-group" style={{flex: 1}}>
              <label>Confirm Password</label>
              <div className="input-wrapper">
                <input 
                  type="password" name="confirmPassword" placeholder="••••••••" 
                  value={formData.confirmPassword} onChange={handleChange} required 
                />
                <FiShield className="input-icon" />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Primary Location</label>
            <div className="input-wrapper">
              <input 
                type="text" name="location" placeholder="City, State" 
                value={formData.location} onChange={handleChange} required 
              />
              <FiMapPin className="input-icon" />
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={isLoading} style={{marginTop: '10px'}}>
            {isLoading ? <div className="loader"></div> : (
              <>Create Account <FiArrowRight /></>
            )}
          </button>
        </form>

        <div className="divider">
          <span>OR SIGN UP WITH</span>
        </div>

        <div className="social-logins">
          <button className="social-btn" onClick={async () => {
            const res = await loginWithGoogle();
            if (res.success) navigate('/');
            else alert(res.message);
          }}>
            <FaGoogle /> Google
          </button>
          <button className="social-btn">
            <FaApple /> Apple
          </button>
        </div>

        <div className="signup-prompt">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
