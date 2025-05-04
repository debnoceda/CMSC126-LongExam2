import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import './styles/index.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Analytics from './pages/Analytics';
import Transaction from './pages/Transaction';
import Profile from './pages/Profile';
import LandingPage from './pages/LandingPage';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Wallets from './pages/Wallets';

function Layout({ children }) {
  return (
    <div>
      {children}
    </div>
  );
}

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  useEffect(() => {
    localStorage.clear();
  }, []);

  return <Register />;
}

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterAndLogout /></PublicRoute>} />
          <Route path="/logout" element={<Logout />} />
          
          {/* Protected Routes with Layout */}
          <Route path="/home" element={<ProtectedRoute><Layout><Home /></Layout></ProtectedRoute>} />
          <Route path="/wallets" element={<ProtectedRoute><Layout><Wallets/></Layout></ProtectedRoute>} />
          <Route path="/transaction" element={<ProtectedRoute><Layout><Transaction/></Layout></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Layout><Analytics /></Layout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
