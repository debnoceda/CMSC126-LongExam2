import React, { useState, useEffect } from 'react';
import TransactionForm from '../components/TransactionForm';
import Modal from '../components/Modal';
import Header from '../components/Header';
import Table from '../components/Table';
import Button from '../components/Button';
import api from '../api';
import '../styles/Transaction.css';

function Transaction() {
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/api/transactions/');
        setTransactions(response.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };
    fetchData();
  }, []);

  const handleTransactionAdded = (newTransaction) => {
    setTransactions(prev => [newTransaction, ...prev]);
    setIsModalOpen(false);
  };

  const exportToCSV = () => {
    if (!transactions.length) return alert("No transactions to export.");

    const headers = ["Title", "Date", "Category", "Wallet", "Amount", "Type"];
    const rows = transactions.map(({ title, date, category, wallet, amount, transaction_type }) => (
      [title, date, category?.name || "", wallet?.name || "", amount, transaction_type]
    ));

    const csv = [headers, ...rows].map(row => row.map(val => `"${val}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = Object.assign(document.createElement("a"), {
      href: url,
      download: "transactions.csv"
    });
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <>
      <Header onAddTransaction={() => setIsModalOpen(true)} />
      <div className="transaction-wrapper">
        <div className="container">
          <h2 className="transaction-header">Transactions</h2>

          <Table transactions={transactions} onViewDetails={() => setIsModalOpen(true)} />

          <div className="export-button-wrapper">
            <Button
              type="small"
              text="Export CSV"
              onClick={exportToCSV}
            />
          </div>

          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <TransactionForm
              wallets={transactions.map(t => t.wallet).filter((w, i, self) =>
                w && self.findIndex(t => t.id === w.id) === i
              )}
              categories={transactions.map(t => t.category).filter((c, i, self) =>
                c && self.findIndex(t => t.id === c.id) === i
              )}
              onTransactionAdded={handleTransactionAdded}
              onCancel={() => setIsModalOpen(false)}
            />
          </Modal>
        </div>
      </div>
    </>
  );
}

export default Transaction;
