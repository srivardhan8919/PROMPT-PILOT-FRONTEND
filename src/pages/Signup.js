// frontend/src/pages/Signup.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import './Signup.css';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Password validation states
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };
    setPasswordRequirements(requirements);
    return requirements;
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const isPasswordValid = () => {
    return Object.values(passwordRequirements).every(req => req === true);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    if (!isPasswordValid()) {
      setError('Please ensure your password meets all requirements');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      await authService.signup({ name, email, password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title">Create Account</h2>
        {error && <div className="signup-error">{error}</div>}
        <form onSubmit={handleSubmit} className="signup-form">
          <label htmlFor="name" className="signup-label">Full Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="signup-input"
          />

          <label htmlFor="email" className="signup-label">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="signup-input"
          />

          <label htmlFor="password" className="signup-label">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
            className="signup-input"
          />

          {/* Password requirements */}
          <div className="password-requirements">
            <h4>Password must contain:</h4>
            <div className="requirement-item">
              <span className={`requirement-check ${passwordRequirements.length ? 'valid' : ''}`}>
                {passwordRequirements.length ? '✓' : '○'}
              </span>
              <span>At least 8 characters</span>
            </div>
            <div className="requirement-item">
              <span className={`requirement-check ${passwordRequirements.uppercase ? 'valid' : ''}`}>
                {passwordRequirements.uppercase ? '✓' : '○'}
              </span>
              <span>One uppercase letter (A-Z)</span>
            </div>
            <div className="requirement-item">
              <span className={`requirement-check ${passwordRequirements.lowercase ? 'valid' : ''}`}>
                {passwordRequirements.lowercase ? '✓' : '○'}
              </span>
              <span>One lowercase letter (a-z)</span>
            </div>
            <div className="requirement-item">
              <span className={`requirement-check ${passwordRequirements.number ? 'valid' : ''}`}>
                {passwordRequirements.number ? '✓' : '○'}
              </span>
              <span>One number (0-9)</span>
            </div>
            <div className="requirement-item">
              <span className={`requirement-check ${passwordRequirements.special ? 'valid' : ''}`}>
                {passwordRequirements.special ? '✓' : '○'}
              </span>
              <span>One special character (!@#$%^&*)</span>
            </div>
          </div>

          <button 
            type="submit" 
            className="signup-button" 
            disabled={loading || !isPasswordValid()}
          >
            {loading ? 'Creating…' : 'Sign Up'}
          </button>
        </form>
        <p className="signup-footer">
          Already have an account?{' '}
          <Link to="/login" className="signup-link">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
