import { useState } from 'react';
import api from '../api';
import InputField from './InputField';
import ModalHeader from './ModalHeader';
import ModalFooter from './ModalFooter';
import WalletCard from './WalletCard';
import ConfirmAlert from './ConfirmAlert';

function WalletForm({ wallet, onClose, onWalletUpdated }) {
    const [newWalletName, setNewWalletName] = useState(wallet?.name || "");
    const [newWalletBalance, setNewWalletBalance] = useState(wallet?.balance || "");
    const [newWalletColor, setNewWalletColor] = useState(wallet?.color || "#FFFFFF"); // Add state for color
    const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [isUnsavedConfirmOpen, setUnsavedConfirmOpen] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (wallet) {
                // Update existing wallet
                const response = await api.put(`/api/wallets/${wallet.id}/`, {
                    name: newWalletName,
                    balance: parseFloat(newWalletBalance) || 0,
                    color: newWalletColor, // Include color in the update
                });
                alert("Wallet updated successfully!");
                onWalletUpdated(response.data);
            } else {
                // Add new wallet
                const response = await api.post("/api/wallets/", {
                    name: newWalletName,
                    balance: parseFloat(newWalletBalance) || 0,
                    color: newWalletColor, // Include color in the creation
                });
                alert("Wallet added successfully!");
                onWalletUpdated(response.data);
            }
            setNewWalletName("");
            setNewWalletBalance("");
            setNewWalletColor("#FFFFFF"); // Reset color
            onClose();
        } catch (error) {
            console.error("Error saving wallet:", error);
            alert("Failed to save wallet. Please try again.");
        }
    };

    const handleDelete = async () => {
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
        const hasChanges =
            newWalletName !== wallet?.name ||
            newWalletBalance !== wallet?.balance ||
            newWalletColor !== wallet?.color;
        if (hasChanges) {
            setUnsavedConfirmOpen(true); // Open unsaved changes confirmation
        } else {
            onClose();
        }
    };

    return (
        <div className="modal-content">
            <ModalHeader title={wallet ? "Edit Wallet" : "Add Wallet"} onClose={handleClose} />
            <section className="wallet-card-container">
                <WalletCard
                    walletName={newWalletName}
                    balance={newWalletBalance}
                    cardColor={newWalletColor} // Use the selected color
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
                onDelete={wallet ? () => setDeleteConfirmOpen(true) : onClose}
                onAction={handleSubmit}
                actionTitle={wallet ? "Update" : "Add"}
            />
            {/* ConfirmAlert for delete confirmation */}
            <ConfirmAlert
                isOpen={isDeleteConfirmOpen}
                title="Confirm Delete"
                mainActionTitle="Delete"
                secondActionTitle="Cancel"
                onMainAction={() => {
                    setDeleteConfirmOpen(false);
                    handleDelete();
                }}
                onSecondAction={() => setDeleteConfirmOpen(false)}
            >
                Are you sure you want to delete the wallet "{wallet?.name}"?
            </ConfirmAlert>
            {/* ConfirmAlert for unsaved changes */}
            <ConfirmAlert
                isOpen={isUnsavedConfirmOpen}
                title="Unsaved Changes"
                mainActionTitle="Discard"
                secondActionTitle="Cancel"
                onMainAction={() => {
                    setUnsavedConfirmOpen(false);
                    onClose();
                }}
                onSecondAction={() => setUnsavedConfirmOpen(false)}
            >
                You have unsaved changes. Are you sure you want to close?
            </ConfirmAlert>
        </div>
    );
}

export default WalletForm;