import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await api.get('/api/auth/me');
      setUser(response.data);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [fetchUserProfile]);

  const login = async (email, password) => {
    try {
      setError(null);
      console.log('Attempting login with:', { email });
      
      const response = await api.post('/api/auth/login', { email, password });
      console.log('Login response:', response.data);
      
      const { token } = response.data;
      
      if (!token) {
        console.error('No token in response:', response.data);
        setError('Invalid response from server');
        return false;
      }
      
      localStorage.setItem('token', token);
      // Set token expiry to 24 hours from now
      localStorage.setItem('tokenExpiry', new Date().getTime() + 24 * 60 * 60 * 1000);
      
      await fetchUserProfile();
      return true;
    } catch (err) {
      console.error('Login error:', err);
      
      if (err.response) {
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
        setError(err.response.data?.message || 'Login failed');
      } else if (err.request) {
        console.error('No response received:', err.request);
        setError('No response from server. Please check your connection.');
      } else {
        console.error('Error setting up request:', err.message);
        setError('Error setting up request');
      }
      
      return false;
    }
  };

  const signup = async (email, password, name) => {
    try {
      setError(null);
      const response = await api.post('/api/auth/signup', { email, password, name });
      const { token } = response.data;
      
      if (!token) {
        setError('Invalid response from server');
        return false;
      }
      
      localStorage.setItem('token', token);
      // Set token expiry to 24 hours from now
      localStorage.setItem('tokenExpiry', new Date().getTime() + 24 * 60 * 60 * 1000);
      
      await fetchUserProfile();
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 