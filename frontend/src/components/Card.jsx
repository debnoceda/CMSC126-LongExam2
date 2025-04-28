import React from 'react';
import '../styles/Card.css'; 

function Card({ children, className }) {
  return (
    <div className={`card ${className || ''}`}>
      {children}
    </div>
  );
}

export default Card;