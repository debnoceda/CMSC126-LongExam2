import React, { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import Card from '../components/Card';
import '../styles/BalanceSummary.css'; // Import your CSS file for styling
import FroggyImage from '../assets/Froggy.png';

function BalanceSummary() {
  const { balanceSummary } = useContext(UserContext); // Access balanceSummary from context

  return (
    <Card className="bg-main-color white-color balance-summary">
      <div>
        <p>Balance</p>
        <h1 className='balance'>${balanceSummary.total_balance.toFixed(2)}</h1>
      </div>
      <div className="stats">
        <div className="stats-item">
          <p>Expenses</p>
          <p className='bold'>${balanceSummary.total_expense.toFixed(2)}</p>
        </div>
        <div className="stats-item">
          <p>Income</p>
          <p className='bold'>${balanceSummary.total_income.toFixed(2)}</p>
        </div>
      </div>
      <img src={FroggyImage} className="overlay-image" alt="Froggy" />
    </Card>
  );
}

export default BalanceSummary;