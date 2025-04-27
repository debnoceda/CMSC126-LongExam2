import { useState, useEffect } from "react";
import api from "../api";
import WalletForm from "../components/WalletForm";
import TransactionForm from "../components/TransactionForm";
import "../styles/Home.css";

function Home() {
    const [wallets, setWallets] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedWalletId, setSelectedWalletId] = useState(null);
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
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("Failed to fetch data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleWalletAdded = (newWallet) => {
        setWallets([...wallets, newWallet]);
        setShowWalletForm(false);
    };

    const handleTransactionAdded = (newTransaction) => {
        setTransactions([newTransaction, ...transactions]);
        updateWalletBalance(newTransaction);
        setShowTransactionForm(false);
    };

    const updateWalletBalance = (transaction) => {
        const updatedWallets = wallets.map(wallet => {
            if (wallet.id === transaction.wallet.id) {
                const amountChange = transaction.amount * (transaction.transaction_type === 'income' ? 1 : -1);
                return { ...wallet, balance: wallet.balance + amountChange };
            }
            return wallet;
        });
        setWallets(updatedWallets);
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

    if (loading) return <div className="loading">Loading...</div>;

    return (
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
                    <WalletForm 
                        onWalletAdded={handleWalletAdded}
                        onCancel={() => setShowWalletForm(false)}
                    />
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
                    <TransactionForm 
                        wallets={wallets}
                        categories={categories}
                        onTransactionAdded={handleTransactionAdded}
                        onCancel={() => setShowTransactionForm(false)}
                    />
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
    );
}

export default Home;