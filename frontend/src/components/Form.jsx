import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";

function Form({route, method}) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const navigate = useNavigate();

    const name = method === "login" ? "Login" : "Register";

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)) {
            setPasswordError("Password must contain at least 1 uppercase letter, 1 number, and be minimum 8 characters");
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (method === "register") {
            if (!validatePassword(password) || !validateConfirmPassword(password, confirmPassword)) {
                return;
            }
        }
        
        setLoading(true);

        try {
            const data = method === "login" 
                ? { username: email, password }
                : { first_name: firstName, last_name: lastName, email, password };

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
    }

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>{name}</h1>
            
            {method === "register" && (
                <>
                    <input
                        className="form-name"
                        type="text"
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                    <input
                        className="form-name"
                        type="text"
                        placeholder="Doe"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </>
            )}

            <input
                className="form-input"
                type="email"
                placeholder="johndoe@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <div className="password-container">
                <input
                    className="form-input"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        if (method === "register") {
                            validatePassword(e.target.value);
                        }
                    }}
                    required
                />
                {passwordError && <div className="error-message">{passwordError}</div>}
            </div>

            {method === "register" && (
                <div className="password-container">
                    <input
                        className="form-input"
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            validateConfirmPassword(password, e.target.value);
                        }}
                        required
                    />
                    {confirmPasswordError && <div className="error-message">{confirmPasswordError}</div>}
                </div>
            )}

            <button className="form-button" type="submit">
                {name}
            </button>
        </form>
    );
}

export default Form;
