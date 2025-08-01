import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please login.");
        return;
      }

      try {
        const res = await axios.get("https://food-waste-donation.onrender.com/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setError("Error fetching user details");
      }
    };

    fetchUser();
  }, []);

  if (error) return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;
  if (!user) return <p style={{ textAlign: 'center' }}>Loading user data...</p>;

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      <div className="user-card">
        <h3>{user.username}</h3>
        <p><strong>Email:</strong> {user.email}</p>
      </div>
    </div>
  );
}

export default Dashboard;
