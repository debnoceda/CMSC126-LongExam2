import React, { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import InputField from "./InputField";
import Button from "./Button";
import ConfirmAlert from "./ConfirmAlert";
import "../styles/Form.css";

function Form({ route, method, initialValues, onSubmit, onCancel }) {
    const [firstName, setFirstName] = useState(initialValues?.first_name || "");
    const [lastName, setLastName] = useState(initialValues?.last_name || "");
    const [email, setEmail] = useState(initialValues?.email || "");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [monthlyBudget, setMonthlyBudget] = useState(initialValues?.monthly_budget.toString() || "");
    const [loading, setLoading] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [focusedField, setFocusedField] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const navigate = useNavigate();

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)) {
            setPasswordError("Must contain 1 uppercase, 1 number, and minimum of 8 characters");
            return false;
        }
        setPasswordError("");
        return true;
    };

    const validateConfirmPassword = (password, confirmPass) => {
        if (password !== confirmPass) {
            setConfirmPasswordError("Passwords do not match");
            return false;
        }
        setConfirmPasswordError("");
        return true;
    };

    const checkForChanges = () => {
        if (method === "profile") {
            return firstName !== initialValues.first_name ||
                lastName !== initialValues.last_name ||
                email !== initialValues.email ||
                monthlyBudget.toString() !== initialValues.monthly_budget.toString() ||
                currentPassword !== "" ||
                newPassword !== "" ||
                confirmPassword !== "";
        }
        return false;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (method === "profile") {
            if (checkForChanges()) {
                setConfirmAction('save');
                setIsConfirmOpen(true);
            }
            return;
        }

        setLoading(true);

        try {
            const data = method === "login" 
                ? { username: email, password: currentPassword }
                : { first_name: firstName, last_name: lastName, email, password: newPassword };

            console.log("Sending data:", data);
            
            const response = await api.post(route, data);

            if (response.data) {
                console.log("Response data:", response.data);
                if (method === "login") {
                    localStorage.setItem(ACCESS_TOKEN, response.data.access);
                    localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
                }
                navigate(method === "login" ? "/home" : "/login");
            }
        } catch (error) {
            console.error("Error:", error);
            if (error.response) {
                console.error("Response data:", error.response.data);
                console.error("Status:", error.response.status);
                alert(`Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
            } else {
                alert(error);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = (e) => {
        e.preventDefault();
        if (checkForChanges()) {
            setConfirmAction('cancel');
            setIsConfirmOpen(true);
        } else {
            onCancel();
        }
    };

    const handleConfirm = async () => {
        if (confirmAction === 'save') {
            const formData = {
                first_name: firstName,
                last_name: lastName,
                email: email,
                monthly_budget: parseFloat(monthlyBudget)
            };

            if (newPassword) {
                if (!validatePassword(newPassword) || !validateConfirmPassword(newPassword, confirmPassword)) {
                    return;
                }
                formData.current_password = currentPassword;
                formData.new_password = newPassword;
            }

            await onSubmit(formData);
        } else if (confirmAction === 'cancel') {
            onCancel();
        }
        setIsConfirmOpen(false);
    };

    const handleFocus = (fieldName) => {
        setFocusedField(fieldName);
    };

    const handleBlur = () => {
        setFocusedField(null);
    };

    if (method === "profile") {
        return (
            <>
                <form onSubmit={handleSubmit} className="form-container">
                    <div className="name-container">
                        <InputField
                            label="First Name"
                            className="form-input"
                            type="text"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            status={focusedField === 'firstName' ? 'focused' : 'default'}
                            onFocus={() => handleFocus('firstName')}
                            onBlur={handleBlur}
                        />
                        <InputField
                            label="Last Name"
                            className="form-input"
                            type="text"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            status={focusedField === 'lastName' ? 'focused' : 'default'}
                            onFocus={() => handleFocus('lastName')}
                            onBlur={handleBlur}
                        />
                    </div>

                    <InputField
                        label="Email"
                        className="form-input"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        status={focusedField === 'email' ? 'focused' : 'default'}
                        onFocus={() => handleFocus('email')}
                        onBlur={handleBlur}
                    />

                    <InputField
                        label="Current Password"
                        className="form-input"
                        type="password"
                        placeholder="Current Password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        status={focusedField === 'currentPassword' ? 'focused' : 'default'}
                        onFocus={() => handleFocus('currentPassword')}
                        onBlur={handleBlur}
                    />

                    <InputField
                        label="New Password"
                        className="form-input"
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => {
                            setNewPassword(e.target.value);
                            validatePassword(e.target.value);
                        }}
                        status={passwordError ? 'error' : (focusedField === 'newPassword' ? 'focused' : 'default')}
                        onFocus={() => handleFocus('newPassword')}
                        onBlur={handleBlur}
                        message={passwordError || "Must contain 1 uppercase, 1 number, and minimum of 8 characters"}
                        messageType={passwordError ? 'error' : 'info'}
                    />

                    <InputField
                        label="Confirm New Password"
                        className="form-input"
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            validateConfirmPassword(newPassword, e.target.value);
                        }}
                        status={confirmPasswordError ? 'error' : (focusedField === 'confirmPassword' ? 'focused' : 'default')}
                        onFocus={() => handleFocus('confirmPassword')}
                        onBlur={handleBlur}
                        message={confirmPasswordError}
                        messageType={confirmPasswordError ? 'error' : 'default'}
                    />

                    <InputField
                        label="Monthly Budget"
                        className="form-input"
                        type="number"
                        placeholder="Monthly Budget"
                        value={monthlyBudget}
                        onChange={(e) => setMonthlyBudget(e.target.value)}
                        required
                        status={focusedField === 'monthlyBudget' ? 'focused' : 'default'}
                        onFocus={() => handleFocus('monthlyBudget')}
                        onBlur={handleBlur}
                    />
                    <div className="profile-buttons">
                        <Button 
                            type="small" 
                            text="Cancel" 
                            onClick={handleCancel}
                        />
                        <Button 
                            type="small" 
                            text="Done" 
                            onClick={handleSubmit}
                        />
                    </div>
                </form>
                
                <ConfirmAlert
                    isOpen={isConfirmOpen}
                    title={confirmAction === 'save' ? "Save Changes" : "Discard Changes"}
                    mainActionTitle={confirmAction === 'save' ? "Save" : "Discard"}
                    secondActionTitle="Cancel"
                    onMainAction={handleConfirm}
                    onSecondAction={() => setIsConfirmOpen(false)}
                >
                    {confirmAction === 'save' 
                        ? "Are you sure you want to save these changes?"
                        : "Are you sure you want to discard your changes?"}
                </ConfirmAlert>
            </>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="form-container">
            {method === "register" && (
                <>
                    <div className="name-container">
                        <InputField
                            label="First Name"
                            className="form-input"
                            type="text"
                            placeholder="John"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            status={focusedField === 'firstName' ? 'focused' : 'default'}
                            onFocus={() => handleFocus('firstName')}
                            onBlur={handleBlur}
                        />
                        <InputField
                            label="Last Name"
                            className="form-input"
                            type="text"
                            placeholder="Doe"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            status={focusedField === 'lastName' ? 'focused' : 'default'}
                            onFocus={() => handleFocus('lastName')}
                            onBlur={handleBlur}
                        />
                    </div>
                </>
            )}

            <InputField
                label="Email"
                className="form-input"
                type="email"
                placeholder="johndoe@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                status={focusedField === 'email' ? 'focused' : 'default'}
                onFocus={() => handleFocus('email')}
                onBlur={handleBlur}
            />
            <div className="password-container">
                <InputField
                    label="Password"
                    className="form-input"
                    type="password"
                    placeholder="Password"
                    value={currentPassword}
                    onChange={(e) => {
                        setCurrentPassword(e.target.value);
                        if (method === "register") {
                            validatePassword(e.target.value);
                        }
                    }}
                    required
                    status={passwordError ? 'error' : (focusedField === 'password' ? 'focused' : 'default')}
                    onFocus={() => handleFocus('password')}
                    onBlur={handleBlur}
                    message={
                        method === "register"
                          ? (passwordError ? passwordError : "Must contain 1 uppercase, 1 number, and minimum of 8 characters")
                          : ""
                      }
                      messageType={passwordError ? 'error' : 'info'}
                />
            </div>

            {method === "register" && (
                <div className="password-container">
                    <InputField
                        label="Confirm Password"
                        className="form-input"
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            validateConfirmPassword(currentPassword, e.target.value);
                        }}
                        required
                        status={confirmPasswordError ? 'error' : (focusedField === 'confirmPassword' ? 'focused' : 'default')}
                        onFocus={() => handleFocus('confirmPassword')}
                        onBlur={handleBlur}
                        message={confirmPasswordError || ''}
                        messageType={confirmPasswordError ? 'error' : 'default'}
                    />
                </div>
            )}
            <Button
                type="large"
                text={method === "login" ? "Login" : "Register"}
            />
        </form>
    );
}

export default Form;
