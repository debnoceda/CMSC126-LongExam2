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
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const name = method === "login" ? "Login" : "Register";

    const handleSubmit = async (e) => {
        e.preventDefault();
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
            <input
                className="form-input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <button className="form-button" type="submit">
                {name}
            </button>
        </form>
    );
}

export default Form;
