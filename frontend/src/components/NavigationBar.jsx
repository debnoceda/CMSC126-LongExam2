import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import "../styles/NavigationBar.css";

const NavigationBar = () => {
    const [clicked, setClicked] = useState(null);

    const handleClick = (index) => {
        setClicked(index === clicked ? null : index);
    };

    const refs = [useRef(null), useRef(null), useRef(null), useRef(null)];

    useEffect(() => {
        if (clicked !== null && refs[clicked]?.current) {
            const text = refs[clicked].current;
            text.style.transform = "translateX(-20px)";
            text.style.opacity = "0";
            setTimeout(() => {
                text.style.transition = "transform 0.7s ease, opacity 0.3s ease";
                text.style.transform = "translateX(0)";
                text.style.opacity = "1";
            }, 10);
        }
    }, [clicked]);

    return (
        <div className="navbar">
            {/* Home */}
            <div className="nav-item" onClick={() => handleClick(0)}>
                <button className="nav-btn">
                    <Icon icon="material-symbols:home-outline-rounded" className="icon" style={{ fontSize: "4.25rem" }} />
                </button>
                {clicked === 0 && <span ref={refs[0]} className={`nav-text bold ${clicked === 0 ? "show" : ""}`} onClick={(e) => e.stopPropagation()}>Home</span>}
            </div>

            {/* Wallet */}
            <div className="nav-item" onClick={() => handleClick(1)}>
                <button className={"nav-btn"}>
                    <Icon icon="lucide:wallet" className="icon" />
                </button>
                {clicked === 1 && <span ref={refs[1]} className={`nav-text bold ${clicked === 1 ? "show" : ""}`} onClick={(e) => e.stopPropagation()}>Wallet</span>}
            </div>

            {/* Transactions */}
            <div className="nav-item" onClick={() => handleClick(2)}>
                <button className={"nav-btn"}>
                    <Icon icon="icon-park-outline:transaction-order" className="icon" />
                </button>
                {clicked === 2 && <span ref={refs[2]} className={`nav-text bold ${clicked === 2 ? "show" : ""}`} onClick={(e) => e.stopPropagation()}>Transactions</span>}
            </div>

            {/* Analytics */}
            <div className="nav-item" onClick={() => handleClick(3)}>
                <button className={"nav-btn"}>
                    <Icon icon="grommet-icons:analytics" className="icon" />
                </button>
                {clicked === 3 && <span ref={refs[3]} className={`nav-text bold ${clicked === 3 ? "show" : ""}`}>Analytics</span>}
            </div>
        </div>
    );
};

export default NavigationBar;
