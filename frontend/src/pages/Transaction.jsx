import React, { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import TransactionForm from "../components/TransactionForm";
import Modal from "../components/Modal";
import Header from "../components/Header";
import Table from "../components/Table";
import Button from "../components/Button";
import "../styles/Transaction.css";
import api from "../api";

function Transaction() {
    const { transactions, fetchTransactions, wallets, categories } = useContext(UserContext); // Access transactions, fetchTransactions, wallets, and categories from context
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const handleAddClick = () => {
        setSelectedTransaction(null);
        setIsModalOpen(true);
    };

    const handleViewDetails = async (transactionId) => {
        try {
            const response = await api.get(`/api/transactions/${transactionId}/`);
            setSelectedTransaction(response.data);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Failed to fetch transaction:", error);
            alert("Could not fetch transaction details.");
        }
    };

    const handleTransactionAdded = (newOrUpdatedTransaction) => {
        setIsModalOpen(false);
        setSelectedTransaction(null);
        fetchTransactions();
    };

    const exportToCSV = () => {
        if (!transactions.length) return alert("No transactions to export.");

        const headers = ["Title", "Date", "Category", "Wallet", "Amount", "Type"];
        const rows = transactions.map(({ title, date, category, wallet, amount, transaction_type }) => [title, date, category?.name || "", wallet?.name || "", amount, transaction_type]);

        const csv = [headers, ...rows].map((row) => row.map((val) => `"${val}"`).join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = Object.assign(document.createElement("a"), {
            href: url,
            download: "transactions.csv",
        });
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    return (
        <>
            <Header onAddTransaction={handleAddClick} />     {" "}
            <div className="transaction-wrapper">
                <div className="container">
                    <h2 className="transaction-header">Transactions</h2>
                    <Table transactions={transactions} onViewDetails={handleViewDetails} />         {" "}
                    <div className="export-button-wrapper">
                        <Button type="small" text="Export CSV" onClick={exportToCSV} />         {" "}
                    </div>
                    <Modal
                        isOpen={isModalOpen}
                        onClose={() => {
                            setIsModalOpen(false);
                            setSelectedTransaction(null);
                        }}
                    >
                        <TransactionForm
                            initialData={selectedTransaction}
                            wallets={transactions.map((t) => t.wallet).filter((w, i, self) => w && self.findIndex((t) => t?.id === w?.id) === i)}
                            categories={transactions.map((t) => t.category).filter((c, i, self) => c && self.findIndex((t) => t?.id === c?.id) === i)}
                            onTransactionAdded={handleTransactionAdded}
                            onCancel={() => {
                                setIsModalOpen(false);
                                setSelectedTransaction(null);
                            }}
                        />
                    </Modal>
                </div>
            </div>
        </>
    );
}

export default Transaction;
