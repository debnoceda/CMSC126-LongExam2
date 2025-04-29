import React from 'react';
import '../styles/Card.css';

function Card({ children, className, style }) {
  return (
    <div className={`card ${className || ''}`} style={style}>
      {children}
    </div>
  );
}

export default Card;