import React from "react";
import "../styles/Header.css"; // Make sure you have a matching CSS file
import { Icon } from "@iconify/react";
import { useLocation, useNavigate } from "react-router-dom";
import NavigationBar from "./NavigationBar";

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isHome = location.pathname === "/home";

    const today = new Date().toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
    });
    const greeting = "Good Day,";
    const userName = "Dave";
    const userProfileImageUrl = "src/assets/Froggy.png";

    const handleTitleClick = () => {
        if (!isHome) navigate("/home");
    };

    return (
        <header className="header">
            <div className="header-content">
                {isHome ? (
                    <div className="home-header-text">
                        <p className="header-date">{today}</p>
                        <p className="header-greeting">{greeting}</p>
                        <h1 className="header-name">{userName}</h1>
                    </div>
                ) : (
                    <h1 className="header-title clickable" onClick={handleTitleClick}>
                        Frogetta
                    </h1>
                )}
                <NavigationBar />
                <nav className="header-nav">
                    <button className="header-btn addtransaction">
                        <Icon icon="typcn:plus" className="icon" style={{ fontSize: "7rem"}}/>
                    </button>
                    <button
                        className="header-btn profile"
                        style={{
                            backgroundImage: userProfileImageUrl ? `url(${userProfileImageUrl})` : "none",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat"
                        }}
                    ></button>
                </nav>
            </div>
        </header>
    );
};

export default Header;