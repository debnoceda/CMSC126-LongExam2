import React from "react";
import "../styles/WalletCard.css";
import simImage from "../assets/sim.png";

function WalletCard({ walletName, balance, size = "large", cardColor = "#ffffff", onClick }) {
    return (
        <button
            className={`card wallet-card ${size === "small" ? "wallet-card-small" : ""}`}
            style={{ backgroundColor: cardColor }}
            onClick={onClick}
            disabled={size === "large"}
        >
            <div className="wallet-details">
                <h1 className="wallet-balance">{balance}</h1>
                <p className="wallet-name">{walletName}</p>
            </div>
            <img src={simImage} alt="SIM" className="sim-image" />
        </button>
    );
}

export default WalletCard;
