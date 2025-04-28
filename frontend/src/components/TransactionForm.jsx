import { useState } from 'react';
import api from '../api';

function TransactionForm({ wallets, categories, onTransactionAdded, onCancel }) {
    const [transactionTitle, setTransactionTitle] = useState("");
    const [transactionAmount, setTransactionAmount] = useState("");
    const [transactionType, setTransactionType] = useState("expense");
    const [transactionDate, setTransactionDate] = useState(() => {
        const today = new Date().toISOString().split('T')[0];
        return today;
    });
    const [transactionNotes, setTransactionNotes] = useState("");
    const [transactionCategoryId, setTransactionCategoryId] = useState("");
    const [transactionWalletId, setTransactionWalletId] = useState(wallets[0]?.id || "");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const today = new Date();
        const inputDate = new Date(transactionDate);

        if (inputDate > today) {
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
        } catch (error) {
            console.error("Error adding transaction:", error);
            alert("Failed to add transaction. Please try again.");
        }
    };

    const resetForm = () => {
        const today = new Date().toISOString().split('T')[0];
        setTransactionTitle("");
        setTransactionAmount("");
        setTransactionType("expense");
        setTransactionDate(today);
        setTransactionNotes("");
        setTransactionCategoryId("");
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <input
                type="text"
                placeholder="Title"
                value={transactionTitle}
                onChange={(e) => setTransactionTitle(e.target.value)}
                required
                className="form-input"
            />
            <input
                type="number"
                step="0.01"
                placeholder="Amount"
                value={transactionAmount}
                onChange={(e) => setTransactionAmount(e.target.value)}
                required
                className="form-input"
            />
            <select
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
                required
                className="form-input"
            >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
            </select>

            <input
                type="date"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
                required
                className="form-input"
                max={new Date().toISOString().split('T')[0]} // disables future dates in calendar picker
            />

            <select
                value={transactionWalletId}
                onChange={(e) => setTransactionWalletId(e.target.value)}
                required
                className="form-input"
            >
                <option value="">Select Wallet</option>
                {wallets.map(wallet => (
                    <option key={wallet.id} value={wallet.id}>{wallet.name}</option>
                ))}
            </select>

            {transactionType === "expense" && (
                <select
                    value={transactionCategoryId}
                    onChange={(e) => setTransactionCategoryId(e.target.value)}
                    required
                    className="form-input"
                >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            )}

            <textarea
                placeholder="Notes (Optional)"
                value={transactionNotes}
                onChange={(e) => setTransactionNotes(e.target.value)}
                className="form-input"
            />
            <button type="submit" className="form-button">Add Transaction</button>
            <button type="button" className="form-button cancel" onClick={onCancel}>Cancel</button>
        </form>
    );
}

export default TransactionForm;
