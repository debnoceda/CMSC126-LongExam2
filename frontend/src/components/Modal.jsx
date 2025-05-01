import React from 'react';
import Card from './Card';
import { Icon } from "@iconify-icon/react";
import '../styles/Modal.css'; // Import your CSS file for styling

function Modal({ children, isOpen, onClose, onAction, className, title, actionTitle }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content ${className || ''}`} onClick={(e) => e.stopPropagation()}>
        <Card className="modal-card bg-white shadow">
          {children}
        </Card>
      </div>
    </div>
  );
}

export default Modal;