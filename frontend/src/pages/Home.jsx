import { useState, useEffect } from "react";
import api from "../api";
import "../styles/Home.css";

function Home() {
    const [wallets, setWallets] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedWalletId, setSelectedWalletId] = useState(null);
    
    // New wallet form state
    const [newWalletName, setNewWalletName] = useState("");
    const [newWalletBalance, setNewWalletBalance] = useState("");
    
    // New transaction form state
    const [transactionTitle, setTransactionTitle] = useState("");
    const [transactionAmount, setTransactionAmount] = useState("");
    const [transactionType, setTransactionType] = useState("expense");
    const [transactionNotes, setTransactionNotes] = useState("");
    const [transactionCategoryId, setTransactionCategoryId] = useState("");
    const [transactionWalletId, setTransactionWalletId] = useState("");
    
    // Toggle for showing forms
    const [showWalletForm, setShowWalletForm] = useState(false);
    const [showTransactionForm, setShowTransactionForm] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [walletsRes, categoriesRes, transactionsRes] = await Promise.all([
                api.get("/api/wallets/"),
                api.get("/api/categories/"),
                api.get("/api/transactions/")
            ]);
            
            setWallets(walletsRes.data);
            setCategories(categoriesRes.data);
            setTransactions(transactionsRes.data);
            
            if (walletsRes.data.length > 0 && !selectedWalletId) {
                setSelectedWalletId(walletsRes.data[0].id);
                setTransactionWalletId(walletsRes.data[0].id);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("Failed to fetch data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddWallet = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/api/wallets/", {
                name: newWalletName,
                balance: parseFloat(newWalletBalance) || 0
            });
            
            setWallets([...wallets, response.data]);
            setNewWalletName("");
            setNewWalletBalance("");
            setShowWalletForm(false);
        } catch (error) {
            console.error("Error adding wallet:", error);
            alert("Failed to add wallet. Please try again.");
        }
    };

    const handleAddTransaction = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/api/transactions/", {
                title: transactionTitle,
                amount: parseFloat(transactionAmount),
                transaction_type: transactionType,
                notes: transactionNotes,
                wallet_id: parseInt(transactionWalletId),
                category_id: parseInt(transactionCategoryId)
            });
            
            setTransactions([response.data, ...transactions]);
            
            // Update wallet balance
            const updatedWallets = wallets.map(wallet => {
                if (wallet.id === parseInt(transactionWalletId)) {
                    const amountChange = parseFloat(transactionAmount) * (transactionType === 'income' ? 1 : -1);
                    return {
                        ...wallet,
                        balance: parseFloat(wallet.balance) + amountChange
                    };
                }
                return wallet;
            });
            setWallets(updatedWallets);

            // Reset form
            setTransactionTitle("");
            setTransactionAmount("");
            setTransactionNotes("");
            setShowTransactionForm(false);
        } catch (error) {
            console.error("Error adding transaction:", error);
            alert("Failed to add transaction. Please try again.");
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    if (loading) {
        return (
            <div>
                <div className="loading">Loading...</div>
            </div>
        );
    }

    return (
        <div>
            <div className="home-container">
                <div className="wallets-section">
                    <div className="section-header">
                        <h2>My Wallets</h2>
                        <button 
                            className="add-button"
                            onClick={() => setShowWalletForm(!showWalletForm)}
                        >
                            {showWalletForm ? "Cancel" : "Add Wallet"}
                        </button>
                    </div>

                    {showWalletForm && (
                        <form onSubmit={handleAddWallet} className="form-container">
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
                            <button type="submit" className="form-button">
                                Create Wallet
                            </button>
                        </form>
                    )}

                    <div className="wallets-list">
                        {wallets.length === 0 ? (
                            <p>No wallets yet. Create one to get started!</p>
                        ) : (
                            wallets.map(wallet => (
                                <div 
                                    key={wallet.id} 
                                    className={`wallet-card ${selectedWalletId === wallet.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedWalletId(wallet.id)}
                                >
                                    <h3>{wallet.name}</h3>
                                    <p className={wallet.balance < 0 ? 'negative' : 'positive'}>
                                        {formatCurrency(wallet.balance)}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="transactions-section">
                    <div className="section-header">
                        <h2>Transactions</h2>
                        <button 
                            className="add-button"
                            onClick={() => setShowTransactionForm(!showTransactionForm)}
                        >
                            {showTransactionForm ? "Cancel" : "Add Transaction"}
                        </button>
                    </div>

                    {showTransactionForm && (
                        <form onSubmit={handleAddTransaction} className="form-container">
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
                            <select
                                value={transactionWalletId}
                                onChange={(e) => setTransactionWalletId(e.target.value)}
                                required
                                className="form-input"
                            >
                                <option value="">Select Wallet</option>
                                {wallets.map(wallet => (
                                    <option key={wallet.id} value={wallet.id}>
                                        {wallet.name}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={transactionCategoryId}
                                onChange={(e) => setTransactionCategoryId(e.target.value)}
                                className="form-input"
                            >
                                <option value="">Select Category (Optional)</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            <textarea
                                placeholder="Notes (Optional)"
                                value={transactionNotes}
                                onChange={(e) => setTransactionNotes(e.target.value)}
                                className="form-input"
                            />
                            <button type="submit" className="form-button">
                                Add Transaction
                            </button>
                        </form>
                    )}

                    <div className="transactions-list">
                        {transactions.length === 0 ? (
                            <p>No transactions yet.</p>
                        ) : (
                            transactions
                                .filter(transaction => !selectedWalletId || transaction.wallet.id === selectedWalletId)
                                .map(transaction => (
                                    <div key={transaction.id} className="transaction-card">
                                        <div className="transaction-header">
                                            <h4>{transaction.title}</h4>
                                            <p className={transaction.transaction_type === 'expense' ? 'negative' : 'positive'}>
                                                {transaction.transaction_type === 'expense' ? '-' : '+'}{formatCurrency(transaction.amount)}
                                            </p>
                                        </div>
                                        <div className="transaction-details">
                                            <p>Date: {formatDate(transaction.date)}</p>
                                            <p>Wallet: {transaction.wallet.name}</p>
                                            {transaction.category && <p>Category: {transaction.category.name}</p>}
                                            {transaction.notes && <p>Notes: {transaction.notes}</p>}
                                        </div>
                                    </div>
                                ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;