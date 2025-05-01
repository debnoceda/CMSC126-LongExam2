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
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

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

    const isPasswordField = type === 'password';
    const inputType = isPasswordField && showPassword ? 'text' : type;

    return (
        <div className={`input-field ${className}`}>
            {label && <p className="input-label">{label}</p>}
            <div className="input-wrapper">
                <input
                    type={inputType}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`input-element ${variant} ${status} ${isPasswordField ? 'with-icon' : ''}`}
                    required={required}
                    onFocus={onFocus}
                    onBlur={onBlur}
                />
                {isPasswordField && (
                    <div 
                        className="password-toggle-inner"
                        onClick={togglePasswordVisibility}
                    >
                        <Icon
                            icon={showPassword ? "lucide:eye-off" : "lucide:eye"}
                            width="24"
                            height="24"
                            style={{ opacity: 0.6, cursor: 'pointer' }}
                        />
                    </div>
                )}
            </div>
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
