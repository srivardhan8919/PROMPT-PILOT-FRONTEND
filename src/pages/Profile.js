import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { authService } from '../services/api';
import './Profile.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await authService.getCurrentUser();
        setUser(response.data);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleEdit = () => {
    navigate('/edit-profile'); // Ensure you create a route/component for editing
  };

  const handleLogout = () => {
    authService.logout(); // Implement logout in authService if not present
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="profile-wrapper">
        <Sidebar />
        <main className="profile-main">
          <Header />
          <div className="profile-content">
            <p>Loading profile...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="profile-wrapper">
      <Sidebar />
      <main className="profile-main">
        <Header />
        <div className="profile-content">
          <h2>User Profile</h2>
          {error ? (
            <p className="error-message">{error}</p>
          ) : (
            <div className="profile-card">
              <img
                src={user?.profileImage || `https://ui-avatars.com/api/?name=${user?.name || 'User'}`}
                alt={user?.name || "User"}
                className="profile-avatar"
              />
              <div className="profile-details">
                <p><strong>Name:</strong> {user?.name || "Not available"}</p>
                <p><strong>Email:</strong> {user?.email || "Not available"}</p>
                <p><strong>Plan:</strong> {user?.plan || "Free Tier"}</p>
                <button className="edit-button" onClick={handleEdit}>Edit Profile</button>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Profile;
