import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react"; // Import the Icon component
import "../styles/Dropdown.css"; // Link your custom styles here

/**
 * CustomDropdown Component
 *
 * Props:
 * - options: Array of option strings or objects
 * - onSelect: Function to call with selected value
 * - placeholder: Optional placeholder text
 * - className: Optional additional class names
 *
 * Usage:
 * <CustomDropdown
 *   options={['Option 1', 'Option 2']}
 *   onSelect={(value) => console.log(value)}
 *   placeholder="Select an option"
 * />
 *
 * Example:
 * const options = ['Apple', 'Banana', 'Cherry', 'Date']; // ✅ Define it
 * const handleSelect = (value) => {
 *      console.log('Selected:', value);
    };

    <Dropdown
        options={options}
        onSelect={handleSelect}
        placeholder="Choose a fruit"
    />
 */
const Dropdown = ({
  options = [],
  onSelect,
  placeholder = "Select",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const dropdownRef = useRef(null);

  const handleSelect = (option) => {
    setSelected(option);
    onSelect && onSelect(option);
    setIsOpen(false);
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`custom-dropdown ${className}`} ref={dropdownRef}>
      <div
        className={`dropdown-toggle ${isOpen ? "active" : ""}`} // Add 'active' class when open
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected || placeholder}
        <span className="arrow">
          {isOpen ? (
            <Icon className="dropdown-arrow" icon="mdi:chevron-up" />
          ) : (
            <Icon className="dropdown-arrow" icon="mdi:chevron-down" />
          )}
        </span>
      </div>
      {isOpen && (
        <ul className="dropdown-menu">
          {options.map((opt, i) => (
            <li
              key={i}
              onClick={() => handleSelect(opt)}
              className={`dropdown-item ${opt === selected ? "selected" : ""}`} // Add 'selected' class if option is selected
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
