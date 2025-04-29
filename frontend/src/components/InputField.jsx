import React, { useState } from 'react';
import '../styles/InputField.css';

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
    onBlur
}) {
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
        </div>
    );
}

export default InputField;
