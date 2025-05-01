import React, { useEffect } from 'react';
import '../styles/Landing.css';

function LandingPage() {
  useEffect(() => {
    const originalMargin = document.body.style.margin;
    document.body.style.margin = '0';
  
    return () => {
      document.body.style.margin = originalMargin;
    };
  }, []);

  return (
    <div className="landing-page">
      <header className="header">
        <nav className="landing-navbar">
          <a href="/login">Log In</a>
          <div className="logo">Frogetta</div>
          <a href="/register">Sign Up</a>
        </nav>
      </header>

      <main className="landing-hero">
        <h1 className="landing-title">Hop into</h1>
        <h1 className="landing-subtitle white-color">SMART FINANCES</h1>
        <a href="/register" className="main-button">Get Started</a>
      </main>
    </div>
  );
}

export default LandingPage;
