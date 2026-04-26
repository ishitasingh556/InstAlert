import React, { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved && saved !== "undefined" ? JSON.parse(saved) : { name: 'Jane Doe' };
  });

  useEffect(() => {
    // Automatically register or login a test user for our frontend UI connection!
    // Commented out to allow the Login page to be visible first as requested.
    /*
    const setupDemoUser = async () => {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      try {
        if (!token && !localStorage.getItem('token')) {
          console.log("Setting up integration test user...");
          
          let res = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: 'Jane Doe',
              email: 'jane.demo@example.com',
              password: 'password123',
              phoneNumber: '+19998887777',
              emergencyContacts: [
                { name: 'Sarah Connor', phoneNumber: '+12223334444', email: 'sarah@example.com' }
              ]
            })
          });
          
          // If already exists, just login
          if (res.status === 400) {
            res = await fetch(`${API_URL}/api/auth/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: 'jane.demo@example.com', password: 'password123' })
            });
          }

          if (res.ok) {
            const data = await res.json();
            setToken(data.token);
            setUser(data);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            console.log("Connected to backend! Token acquired.");
          }
        }
      } catch (err) {
        console.error("Backend Connection Error: Is your node server running?", err);
      }
    };
    setupDemoUser();
    */
  }, [token]);

  const triggerSOS = async () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    if (!token) {
      alert('System is still connecting to the backend... please wait.');
      return;
    }
    
    // Request actual location from the browser!
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const res = await fetch(`${API_URL}/api/alerts/trigger`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            })
          });
          
          const data = await res.json();
          if (res.ok) {
            const twilioSuccess = !data.message.includes('could not be sent');
            if (twilioSuccess) {
              alert(`🚨 SOS BROADCAST ACTIVE 🚨\n\n${data.message}\n\nYour emergency contacts have been notified via Twilio SMS.`);
            } else {
              alert(`🚨 SOS LOCAL ALERT 🚨\n\n${data.message}\n\nWarning: Twilio SMS failed. Please check backend .env configuration.`);
            }
          } else {
            alert(`Failed to trigger SOS: ${data.message}`);
          }
        } catch (err) {
          console.error(err);
          alert('Network Error. Failed to reach the backend.');
        }
      }, (error) => {
        alert('Please allow Location Access so the system can send your GPS coordinates!');
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };
  const triggerSOSToContact = async (contact) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    if (!token) {
      alert('System is still connecting to the backend... please wait.');
      return;
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const res = await fetch(`${API_URL}/api/alerts/trigger-individual`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              contactPhone: contact.phoneNumber,
              contactName: contact.name
            })
          });
          const data = await res.json();
          if (res.ok) {
            const twilioSuccess = !data.message.includes('could not be sent');
            if (twilioSuccess) {
              alert(`🚨 INDIVIDUAL SOS SENT 🚨\n\n${data.message}`);
            } else {
              alert(`🚨 SOS ALERT FAILED 🚨\n\n${data.message}\n\nCheck Twilio settings.`);
            }
          } else {
            alert(`Failed: ${data.message}`);
          }
        } catch (err) {
          console.error(err);
          alert('Network Error. Failed to reach the backend.');
        }
      }, () => {
        alert('Please allow Location Access so the system can send your GPS coordinates!');
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const addContact = async (name, phoneNumber, email) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    if (!token) return alert('Not authenticated!');
    try {
      const res = await fetch(`${API_URL}/api/auth/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, phoneNumber, email })
      });
      const data = await res.json();
      if (res.ok) {
        alert('Guardian added successfully!');
        const updatedUser = { ...user, emergencyContacts: data };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return data; // Returns updated contacts array from backend
      } else {
        alert(`Failed: ${data.message}`);
      }
    } catch (err) {
      alert('Error adding contact.');
    }
  };
  const deleteContact = async (contactId) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    if (!token) return alert('Not authenticated!');
    if (!window.confirm('Are you sure you want to remove this guardian?')) return;
    
    try {
      const res = await fetch(`${API_URL}/api/auth/contacts/${contactId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        alert('Guardian removed successfully!');
        const updatedUser = { ...user, emergencyContacts: data };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return data;
      } else {
        alert(`Failed: ${data.message}`);
      }
    } catch (err) {
      alert('Error removing contact.');
    }
  };
  const registerUser = async (userData) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        setUser(data);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      return { success: false, message: 'Server connection error.' };
    }
  };

  const updateProfileReq = async (userData) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    if (!token) return { success: false, message: 'Not authenticated!' };
    try {
      const res = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      return { success: false, message: 'Server connection error.' };
    }
  };

  const loginWithGoogle = async () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    // In a real app, you'd use a Google Login library to get the token/user info.
    // For this demo, we'll simulate a successful Google Auth callback.
    const mockGoogleData = {
      email: 'google.user@example.com',
      name: 'Google User',
      googleId: '123456789',
      imageUrl: 'https://via.placeholder.com/150'
    };

    try {
      const res = await fetch(`${API_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockGoogleData)
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        setUser(data);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      return { success: false, message: 'Google Auth Connection Error.' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, triggerSOS, triggerSOSToContact, logout, addContact, deleteContact, registerUser, updateProfileReq, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};
