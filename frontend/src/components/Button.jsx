import React from 'react';
import { Icon } from '@iconify/react';
import '../styles/Button.css';

/**
 * Button Component
 *
 * Usage:
 * <Button
 *   type="large" // Options: 'large', 'small', 'icon-only', 'default'
 *   icon="mdi:plus" // Optional: icon name from Iconify
 *   text="Click Me" // Optional: button label
 *   onClick={() => console.log('Button clicked!')} // Optional: click handler
 *   className="custom-class" // Optional: additional CSS classes
 * />
 */

const Button = ({ type = 'default', icon = null, text = null, onClick = () => {}, className = '', ...props }) => {
    const buttonClass = `btn ${type} ${className}`;

    return (
        <button className={buttonClass} onClick={onClick} {...props}>
            {icon && <Icon icon={icon} className="btn-icon" />}
            {text && type !== 'icon-only' && <span className="btn-text">{text}</span>}
        </button>
    );
};

export default Button;
