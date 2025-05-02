import { useState, useEffect } from 'react';
import api from '../api';
import ModalHeader from './ModalHeader';
import ModalFooter from './ModalFooter';
import ConfirmAlert from './ConfirmAlert';

function TransactionForm({ wallets, categories, onTransactionAdded, onCancel }) {
    const [transactionTitle, setTransactionTitle] = useState("");
    const [transactionAmount, setTransactionAmount] = useState("");
    const [transactionType, setTransactionType] = useState("expense");
    const [transactionDate, setTransactionDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [transactionNotes, setTransactionNotes] = useState("");
    const [transactionCategoryId, setTransactionCategoryId] = useState("");
    const [transactionWalletId, setTransactionWalletId] = useState(wallets[0]?.id || "");
    const [showConfirm, setShowConfirm] = useState(false);
    const [showUnsavedAlert, setShowUnsavedAlert] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        const beforeUnloadHandler = (e) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', beforeUnloadHandler);
        return () => window.removeEventListener('beforeunload', beforeUnloadHandler);
    }, [isDirty]);

    const markDirty = () => setIsDirty(true);

    const handleSubmit = async () => {
        if (new Date(transactionDate) > new Date()) {
            alert("Date cannot be in the future.");
            return;
        }

        try {
            const response = await api.post("/api/transactions/", {
                title: transactionTitle,
                amount: parseFloat(transactionAmount),
                transaction_type: transactionType,
                date: transactionDate,
                notes: transactionNotes,
                wallet_id: parseInt(transactionWalletId),
                category_id: parseInt(transactionCategoryId) || null
            });

            onTransactionAdded(response.data);
            resetForm();
            setShowConfirm(false);
        } catch (error) {
            console.error("Error adding transaction:", error);
            alert("Failed to add transaction. Please try again.");
        }
    };

    const resetForm = () => {
        setTransactionTitle("");
        setTransactionAmount("");
        setTransactionType("expense");
        setTransactionDate(new Date().toISOString().split('T')[0]);
        setTransactionNotes("");
        setTransactionCategoryId("");
        setIsDirty(false);
    };

    const handlePreSubmit = (e) => {
        e.preventDefault();
        setShowConfirm(true);
    };

    const handleCancel = () => {
        if (isDirty) {
            setShowUnsavedAlert(true);
        } else {
            onCancel();
        }
    };

    return (
        <>
            <ModalHeader title="Transaction" onClose={handleCancel} />
            <form onSubmit={handlePreSubmit} className="form-container">
                <input type="text" placeholder="Title" value={transactionTitle} onChange={(e) => { setTransactionTitle(e.target.value); markDirty(); }} required className="form-input" />
                <input type="number" step="0.01" placeholder="Amount" value={transactionAmount} onChange={(e) => { setTransactionAmount(e.target.value); markDirty(); }} required className="form-input" />
                <select value={transactionType} onChange={(e) => { setTransactionType(e.target.value); markDirty(); }} required className="form-input">
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                </select>
                <input type="date" value={transactionDate} onChange={(e) => { setTransactionDate(e.target.value); markDirty(); }} required className="form-input" max={new Date().toISOString().split('T')[0]} />
                <select value={transactionWalletId} onChange={(e) => { setTransactionWalletId(e.target.value); markDirty(); }} required className="form-input">
                    <option value="">Select Wallet</option>
                    {wallets.map(wallet => (
                        <option key={wallet.id} value={wallet.id}>{wallet.name}</option>
                    ))}
                </select>
                {transactionType === "expense" && (
                    <select value={transactionCategoryId} onChange={(e) => { setTransactionCategoryId(e.target.value); markDirty(); }} required className="form-input">
                        <option value="">Select Category</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                )}
                <textarea placeholder="Notes (Optional)" value={transactionNotes} onChange={(e) => { setTransactionNotes(e.target.value); markDirty(); }} className="form-input" />
            </form>
            <ModalFooter onAction={handlePreSubmit} onDelete={handleCancel} actionTitle="Add Transaction" />
            <ConfirmAlert
                isOpen={showConfirm}
                title="Confirm Transaction"
                mainActionTitle="Yes, Add"
                secondActionTitle="Cancel"
                onMainAction={handleSubmit}
                onSecondAction={() => setShowConfirm(false)}
            >
                Are you sure you want to add this transaction?
            </ConfirmAlert>
            <ConfirmAlert
                isOpen={showUnsavedAlert}
                title="Unsaved Changes"
                mainActionTitle="Discard"
                secondActionTitle="Keep Editing"
                onMainAction={onCancel}
                onSecondAction={() => setShowUnsavedAlert(false)}
            >
                You have unsaved changes. Are you sure you want to leave?
            </ConfirmAlert>
        </>
    );
}

export default TransactionForm;