import React from 'react';
import '../styles/InputField.css';

function InputField({ label, type, value, onChange, placeholder }) {
  return (
    <div className="input-field">
      <label className="input-label">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input-element"
      />
    </div>
  );
}

export default InputField;