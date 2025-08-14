
import StartupScreen from './components/StartupScreen';
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

// Lazy load components
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Home = lazy(() => import('./pages/Home'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const tokenExpiry = localStorage.getItem('tokenExpiry');
  
  if (!token || !tokenExpiry) {
    return <Navigate to="/login" />;
  }
  
  // Check if token is expired
  if (new Date().getTime() > parseInt(tokenExpiry)) {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
    return <Navigate to="/login" />;
  }
  
  return children;
};



function App() {
  const [showStartup, setShowStartup] = React.useState(true);
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  return (
    <AuthProvider>
      {showStartup ? (
        <StartupScreen
          backendUrl={backendUrl}
          onReady={() => setShowStartup(false)}
        />
      ) : (
        <BrowserRouter>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      )}
    </AuthProvider>
  );
}

export default App;