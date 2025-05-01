import React, { useState } from 'react';
import '../styles/InputField.css';
import { Icon } from "@iconify/react";

function InputField({
    label,
    type,
    value,
    onChange,
    placeholder,
    className = '',
    required,
    variant = 'medium',
    status = 'default',
    onFocus,
    onBlur,
    message = '',
    messageType = 'default' //  'error', 'info'
}) {
    const getMessageIcon = (type) => {
        switch (type) {
            case 'error':
                return <Icon icon="mdi:information" width="24" height="24"  style={{color: "#CD3738"}} />;
            case 'info':
                return <Icon icon="mdi:information" width="24" height="24" style={{ opacity: 0.5 }} />;
            default:
                return null;
        }
    };

    return (
        <div className={`input-field ${className}`}>
            {label && <p className="input-label">{label}</p>}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`input-element ${variant} ${status}`}
                required={required}
                onFocus={onFocus}
                onBlur={onBlur}
            />
            {message && (
                <div className={`input-message-container ${messageType}`}>
                    {getMessageIcon(messageType)}
                    <p className={`input-message ${messageType}`}>
                        {message}
                    </p>
                </div>
            )}
        </div>
    );
}

export default InputField;
