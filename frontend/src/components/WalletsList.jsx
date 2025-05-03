import React, { useState, useEffect } from 'react';
import '../styles/WalletsList.css';
import WalletCard from './WalletCard';
import AddWalletButton from './AddWalletButton';
import Modal from './Modal';
import WalletForm from './WalletForm';
import api from '../api';

function WalletsList({ limit }) {
  const [wallets, setWallets] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch wallets from the backend
  const fetchWallets = async () => {
    try {
      const response = await api.get('/api/wallets/');
      setWallets(response.data);
    } catch (error) {
      console.error('Error fetching wallets:', error);
      setError('Failed to fetch wallets. Please try again.');
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  // Fetch wallets on component mount
  useEffect(() => {
    fetchWallets();
  }, []);

  const handleWalletClick = (wallet) => {
    setSelectedWallet(wallet);
    setModalOpen(true);
  };

  const handleAddWallet = () => {
    setSelectedWallet(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedWallet(null);
  };

  const handleWalletUpdated = (updatedWallet) => {
    if (!updatedWallet) {
      // Wallet was deleted
      setWallets(wallets.filter((wallet) => wallet.id !== selectedWallet.id));
    } else if (selectedWallet) {
      // Wallet was updated
      setWallets(wallets.map((wallet) => (wallet.id === updatedWallet.id ? updatedWallet : wallet)));
    } else {
      // New wallet was added
      setWallets([...wallets, updatedWallet]);
    }
    handleCloseModal(); // Close the modal after updating
  };

  if (loading) return <p>Loading wallets...</p>;
  if (error) return <p>{error}</p>;

  const walletsToDisplay = limit ? wallets.slice(0, limit) : wallets;

  return (
    <section className="wallets-grid">
      {walletsToDisplay.map((wallet) => (
        <WalletCard
          key={wallet.id}
          walletName={wallet.name}
          balance={wallet.balance}
          size={'small'}
          cardColor={wallet.color || '#84AE26'}
          onClick={() => handleWalletClick(wallet)}
        />
      ))}
      <AddWalletButton onClick={handleAddWallet} />
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={'Wallet'}>
        <WalletForm
          wallet={selectedWallet}
          onClose={handleCloseModal}
          onWalletUpdated={handleWalletUpdated}
        />
      </Modal>
    </section>
  );
}

export default WalletsList;