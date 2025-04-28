import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Analytics from './pages/Analytics';
import Transaction from './pages/Transaction';
import Profile from './pages/Profile';
import LandingPage from './pages/LandingPage';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="/logout" element={<Logout />} />
        
        {/* Protected Routes with Layout */}
        <Route path="/" element={<ProtectedRoute><Layout><Navigate to="/home" /></Layout></ProtectedRoute>} />
        <Route path="/home" element={<ProtectedRoute><Layout><Home /></Layout></ProtectedRoute>} />
        <Route path="/transaction" element={<ProtectedRoute><Layout><Transaction /></Layout></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Layout><Analytics /></Layout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
