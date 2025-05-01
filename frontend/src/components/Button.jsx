import React from "react";
import { Icon } from "@iconify/react";
import "../styles/Button.css";

/**
 * Button Component
 *
 * Usage:
 * <Button
 *   type="large" // Options: 'large', 'small', 'icon-only', 'non-compact'
 *   icon="mdi:plus" // Optional: icon name from Iconify
 *   text="Click Me" // Optional: button label
 *   onClick={() => console.log('Button clicked!')} // Optional: click handler
 *   className="custom-class" // Optional: additional CSS classes
 * />
 */

const Button = ({ type = "default", icon = null, text = null, onClick = () => {}, className = "", ...props }) => {
    const validTypes = ["large", "small", "icon-only"];
    const resolvedType = validTypes.includes(type) ? type : "text-button";

    const buttonClass = `btn btn-${resolvedType} ${className}`;

    return (
        <button className={buttonClass} onClick={onClick} {...props}>
            {icon && <Icon icon={icon} className="btn-icon" />}
            {text && resolvedType !== "icon-only" && <span className="btn-text">{text}</span>}
        </button>
    );
};

export default Button;
