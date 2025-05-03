import React, { useState } from 'react';
import api from '../api';
import TransactionForm from './TransactionForm';
import Modal from './Modal';

const TransactionList = ({ wallets, categories, transactions }) => {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleTransactionAdded = (updated) => {
    console.log('Transaction updated:', updated);
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  return (
    <>
      {transactions.map(tx => (
        <div key={tx.id}>
          <span>{tx.title}</span>
          <button onClick={() => handleViewDetails(tx.id)}>View Details</button>
        </div>
      ))}

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <TransactionForm
            initialData={selectedTransaction}
            wallets={wallets}
            categories={categories}
            onTransactionAdded={handleTransactionAdded}
            onCancel={() => {
              setIsModalOpen(false);
              setSelectedTransaction(null);
            }}
          />
        </Modal>
      )}
    </>
  );
};

export default TransactionList;
