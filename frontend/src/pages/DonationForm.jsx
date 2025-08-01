import React, { useState } from 'react';
import axios from 'axios';
import './DonationForm.css';
import { useNavigate } from 'react-router-dom';

function DonationForm() {
  const [formData, setFormData] = useState({
    foodType: '',
    location: '',
    detailedAddress: '',
    expiryDate: '',
    quantityAmount: '',
    quantityUnit: '',
    phone: '',
    whatsapp: '',
    image: null,
  });

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setSubmitted(false);

    try {
      const token = localStorage.getItem('token');
      const data = new FormData();

      data.append('foodType', formData.foodType);
      data.append('location', formData.location);
      data.append('detailedAddress', formData.detailedAddress);
      data.append('expiryDate', formData.expiryDate);
      data.append('quantityAmount', formData.quantityAmount);
      data.append('quantityUnit', formData.quantityUnit);
      data.append('phone', formData.phone);
      data.append('whatsapp', formData.whatsapp);
      if (formData.image) data.append('image', formData.image);

      await axios.post('https://food-waste-donation.onrender.com/api/donations', data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccessMsg('Donation submitted successfully!');
      setSubmitted(true);
      setFormData({
        foodType: '',
        location: '',
        detailedAddress: '',
        expiryDate: '',
        quantityAmount: '',
        quantityUnit: '',
        phone: '',
        whatsapp: '',
        image: null,
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 5000);

    } catch (error) {
      console.error('Donation error:', error.response?.data || error.message);
      setErrorMsg(error.response?.data?.msg || 'Something went wrong.');
    }
  };

  return (
    <div className="donation-form-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Donate Food</h2>
      {successMsg && <p style={{ color: 'green', fontWeight: 'bold' }}>{successMsg}</p>}
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

      {!submitted && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="foodType"
            placeholder="Food Type"
            value={formData.foodType}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="detailedAddress"
            placeholder="Detailed Address"
            value={formData.detailedAddress}
            onChange={handleChange}
            required
          />
          <label>Available Date and Time:</label>
          <input
            type="datetime-local"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            required
          />

          <div className="quantity-row">
            <input
              type="number"
              name="quantityAmount"
              placeholder="Quantity Amount"
              value={formData.quantityAmount}
              onChange={handleChange}
              required
            />
            <select
              name="quantityUnit"
              value={formData.quantityUnit}
              onChange={handleChange}
              required
            >
              <option value="">Select Unit</option>
              <option value="kg">kg</option>
              <option value="grams">grams</option>
              <option value="liters">liters</option>
              <option value="servings">Serves (Number of People)</option>
            </select>
          </div>

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="whatsapp"
            placeholder="WhatsApp Number"
            value={formData.whatsapp}
            onChange={handleChange}
            required
          />
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />
          <button type="submit" style={{ marginTop: '10px' }}>Submit Donation</button>
        </form>
      )}
    </div>
  );
}

export default DonationForm;
