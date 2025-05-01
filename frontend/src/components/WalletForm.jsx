import { useState } from 'react';
import api from '../api';
import InputField from './InputField';
import ModalHeader from './ModalHeader';
import ModalFooter from './ModalFooter';
import WalletCard from './WalletCard';

function WalletForm({ wallet, onClose, onWalletUpdated }) {
    const [newWalletName, setNewWalletName] = useState(wallet?.name || "");
    const [newWalletBalance, setNewWalletBalance] = useState(wallet?.balance || "");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (wallet) {
                // Update existing wallet
                const response = await api.put(`/api/wallets/${wallet.id}/`, {
                    name: newWalletName,
                    balance: parseFloat(newWalletBalance) || 0,
                });
                alert("Wallet updated successfully!");
                onWalletUpdated(response.data);
            } else {
                // Add new wallet
                const response = await api.post("/api/wallets/", {
                    name: newWalletName,
                    balance: parseFloat(newWalletBalance) || 0,
                });
                alert("Wallet added successfully!");
                onWalletUpdated(response.data);
            }
            setNewWalletName("");
            setNewWalletBalance("");
            onClose();
        } catch (error) {
            console.error("Error saving wallet:", error);
            alert("Failed to save wallet. Please try again.");
        }
    };

    const handleDelete = async () => {
        if (!wallet) {
            onClose();
            return;
        }

        const confirmDelete = window.confirm(`Are you sure you want to delete the wallet "${wallet.name}"?`);
        if (!confirmDelete) return;

        try {
            await api.delete(`/api/wallets/${wallet.id}/`);
            alert("Wallet deleted successfully!");
            onWalletUpdated(null);
            onClose();
        } catch (error) {
            console.error("Error deleting wallet:", error);
            alert("Failed to delete wallet. Please try again.");
        }
    };

    const handleClose = () => {
        const hasChanges = newWalletName !== wallet?.name || newWalletBalance !== wallet?.balance;
        if (hasChanges) {
            const confirmClose = window.confirm("You have unsaved changes. Are you sure you want to close?");
            if (!confirmClose) return;
        }
        onClose();
    };

    return (
        <div className="modal-content">
            <ModalHeader title={wallet ? "Edit Wallet" : "Add Wallet"} onClose={handleClose} />
            <section className="wallet-card-container">
                <WalletCard
                    walletName={newWalletName}
                    balance={newWalletBalance}
                    cardColor={wallet?.cardColor || "var(--green)"}
                    size={"large"}
                />
            </section>
            <form onSubmit={handleSubmit}>
                <p>Name</p>
                <InputField
                    type="text"
                    placeholder="Wallet Name"
                    value={newWalletName}
                    onChange={(e) => setNewWalletName(e.target.value)}
                    required
                    className="form-input"
                    variant="small"
                />
                <p>Balance</p>
                <InputField
                    type="number"
                    step="0.01"
                    placeholder="Balance"
                    value={newWalletBalance}
                    onChange={(e) => setNewWalletBalance(e.target.value)}
                    className="form-input"
                    variant="small"
                />
            </form>
            <ModalFooter
                onDelete={wallet ? handleDelete : null} // Only show delete button if editing
                onAction={handleSubmit}
                actionTitle={wallet ? "Update" : "Add"}
            />
        </div>
    );
}

export default WalletForm;