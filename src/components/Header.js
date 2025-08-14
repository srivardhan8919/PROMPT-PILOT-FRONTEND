// frontend/src/components/Header.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {
  const navigate = useNavigate();

  const handleAvatarClick = () => {
    navigate('/profile');
  };

  const handleHomeredirect = () => {
    navigate('/');
  };

  return (
    <header className="top-header">
      <h1 className="app-title" 
          onClick={handleHomeredirect}
          style={{ cursor: 'pointer' }}
          >PromptPilot</h1>
      <div className="user-profile">
        <img
          src="https://ui-avatars.com/api/?name=User"
          alt="User"
          className="user-avatar"
          onClick={handleAvatarClick}
          style={{ cursor: 'pointer' }}
        />
      </div>
    </header>
  );
}

export default Header;
