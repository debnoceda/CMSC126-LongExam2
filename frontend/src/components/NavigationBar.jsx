import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/NavigationBar.css";

const NavigationBar = () => {
    const [clicked, setClicked] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const refs = [useRef(null), useRef(null), useRef(null), useRef(null)];

    const pathToIndex = {
        '/home': 0,
        '/wallets': 1,
        '/transaction': 2,
        '/analytics': 3,
    };

    useEffect(() => {
        const currentIndex = pathToIndex[location.pathname];
        setClicked(currentIndex !== undefined ? currentIndex : null);
    }, [location.pathname]);

    const handleClick = (index) => {
        setClicked(index === clicked ? null : index);
        // Navigation is already handled in the onClick of the div
    };

    useEffect(() => {
        if (clicked !== null && refs[clicked]?.current) {
            const text = refs[clicked].current;
            text.style.transform = "translateX(-20px)";
            text.style.opacity = "0";
            setTimeout(() => {
                text.style.transition = "transform 0.3s ease, opacity 0.3s ease";
                text.style.transform = "translateX(0)";
                text.style.opacity = "1";
            }, 10);
        }
    }, [clicked]);

    return (
        <div className="navbar">
            {/* Home */}
            <div className="nav-item" onClick={() => { handleClick(0); navigate('/home'); }}>
                <button className="nav-btn">
                    <Icon icon={clicked === 0 ? "material-symbols:home-rounded" : "material-symbols:home-outline-rounded"} className="icon" style={{ fontSize: "4.25rem" }} />
                </button>
                {clicked === 0 && <span ref={refs[0]} className={`nav-text bold ${clicked === 0 ? "show" : ""}`} onClick={(e) => e.stopPropagation()}>Home</span>}
            </div>

            {/* Wallet */}
            <div className="nav-item" onClick={() => { handleClick(1); navigate('/wallets'); }}>
                <button className={"nav-btn"}>
                    <Icon icon={clicked === 1 ? "fluent:wallet-credit-card-32-filled" : "fluent:wallet-credit-card-32-regular"} className="icon" style={{ stroke: "black", strokeWidth: 0.75 , fontSize: "4rem" }}/>
                </button>
                {clicked === 1 && <span ref={refs[1]} className={`nav-text bold ${clicked === 1 ? "show" : ""}`} onClick={(e) => e.stopPropagation()}>Wallet</span>}
            </div>

            {/* Transactions */}
            <div className="nav-item" onClick={() => { handleClick(2); navigate('/transaction'); }}>
                <button className={"nav-btn"}>
                    <Icon icon={clicked === 2 ? "icon-park-solid:transaction-order" : "icon-park-outline:transaction-order"} className="icon" style={{ fontSize: "4rem"}}/>
                </button>
                {clicked === 2 && <span ref={refs[2]} className={`nav-text bold ${clicked === 2 ? "show" : ""}`} onClick={(e) => e.stopPropagation()}>Transactions</span>}
            </div>

            {/* Analytics */}
            <div className="nav-item" onClick={() => { handleClick(3); navigate('/analytics'); }}>
                <button className={"nav-btn"}>
                    <Icon icon={clicked === 3 ? "material-symbols:analytics" : "material-symbols:analytics-outline"} className="icon" style={{ fontSize: "4.25rem"}}/>
                </button>
                {clicked === 3 && <span ref={refs[3]} className={`nav-text bold ${clicked === 3 ? "show" : ""}`}>Analytics</span>}
            </div>
        </div>
    );
};

export default NavigationBar;