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
          <header className="modal-header">
            <h2 className="modal-title">{title || 'Modal Title'}</h2> {/* Use title prop */}
            <button className="modal-close" onClick={onClose}>
              <Icon
                icon="line-md:close-circle-filled"
                width="3rem"
                height="3rem"
                style={{
                  color: "var(--gray)",
                }}
              />
            </button>
          </header>
          {children}
          <footer className="modal-footer">
            <button className="modal-close-button" onClick={onClose}>
              <Icon
                icon="mdi:delete"
                width="3rem"
                height="3rem"
                style={{
                  color: "var(--red)",
                }}
              />
            </button>
            <button className="modal-action-button" onClick={onAction}>
              {actionTitle || 'Action'}
            </button>
          </footer>
        </Card>
      </div>
    </div>
  );
}

export default Modal;