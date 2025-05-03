import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import '../styles/BalanceSummary.css'; // Import your CSS file for styling
import FroggyImage from '../assets/Froggy.png';
import api from '../api'; // Import your API instance

function BalanceSummary() {
  const [balanceSummary, setBalanceSummary] = useState({
    total_balance: 0,
    total_income: 0,
    total_expense: 0,
  });

  useEffect(() => {
    const fetchBalanceSummary = async () => {
      try {
        const response = await api.get('/api/transactions/total_balance/');
        setBalanceSummary(response.data);
      } catch (err) {
        console.error('Failed to fetch balance summary:', err);
        setError('Failed to load balance summary.');
      } finally {
      }
    };

    fetchBalanceSummary();
  }, []);

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