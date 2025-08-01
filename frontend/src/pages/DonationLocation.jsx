import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './DonationLocation.css';

function DonationLocation() {
  const { id } = useParams();
  const [donation, setDonation] = useState(null);

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        const res = await axios.get(`https://food-waste-donation.onrender.com/api/donations/${id}`);
        setDonation(res.data);
      } catch (err) {
        console.error('Error fetching donation:', err);
      }
    };
    fetchDonation();
  }, [id]);

  if (!donation) return <p>Loading...</p>;

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    donation.detailedAddress
  )}&output=embed`;

  return (
    <div className="location-container">
      <h2>Donation Location</h2>
      <p><strong>Food:</strong> {donation.foodType}</p>
      <p><strong>Address:</strong> {donation.detailedAddress}</p>

      <div className="map-box">
        <iframe
          src={mapSrc}
          allowFullScreen=""
          loading="lazy"
          title="Google Map"
        ></iframe>
      </div>
      <div className="s-msg">
         <p className="accepted-msg">Thank you! You have accepted this donation. Please contact the number below to reach the donor.</p>
     </div>

      <p><strong>Phone:</strong> +91 {donation.phone}</p>
      <p>
        <strong>WhatsApp:</strong>{' '}
        <a
          href={`https://wa.me/91${donation.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          className="whatsapp-link"
        >
          Chat on WhatsApp
        </a>
      </p>
    </div>
  );
}

export default DonationLocation;
