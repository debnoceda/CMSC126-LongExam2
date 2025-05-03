import React from "react";
import "../styles/WalletCard.css";
import simImage from "../assets/sim.png";

function WalletCard({ walletName, balance, size = "large", cardColor = "#84AE26", onClick }) {
    return (
        <button
            className={`card wallet-card shadow ${size === "small" ? "wallet-card-small" : "wallet-card-large"}`}
            style={{ backgroundColor: cardColor }}
            onClick={onClick}
            disabled={size === "large"}
        >
            <div className="wallet-details">
                <h1 className="wallet-balance white-color">{balance}</h1>
                <p className="wallet-name white-color">{walletName}</p>
            </div>
            <img src={simImage} alt="SIM" className="sim-image" />
        </button>
    );
}

export default WalletCard;
