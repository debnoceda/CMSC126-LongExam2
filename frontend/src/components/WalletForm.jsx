import { useState } from 'react';
import api from '../api';

function WalletForm({ onWalletAdded, onCancel }) {
    const [newWalletName, setNewWalletName] = useState("");
    const [newWalletBalance, setNewWalletBalance] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/api/wallets/", {
                name: newWalletName,
                balance: parseFloat(newWalletBalance) || 0
            });
            
            onWalletAdded(response.data);
            setNewWalletName("");
            setNewWalletBalance("");
        } catch (error) {
            console.error("Error adding wallet:", error);
            alert("Failed to add wallet. Please try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <input
                type="text"
                placeholder="Wallet Name"
                value={newWalletName}
                onChange={(e) => setNewWalletName(e.target.value)}
                required
                className="form-input"
            />
            <input
                type="number"
                step="0.01"
                placeholder="Initial Balance"
                value={newWalletBalance}
                onChange={(e) => setNewWalletBalance(e.target.value)}
                className="form-input"
            />
            <button type="submit" className="form-button">Create Wallet</button>
            <button type="button" className="form-button cancel" onClick={onCancel}>Cancel</button>
        </form>
    );
}

export default WalletForm;