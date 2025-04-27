import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import '../styles/Header.css';
import { jwtDecode } from 'jwt-decode';
import { ACCESS_TOKEN } from '../constants';

function Header() {
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            const decoded = jwtDecode(token);
            if (decoded.first_name || decoded.last_name) {
                setUserName(`${decoded.first_name || ''} ${decoded.last_name || ''}`);
            } else if (decoded.email) {
                setUserName(decoded.email);
            } else {
                setUserName('User');
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <header className="app-header">
            <h1>Froggy</h1>
            <div className="user-section">
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
        </header>
    );
}

export default Header; 