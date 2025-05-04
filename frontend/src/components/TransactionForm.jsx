import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import api from '../api';
import ModalHeader from './ModalHeader';
import ModalFooter from './ModalFooter';
import ConfirmAlert from './ConfirmAlert';
import InputField from './InputField';
import CustomDropdown from './Dropdown';
import CustomDatepicker from './DatePicker';

function TransactionForm({ wallets, categories, onTransactionAdded, onCancel, initialData = null }) {
    const [transactionTitle, setTransactionTitle] = useState("");
    const [transactionAmount, setTransactionAmount] = useState("");
    const [transactionType, setTransactionType] = useState("expense");
    const [transactionDate, setTransactionDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [transactionNotes, setTransactionNotes] = useState("");
    const [transactionCategoryId, setTransactionCategoryId] = useState("");
    const [transactionWalletId, setTransactionWalletId] = useState(wallets[0]?.id || "");
    const [showConfirm, setShowConfirm] = useState(false);
    const [showUnsavedAlert, setShowUnsavedAlert] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [walletList, setWalletList] = useState(wallets);
    const [categoryList, setCategoryList] = useState(categories);

    const { fetchBalanceSummary, fetchWallets, fetchTransactions } = useContext(UserContext);

    useEffect(() => {
        if (initialData) {
            console.log('Initial Transaction Data:', initialData);
            
            // Set basic transaction data
            setTransactionTitle(initialData.title || "");
            setTransactionAmount(initialData.amount || "");
            setTransactionType(initialData.transaction_type || "expense");
            setTransactionDate(initialData.date || new Date().toISOString().split('T')[0]);
            setTransactionNotes(initialData.notes || "");

            // Set wallet and category IDs
            if (initialData.wallet) {
                console.log('Setting Wallet:', initialData.wallet);
                setTransactionWalletId(initialData.wallet.id);
            }

            // Only set category if it's an expense and has a category
            if (initialData.transaction_type === "expense" && initialData.category) {
                console.log('Setting Category:', initialData.category);
                setTransactionCategoryId(initialData.category.id);
            }

            setIsDirty(false);
        }
    }, [initialData]);

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

    // Fetch wallets and categories on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [walletRes, categoryRes] = await Promise.all([
                    api.get('/api/wallets/'),
                    api.get('/api/categories/'),
                ]);

                setWalletList(walletRes.data);
                setCategoryList(categoryRes.data);

                // Only set default wallet if this is a new transaction
                if (!initialData) {
                    setTransactionWalletId(walletRes.data[0]?.id || "");
                }
            } catch (error) {
                console.error("Error fetching wallets or categories:", error);
                alert("Failed to fetch wallet or category data.");
            }
        };

        fetchData();
    }, [initialData]);

    const markDirty = () => setIsDirty(true);

    const handleSubmit = async () => {
        if (new Date(transactionDate) > new Date()) {
            alert("Date cannot be in the future.");
            return;
        }

        try {
            const url = initialData?.id
                ? `/api/transactions/${initialData.id}/`
                : `/api/transactions/`;

            const method = initialData?.id ? api.put : api.post;

            const response = await method(url, {
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
            fetchBalanceSummary(); // Fetch updated balance summary
            fetchWallets();
            fetchTransactions(); // Fetch updated transactions
            setShowConfirm(false);
        } catch (error) {
            console.error("Error submitting transaction:", error);
            alert("Failed to submit transaction. Please try again.");
        }
    };

    const handleDelete = async () => {
        if (!initialData?.id) return;
        try {
            await api.delete(`/api/transactions/${initialData.id}/`);
            onTransactionAdded(null); // treat as deleted
            fetchTransactions(); // Fetch updated transactions
        } catch (error) {
            console.error("Error deleting transaction:", error);
            alert("Failed to delete transaction. Please try again.");
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
        <div className="modal-content">
            <ModalHeader title={initialData ? "Edit Transaction" : "New Transaction"} onClose={handleCancel} />
            <form onSubmit={handlePreSubmit}>
            <div className="toggle-buttons">
                <button
                    type="button"
                    className={`text-button ${transactionType === 'income' ? 'active' : ''}`}
                    onClick={() => { setTransactionType('income'); markDirty(); }}
                >
                    <p>Income</p>
                </button>
                <button
                    type="button"
                    className={`text-button ${transactionType === 'expense' ? 'active' : ''}`}
                    onClick={() => { setTransactionType('expense'); markDirty(); }}
                >
                    <p>Expense</p>
                </button>
            </div>

            <p>Title*</p>
            <InputField
                type="text"
                placeholder="Add Title"
                value={transactionTitle}
                onChange={(e) => { setTransactionTitle(e.target.value); markDirty(); }}
                required
                className="form-group"
                variant="small"
            />

            <p>Amount*</p>
            <InputField
                placeholder="000,000"
                type="number"
                value={transactionAmount}
                onChange={(e) => { setTransactionAmount(e.target.value); markDirty(); }}
                required
                className="form-group"
                variant="small"
            />

            <div className="form-group">
                <p>Wallet*</p>
                <CustomDropdown
                    options={walletList.map(wallet => ({
                        label: wallet.name,
                        value: wallet.id
                    }))}
                    selectedValue={transactionWalletId}
                    onSelect={(value) => {
                        console.log('Selected Wallet:', value);
                        setTransactionWalletId(value);
                        markDirty();
                    }}
                    placeholder="Select Wallet"
                    defaultValue={walletList.find(w => w.id === transactionWalletId)?.name || "Select Wallet"}
                />
            </div>

            {transactionType === "expense" && (
                <div className="form-group">
                    <p>Category *</p>
                    <CustomDropdown
                        options={categoryList.map(cat => ({
                            label: cat.name,
                            value: cat.id
                        }))}
                        selectedValue={transactionCategoryId}
                        onSelect={(value) => {
                            console.log('Selected Category:', value);
                            setTransactionCategoryId(value);
                            markDirty();
                        }}
                        placeholder="Select Category"
                        value={categoryList.find(c => c.id === transactionCategoryId)?.name}
                    />
                </div>
            )}

            <div className="form-group">
                <p>Date</p>
                <CustomDatepicker
                    selectedDate={transactionDate}
                    onChange={(date) => {
                        if (date instanceof Date && !isNaN(date)) {
                            setTransactionDate(date.toISOString().split("T")[0]);
                            markDirty();
                        }
                    }}
                />
            </div>

            <div className="form-group">
                <p>Notes</p>
                <InputField
                    type="text"
                    value={transactionNotes}
                    onChange={(e) => { setTransactionNotes(e.target.value); markDirty(); }}
                    placeholder="Add a note"
                    className="form-group"
                    variant="small"
                />
            </div>

            </form>
            <ModalFooter
                onAction={handlePreSubmit}
                onDelete={() => initialData ? setShowDeleteAlert(true) : handleCancel()}
                actionTitle={initialData ? "Update" : "Add"}
            />
            <ConfirmAlert
                isOpen={showConfirm}
                title={initialData ? "Confirm Update" : "Confirm Transaction"}
                mainActionTitle={initialData ? "Update" : "Add"}
                secondActionTitle="Cancel"
                onMainAction={handleSubmit}
                onSecondAction={() => setShowConfirm(false)}
            >
                {initialData
                    ? "Are you sure you want to update this transaction?"
                    : "Are you sure you want to add this transaction?"}
            </ConfirmAlert>
            <ConfirmAlert
                isOpen={showDeleteAlert}
                title="Delete Transaction"
                mainActionTitle="Delete"
                secondActionTitle="Cancel"
                onMainAction={handleDelete}
                onSecondAction={() => setShowDeleteAlert(false)}
            >
                Are you sure you want to delete this transaction?
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
        </div>
    );
}

export default TransactionForm;
