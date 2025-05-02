import React, { useState } from "react";
import "../styles/Header.css";
import { Icon } from "@iconify/react";
import { useLocation, useNavigate } from "react-router-dom";
import NavigationBar from "./NavigationBar";
import Modal from "./Modal";
import TransactionForm from "./TransactionForm";

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isHome = location.pathname === "/home";

    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const wallets = [{ id: 1, name: "Default Wallet" }];
    const categories = [{ id: 1, name: "Food" }, { id: 2, name: "Transport" }];

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
                    <button
                        className="header-btn addtransaction"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <Icon icon="typcn:plus" className="icon" style={{ fontSize: "7rem" }} />
                    </button>
                    <button
                        className="header-btn profile"
                        onClick={() => navigate("/profile")}
                        style={{
                            backgroundImage: userProfileImageUrl ? `url(${userProfileImageUrl})` : "none",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat"
                        }}
                    ></button>
                </nav>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <TransactionForm
                    wallets={wallets}
                    categories={categories}
                    onTransactionAdded={() => setIsModalOpen(false)}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </header>
    );
};

export default Header;
