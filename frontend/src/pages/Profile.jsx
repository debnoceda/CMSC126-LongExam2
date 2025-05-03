import React, { useState, useEffect } from 'react';
import api from '../api';
import "../styles/Profile.css";
import Header from "../components/Header";
import Button from "../components/Button";
import defaultProfile from '../assets/Progil.png';
import Modal from '../components/Modal';
import ModalFooter from '../components/ModalFooter';
import ModalHeader from '../components/ModalHeader';
import Form from '../components/Form';
import { Icon } from "@iconify/react";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/api/users/');
        console.log(response.data);
        const data = response.data;
        if (Array.isArray(data) && data.length > 0) {
          setUser(data[0]);
        } else if (!Array.isArray(data)) {
          setUser(data);
        } else {
          setError('No user data available');
        }
      } catch (error) {
        setError('Failed to load user information');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('profile_picture', selectedFile);

    try {
      await api.put(`/api/users/${user.id}/update_profile_picture/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Fetch updated user data instead of reloading
      const response = await api.get('/api/users/');
      const data = response.data;
      if (Array.isArray(data) && data.length > 0) {
        setUser(data[0]);
      } else if (!Array.isArray(data)) {
        setUser(data);
      }
      
      setShowModal(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error("Upload failed", error);
      setError(error.response?.data?.message || 'Failed to upload profile picture');
    }
  };

  const handleDeleteProfilePicture = async () => {
    try {
      await api.delete(`/api/users/${user.id}/profile-picture/`);
      setShowModal(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete profile picture:", error);
    }
  };

  const handleSaveProfilePicture = async () => {
    if (selectedFile) {
      await handleUpload();
    }
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!user) return <div className="error">No user data available</div>;

  return (
    <div className="profile-page">
      <Header />
      <div className="profile-picture-section">
        <div className="profile-picture-container">
          <div className="profile-picture">
            <img 
              src={user.profile_picture} 
              alt="Profile" 
              className="profile-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultProfile;
              }}
            />
          </div>
          <Button 
            type="text-button" 
            text="Edit Profile Picture" 
            onClick={() => setShowModal(true)} 
          />
        </div>
      </div>

      <Modal isOpen={showModal} onClose={handleCloseModal}>
        <div className="upload-modal-content">
          <ModalHeader 
            title="Edit Profile Picture"
            onClose={handleCloseModal}
          />
          <div className="upload-photo-container">
            <div className="preview-container">
              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="preview-image"
                />
              ) : (
                <img 
                  src={user.profile_picture} 
                  alt="Profile" 
                  className="preview-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultProfile;
                  }}
                />
              )}
            </div>
            <label className='custom-file-label'>
              Upload Profile
              <input 
                type="file" 
                onChange={handleFileChange}
                accept="image/*"
                className="file-input"
              />
            </label>
          </div>
          <ModalFooter
            onDelete={handleDeleteProfilePicture}
            onAction={handleSaveProfilePicture}
            actionTitle="Done"
          />
        </div>
      </Modal>

      <div className="personal-info-section">
        {user ? (
          <>
            <div className="title-button-container">
              <h2>Personal Information</h2>
              {!isEditing && (
                <Button 
                  type="small" 
                  text="Edit" 
                  onClick={() => setIsEditing(true)}
                />
              )}
            </div>
            {isEditing ? (
              <Form 
                method="profile"
                initialValues={{
                  first_name: user.first_name,
                  last_name: user.last_name,
                  email: user.email,
                  monthly_budget: user.monthly_budget
                }}
                onSubmit={async (values) => {
                  try {
                    let formData = {};
                    
                    // Handle each field independently
                    if (values.first_name && values.first_name !== user.first_name) {
                      formData.first_name = values.first_name.trim();
                    }
                    
                    if (values.last_name && values.last_name !== user.last_name) {
                      formData.last_name = values.last_name.trim();
                    }
                    
                    if (values.email && values.email !== user.email) {
                      formData.email = values.email.trim();
                    }

                    // Improved monthly_budget handling
                    const newBudget = parseFloat(values.monthly_budget);
                    if (!isNaN(newBudget) && newBudget !== user.monthly_budget) {
                      formData.monthly_budget = newBudget;
                    }

                    // Debug what's being updated
                    console.log('Fields being updated:', Object.keys(formData));
                    console.log('Update data:', formData);

                    // Only make API call if there are changes
                    if (Object.keys(formData).length > 0) {
                      const response = await api.patch(`/api/users/${user.id}/`, formData);
                      setUser({ ...user, ...response.data });
                      setIsEditing(false);
                      alert("Profile updated successfully!");
                    } else {
                      setIsEditing(false);
                    }

                  } catch (error) {
                    console.error("Update failed:", error);
                    alert(error.response?.data?.message || "Failed to update profile");
                  }
                }}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
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
            )}
          </>
        ) : (
          <div>No user data to display.</div>
        )}
      </div>
    </div>
  );
}

export default Profile;
