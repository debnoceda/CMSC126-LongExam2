import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import "../styles/Dropdown.css";

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
    const selectedValue = typeof option === 'object' ? option.value : option;
    setSelected(option);
    if (onSelect) onSelect(selectedValue);
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

  const getLabel = (opt) => (typeof opt === 'object' ? opt.label : opt);
  const displayValue = selected ? getLabel(selected) : placeholder;

  return (
    <div className={`custom-dropdown ${className}`} ref={dropdownRef}>
      <div
        className={`dropdown-toggle ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {displayValue}
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
          {options.map((opt, i) => {
            const label = getLabel(opt);
            const isSelected =
              selected === opt ||
              (typeof opt === "object" && selected?.value === opt.value);

            return (
              <li
                key={i}
                onClick={() => handleSelect(opt)}
                className={`dropdown-item ${isSelected ? "selected" : ""}`}
              >
                {label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
