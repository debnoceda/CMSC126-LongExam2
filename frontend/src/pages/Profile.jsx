import React, { useState, useEffect } from 'react';
import api from '../api';
import "../styles/Profile.css";
import Header from "../components/Header";
import Button from "../components/Button";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/api/users/');
        console.log('Raw response:', response);
        console.log('User data:', response.data);

        // Handle if API returns an array or a single user object
        const data = response.data;
        if (Array.isArray(data) && data.length > 0) {
          setUser(data[0]); // pick the first user, or modify logic as needed
        } else if (!Array.isArray(data)) {
          setUser(data);
        } else {
          setError('No user data available');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user information');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="profile-page">
      <Header />
      <div className="profile-picture-section">
        {/* Profile picture logic can be added here later */}
      </div>
      <div className="personal-info-section">
        {user ? (
          <>
            <div className="title-button-container">
              <h2>Personal Information</h2>
              <Button type="small" text="Edit"></Button>
            </div>
            <div className="info-grid">
              <div className="user-name">
                <div className="info-item">
                  <label>First Name</label>
                  <p>{user.first_name}</p>
                </div>
                <div className="info-item">
                  <label>Last Name</label>
                  <p>{user.last_name}</p>
                </div>
              </div>
              <div className="info-item">
                <label>Email</label>
                <p>{user.email}</p>
              </div>
              <div className="info-item">
                <label>Password</label>
                <p>{user.email}</p>
              </div>
              <div className="separator"></div>
              <div className="info-item-monthly-budget">
                <h2>Monthly Budget</h2>
                <h1>₱{user.monthly_budget?.toFixed(2) || '0.00'}</h1>
              </div>
            </div>
          </>
        ) : (
          <div>No user data to display.</div>
        )}
      </div>
    </div>
  );
}

export default Profile;
