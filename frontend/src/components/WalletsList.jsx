import React, { useEffect, useContext, useState } from 'react';
import '../styles/WalletsList.css';
import WalletCard from './WalletCard';
import AddWalletButton from './AddWalletButton';
import Modal from './Modal';
import WalletForm from './WalletForm';
import { UserContext } from '../contexts/UserContext';

function WalletsList({ limit }) {
  const { wallets, fetchWallets, walletsLoading, walletsError } = useContext(UserContext); // Access wallets from context
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);

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

  const handleWalletUpdated = () => {
    fetchWallets(); // Refresh wallets after adding, updating, or deleting
    handleCloseModal();
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  // if (walletsLoading) return <p>Loading wallets...</p>;
  // if (walletsError) return <p>{walletsError}</p>;

  const walletsToDisplay = limit ? wallets.slice(0, limit) : wallets;

  return (
    <section className={`wallets-grid ${limit ? 'wallets-grid-limit' : ''}`}>
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
      {!limit && <AddWalletButton onClick={handleAddWallet} />} {/* Hide button if limit is specified */}
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