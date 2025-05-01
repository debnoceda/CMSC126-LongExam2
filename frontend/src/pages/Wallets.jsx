import React, { useState, useEffect } from 'react';
import WalletCard from '../components/WalletCard';
import WalletsList from '../components/WalletsList';
import Header from '../components/Header';
import BalanceSummary from '../components/BalanceSummary';

function Wallets() {

  return (
    <div className="wallets-container">
      <Header />
      <BalanceSummary />
      <h2>Wallets</h2>
      <WalletsList />
    </div>
  );
}

export default Wallets;