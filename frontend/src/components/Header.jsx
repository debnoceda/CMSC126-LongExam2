import React, { useState, useEffect, useRef  } from "react";
import "../styles/Header.css";
import { Icon } from "@iconify/react";
import { useLocation, useNavigate } from "react-router-dom";
import NavigationBar from "./NavigationBar";
import Modal from "./Modal";
import TransactionForm from "./TransactionForm";
import api from '../api';
import defaultProfile from '../assets/Progil.png';

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isHome = location.pathname === "/home";
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const today = new Date().toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
    });
    const greeting = "Good Day,";

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get('/api/users/');
                const data = response.data;
                if (Array.isArray(data) && data.length > 0) {
                    setUser(data[0]);
                } else if (!Array.isArray(data)) {
                    setUser(data);
                } else {
                    setError('No user data available');
                }
            } catch (error) {
                setError('Failed to load user information');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
          }
        };
    
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [dropdownRef]);

    const handleTitleClick = () => {
        if (!isHome) navigate("/home");
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
      };
    
      const handleLogout = () => {
        console.log('Logout clicked');
        navigate('/logout');
      };

    const wallets = [{ id: 1, name: "Default Wallet" }];
    const categories = [{ id: 1, name: "Food" }, { id: 2, name: "Transport" }];

    // if (loading) return <div>Loading...</div>;
    // if (error) return <div className="error">{error}</div>;

    return (
        <header className="header">
            <div className="header-content">
                {isHome ? (
                    <div className="home-header-text">
                        <p className="header-date">{today}</p>
                        <p className="header-greeting">{greeting}</p>
                        <h1 className="header-name">{user?.first_name || 'User'}</h1>
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
                    <div className="profile-dropdown-container" ref={dropdownRef}>
                    <button className="header-btn profile" onClick={toggleDropdown}>
                            <img
                                src={user?.profile_picture || defaultProfile}
                                alt="Profile"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = defaultProfile;
                                }}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: '50%'
                                }}
                            />
                        </button>
                        {isDropdownOpen && (
                            <div className="dropdown">
                                <button className="dropdown-button" onClick={() => navigate("/profile")}>
                                    <Icon icon="iconamoon:profile-fill" className="icon" />
                                    <p>See Profile</p>
                                </button>
                                <button className="dropdown-button" onClick={handleLogout}>
                                    <Icon icon="mdi:logout" className="icon" />
                                    <p>Logout</p>
                                </button>
                            </div>
                        )}
                    </div>
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
