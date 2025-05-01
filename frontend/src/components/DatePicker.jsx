import React, { useState, useEffect } from "react";
import DatePicker from "rsuite/DatePicker";
import "rsuite/DatePicker/styles/index.css";
import "../styles/DatePicker.css";

const CustomDatepicker = ({ selectedDate, onChange, placeholder = "Pick a date", className = "" }) => {
    const [date, setDate] = useState(selectedDate ? new Date(selectedDate) : null);

    useEffect(() => {
        if (selectedDate) {
            const validDate = new Date(selectedDate);
            if (!isNaN(validDate)) {
                setDate(validDate);
            } else {
                console.warn("Invalid date format received:", selectedDate);
                setDate(null);
            }
        } else {
            setDate(null);
        }
    }, [selectedDate]);

    const handleChange = (value) => {
        // Handle empty string, null, or invalid date
        if (!value || !(value instanceof Date) || isNaN(value)) {
            setDate(null);
            if (onChange) onChange(null);
        } else {
            setDate(value);
            if (onChange) onChange(value);
        }
    };

    return (
        <div className={`custom-datepicker ${className}`}>
            <DatePicker
                oneTap
                value={date}
                onChange={(value) => {
                    if (value === null || (value instanceof Date && isNaN(value.getTime()))) {
                        setDate(null);
                        if (onChange) onChange(null);
                    } else {
                        handleChange(value);
                    }
                }}
                format="yyyy-MM-dd"
                placeholder={placeholder}
                allowClean
                style={{
                    borderRadius: "1.25rem",
                    fontSize: "1rem",
                    backgroundColor: "white",
                    width: "100%",
                }}
            />
        </div>
    );
};

export default CustomDatepicker;
