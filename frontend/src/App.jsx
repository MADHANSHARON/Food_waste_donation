// App.jsx
import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DonateForm from './pages/DonationForm';
import Receive from './pages/Receive';
import DonationDetail from './pages/DonationDetail';
import DonationLocation from './pages/DonationLocation';
import Navbar from './components/Navbar';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // Check login status on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
      // You can also fetch user details here if needed
    }
  }, []);

  const handleLogin = (token, userInfo) => {
    localStorage.setItem('token', token);
    setToken(token);
    setUser(userInfo);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard user={user} token={token} />} />
        <Route path="/donate" element={<DonateForm />} />
        <Route path="/receive" element={<Receive />} />
        <Route path="/donation/:id" element={<DonationDetail />} />
        <Route path="/donation/:id/location" element={<DonationLocation />} />
      </Routes>
    </>
  );
}

export default App;
