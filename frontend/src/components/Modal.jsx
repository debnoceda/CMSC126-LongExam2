import React from 'react';
import Card from './Card';
import { Icon } from "@iconify/react";
import '../styles/Modal.css';

function Modal({ children, isOpen, onClose, className }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className={`modal-content ${className || ''}`} onClick={(e) => e.stopPropagation()}>
        <Card className="modal-card bg-white shadow">
          {children}
        </Card>
      </div>
    </div>
  );
}

export default Modal;