import React, { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import Card from '../components/Card';
import '../styles/BalanceSummary.css'; // Import your CSS file for styling
import FroggyImage from '../assets/Froggy.png';

function BalanceSummary() {
  const { balanceSummary } = useContext(UserContext); // Access balanceSummary from context

  // Formatter for Philippine Peso (PHP)
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);

  return (
    <Card className="bg-main-color white-color balance-summary">
      <div>
        <p>Balance</p>
        <h1 className="balance">{formatCurrency(balanceSummary.total_balance)}</h1>
      </div>
      <div className="stats">
        <div className="stats-item">
          <p>Expenses</p>
          <p className="bold">{formatCurrency(balanceSummary.total_expense)}</p>
        </div>
        <div className="stats-item">
          <p>Income</p>
          <p className="bold">{formatCurrency(balanceSummary.total_income)}</p>
        </div>
      </div>
      <img src={FroggyImage} className="overlay-image" alt="Froggy" />
    </Card>
  );
}

export default BalanceSummary;