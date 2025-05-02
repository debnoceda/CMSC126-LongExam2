import React from "react";
import { Icon } from "@iconify/react";
import "../styles/WalletCard.css";

function AddWalletButton({ onClick }) {
    return (
        <button className="card wallet-card-small add-card" onClick={onClick}>
            <Icon
                icon="typcn:plus"
                style={{
                    color: "rgb(0,0,0,0.2)",
                    fontSize: "7rem",
                }}
            />
        </button>
    );
}

export default AddWalletButton;