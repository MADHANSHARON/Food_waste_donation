import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import boxImage from '../assets/box.jpg'; // import the image

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('https://food-waste-donation.onrender.com/api/auth/login', {
        username,
        password,
      });

      const token = res.data.token;
      if (!token || typeof token !== 'string') {
        alert("Login failed: Invalid token.");
        return;
      }

      const userRes = await axios.get('https://food-waste-donation.onrender.com/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // ✅ Notify App component about login
      if (onLogin) {
        onLogin(token, res.data.user);
      }

      alert("Login successful!");
      navigate('/dashboard');
    } catch (err) {
      console.error("Login error:", err);
      const msg = err?.response?.data?.msg || "Login failed. Try again.";
      alert(msg);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="auth-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p>Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
}

export default Login;
