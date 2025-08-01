import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Receive.css'; // ⬅️ Import the CSS file

function Receive() {
  const [donations, setDonations] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAvailableDonations = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/donations/available');
        setDonations(res.data);
        setError('');
      } catch (err) {
        console.error('Error fetching donations:', err);
        setError('Failed to load available donations. Please try again later.');
      }
    };

    fetchAvailableDonations();
  }, []);

  return (
    <div className="receive-container">
      <h2>Available Food Donations</h2>

      {error && <p className="error">{error}</p>}
      {donations.length === 0 && !error && <p>No available donations found.</p>}

      <div className="donation-grid">
        {donations.map((item) => (
          <Link to={`/donation/${item._id}`} key={item._id} className="donation-card-link">
            <div className="donation-card">
              <h3>{item.foodType}</h3>

              {item.image && (
                <img
                  src={`http://localhost:3000${item.image}`}
                  alt={item.foodType}
                />
              )}

              <p><strong>Quantity:</strong> {item.quantity.amount} {item.quantity.unit}</p>
              <p><strong>Expiry:</strong> {new Date(item.expiryDate).toLocaleString()}</p>
              <p><strong>Location:</strong> {item.location}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Receive;
