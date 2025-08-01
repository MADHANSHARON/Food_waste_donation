// Navbar.jsx
import React, { useState } from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router-dom'; 

function Navbar({ isLoggedIn, onLogout }) {
  
const navigate=useNavigate();
  const [showOptions, setShowOptions] = useState(false);
   const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/'); // ✅ Redirect to home page after logout
  };
  return (
    <div className="navbar">
      <a href="/" className="logo">Food Donation</a>

      <div className="options-toggle">
        <button className="btn toggle-btn" onClick={() => setShowOptions(!showOptions)}>
          {showOptions ? "Hide" : "Show"} Options
        </button>
      </div>

      <div className={`navbar-right slide-panel ${showOptions ? 'show' : ''}`}>
        {isLoggedIn ? (
          <>
            <a href="/dashboard" className="btn">Dashboard</a>
            <a href="/donate" className="btn">Donate</a>
            <a href="/receive" className="btn">Receive</a>
            <button onClick={handleLogout} className="btn logout">Logout</button>
          </>
        ) : (
          <>
            <a href="/login" className="btn">Login</a>
            <a href="/register" className="btn">Register</a>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
