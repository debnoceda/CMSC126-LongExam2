import React from 'react';
import '../styles/index.css';
import '../styles/Landing.css';

function LandingPage() {
  return (
    <div className="landing-page">
      <header className="header">
        <nav className="navbar">
          <a href="#login">Log In</a>
          <div className="logo">Frogetta</div>
          <a href="#signup">Sign Up</a>
        </nav>
      </header>

      <main className="landing-hero">
        <h1 className="landing-title">Hop into</h1>
        <h1 className="landing-subtitle white-color">SMART FINANCES</h1>
        <a href = "#signup" className="main-button">Get Started</a>
      </main>
    </div>
  );
}

export default LandingPage;
