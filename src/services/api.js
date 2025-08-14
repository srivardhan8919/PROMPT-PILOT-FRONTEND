import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'https://prompt-pilot-backend.onrender.com';

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Optional: Add a response interceptor to handle 401s globally
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      const { pathname } = window.location;
      if (pathname !== '/login' && pathname !== '/signup') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

// Auth API service
export const authService = {
  // Register a new user
  signup: async (userData) => {
    const response = await api.post('/api/auth/signup', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  // Get current user profile
  getCurrentUser: async () => {
    return api.get('/api/auth/me');
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

// LLM (Large Language Model) API service
export const llmService = {
  // Improve a prompt
  improvePrompt: async (prompt, previousIntent = null) => {
    const response = await api.post('/api/llm/improve', { prompt, previous_intent: previousIntent });
    return response.data;
  },
};
