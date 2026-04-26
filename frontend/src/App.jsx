import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TrustedCircles from './components/TrustedCircles';
import SafetyProtocols from './components/SafetyProtocols';
import Profile from './components/Profile';
import Login from './components/Login';
import Register from './components/Register';
import { AuthProvider, useAuth } from './context/AuthContext';

const AppContent = () => {
  const { token } = useAuth();
  
  if (!token && window.location.pathname !== '/login' && window.location.pathname !== '/register') {
    return <Login />;
  }

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <>
              <Header title="Security Dashboard" />
              <div className="page-content">
                <Dashboard />
              </div>
            </>
          } />
          <Route path="/circles" element={
            <>
              <Header title="Trusted Circles" />
              <div className="page-content">
                <TrustedCircles />
              </div>
            </>
          } />
          <Route path="/safety" element={
            <>
              <Header title="Protocol Configuration" />
              <div className="page-content">
                <SafetyProtocols />
              </div>
            </>
          } />
          <Route path="/settings" element={
            <>
              <Header title="Settings" />
              <div className="page-content">
                <h2>User Preferences</h2>
              </div>
            </>
          } />
          <Route path="/profile" element={
            <>
              <Header title="Your Profile" />
              <div className="page-content">
                <Profile />
              </div>
            </>
          } />
        </Routes>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
