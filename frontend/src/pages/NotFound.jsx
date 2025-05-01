import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import '../styles/NotFound.css';
import ErrorImage from '../assets/Error404.png';

function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="notfound-container">
            <img src={ErrorImage} alt="404 Not Found" className="notfound-image" />
            <h2>The page you are looking for doesn't exist.</h2>
            <div className="notfound-button-wrapper">
                <Button
                    type="small"
                    text="Go to Home"
                    onClick={() => navigate('/home')}
                    className="bg-main-color white-color"
                />
            </div>
        </div>
    );
}

export default NotFound;
