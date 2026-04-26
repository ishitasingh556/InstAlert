import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user, registerUser, updateProfileReq, token, logout } = useAuth();
  const isDemoUser = user?.email === 'jane.demo@example.com';
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phoneNumber || '',
    email: user?.email || '',
    password: '',
    location: user?.location || '',
    emergencyContactName: user?.emergencyContacts?.[0]?.name || '',
    emergencyContactPhone: user?.emergencyContacts?.[0]?.phoneNumber || '',
    bloodGroup: user?.bloodGroup || '',
    medicalConditions: user?.medicalConditions || '',
  });

  React.useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        phone: user.phoneNumber || '',
        email: user.email || '',
        location: user.location || '',
        emergencyContactName: user.emergencyContacts?.[0]?.name || '',
        emergencyContactPhone: user.emergencyContacts?.[0]?.phoneNumber || '',
        bloodGroup: user.bloodGroup || '',
        medicalConditions: user.medicalConditions || '',
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Map to the backend expected structure
    const payload = {
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phone,
      location: formData.location,
      bloodGroup: formData.bloodGroup,
      medicalConditions: formData.medicalConditions,
      emergencyContacts: [
        { name: formData.emergencyContactName, phoneNumber: formData.emergencyContactPhone }
      ]
    };

    if (formData.password) {
      payload.password = formData.password;
    } else {
      alert("Please enter your current password to confirm changes. (Demo password: password123)");
      return;
    }

    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmNewPassword) {
        alert("New passwords do not match!");
        return;
      }
      payload.newPassword = formData.newPassword;
    }
    
    let result;
    if (token) {
      result = await updateProfileReq(payload);
    } else {
      result = await registerUser(payload);
    }
    
    if (result.success) {
      alert('Profile saved successfully! Your name and details are now updated.');
      setFormData(prev => ({ ...prev, password: '', newPassword: '', confirmNewPassword: '' })); // clear password fields
    } else {
      alert(result.message || 'Operation failed. If you want to create a brand new account, please Logout first.');
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card glass-panel">
        <div className="profile-header">
          <h2>Registration & Profile</h2>
          {isDemoUser ? (
            <div className="demo-notice" style={{background: 'rgba(222, 78, 134, 0.1)', border: '1px solid var(--accent-pink)', padding: '15px', borderRadius: '8px', marginBottom: '20px'}}>
              <p style={{color: 'var(--accent-pink)', fontWeight: 'bold', marginBottom: '8px'}}>System is in Demo Mode</p>
              <p style={{fontSize: '0.9rem', color: 'var(--text-secondary)'}}>You are currently logged in as <strong>Jane Doe</strong>. To register your own unique account, please log out first.</p>
              <button onClick={logout} className="btn outline" style={{marginTop: '10px', color: 'var(--accent-pink)', borderColor: 'var(--accent-pink)'}}>Logout & Register New</button>
            </div>
          ) : (
            <p>Please enter your personal and emergency details to ensure your safety profile is up-to-date.</p>
          )}
        </div>
        <form className="profile-form" onSubmit={handleSubmit}>
          
          <div className="form-section">
            <h3 className="section-title">Personal Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Jane Doe" />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="jane@example.com" />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+1 234 567 8900" />
              </div>
              <div className="form-group">
                <label htmlFor="password">Current Password (Required) *</label>
                <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Confirm current password" />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="location">Primary Location *</label>
                <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} required placeholder="Home Address / City" />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Security Settings (Optional)</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input type="password" id="newPassword" name="newPassword" value={formData.newPassword || ''} onChange={handleChange} placeholder="Enter new password" />
              </div>
              <div className="form-group">
                <label htmlFor="confirmNewPassword">Confirm New Password</label>
                <input type="password" id="confirmNewPassword" name="confirmNewPassword" value={formData.confirmNewPassword || ''} onChange={handleChange} placeholder="Confirm new password" />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Emergency Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="emergencyContactName">Emergency Contact Name *</label>
                <input type="text" id="emergencyContactName" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} required placeholder="Contact Name" />
              </div>
              <div className="form-group">
                <label htmlFor="emergencyContactPhone">Emergency Contact Phone *</label>
                <input type="tel" id="emergencyContactPhone" name="emergencyContactPhone" value={formData.emergencyContactPhone} onChange={handleChange} required placeholder="Contact Phone Number" />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="bloodGroup">Blood Group</label>
                <select id="bloodGroup" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>
            
            <div className="form-group full-width">
              <label htmlFor="medicalConditions">Medical Conditions / Allergies</label>
              <textarea id="medicalConditions" name="medicalConditions" value={formData.medicalConditions} onChange={handleChange} placeholder="List any known medical conditions or allergies..." rows="3"></textarea>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary save-button">Save Profile</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
