import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DonationDetail.css';

function DonationDetail() {
  const { id } = useParams();
  const [donation, setDonation] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        const res = await axios.get(`https://food-waste-donation.onrender.com/api/donations/${id}`);
        setDonation(res.data);
        setError('');
      } catch (err) {
        console.error('Error fetching donation:', err);
        setError('Failed to load donation details.');
      }
    };
    fetchDonation();
  }, [id]);

  const handleAccept = async () => {
    try {
      await axios.patch(`https://food-waste-donation.onrender.com/api/donations/${id}/accept`);
      setMessage('Food accepted successfully!');
      navigate(`/donation/${id}/location`);
    } catch (err) {
      console.error('Error accepting donation:', err);
      setMessage('Failed to accept the food.');
    }
  };

  if (error) return <p className="error-message">{error}</p>;
  if (!donation) return <p>Loading...</p>;

  return (
    <div className="donation-detail-container">
      <h2>{donation.foodType}</h2>

      {donation.image && (
        <img
          src={`https://food-waste-donation.onrender.com${donation.image}`}
          alt={donation.foodType}
        />
      )}

      <p><strong>Location:</strong> {donation.location}</p>
      <p><strong>Address:</strong> {donation.detailedAddress}</p>

      <p>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(donation.detailedAddress)}`}
          target="_blank"
          rel="noreferrer"
        >
          View on Google Maps
        </a>
      </p>

      <p><strong>Quantity:</strong> {donation.quantity.amount} {donation.quantity.unit}</p>
      <p><strong>Expires At:</strong> {new Date(donation.expiryDate).toLocaleString()}</p>

      <button onClick={handleAccept}>Accept</button>

      {message && <p className="success-message">{message}</p>}
    </div>
  );
}

export default DonationDetail;
