import React, { useState, useEffect } from 'react';
import api from '../api';
import '../styles/SpendingSummaryCard.css';
import Card from './Card';

const ProgressBar = ({ budget }) => {
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlySpent, setMonthlySpent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncomeVsExpenses = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/transactions/income_vs_expenses/');

        const currentMonth = new Date().getMonth();

        const incomeForMonth = response.data.income[currentMonth] || 0;
        const expenseForMonth = response.data.expenses[currentMonth] || 0;

        setMonthlyIncome(incomeForMonth);
        setMonthlySpent(expenseForMonth);
      } catch (error) {
        console.error('Error fetching income vs expenses:', error);

        setMonthlyIncome(0);
        setMonthlySpent(0);
      } finally {
        setLoading(false);
      }
    };

    fetchIncomeVsExpenses();
  }, []);

  if (loading) {
    return (
      <Card title="Budget Progress" className="progress-card">
        <div className="loading-notice">Loading Budget...</div>
      </Card>
    );
  }

  if (budget <= 0) {
    return (
      <Card title="Budget Progress" className="progress-card">
        <h2 className="no-budget-notice">No Monthly Budget Set</h2>
      </Card>
    );
  }

  const percentage = Math.min((monthlySpent / budget) * 100, 100);
  const remaining = budget - monthlySpent;

  let barColor = 'var(--green)';
  let message = "Safe to Spend";
  let remainingColor = 'var(--green)';
  let cardBackgroundColor = 'rgba(0, 0, 0, 0)';
  if (percentage > 80) {
    barColor = 'var(--red)';
    message = "Budget limit exceeded.";
    remainingColor = 'var(--red)';
    cardBackgroundColor = 'rgba(205, 55, 56, 0.2)';
  } else if (percentage > 50) {
    barColor = 'var(--yellow)';
    message = "Left to spend. Warning: Near budget cap.";
    remainingColor = 'var(--yellow)';
    cardBackgroundColor = 'rgba(241, 178, 73, 0.2)';
  }
  else {
    message = "Safe to spend.";
  }

  return (
    <>
      <Card title="Budget Progress" className="progress-card" style={{ backgroundColor: cardBackgroundColor }}>
        <div className='expenses-summary'>
          <h1 className="progress-title" style={{ color: remainingColor }}>{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(remaining)}</h1>
          <p className="progress-message">{message}</p>
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${percentage}%`, backgroundColor: barColor }}
            >
            </div>
          </div>
          <div className='progress-bar-info'>
            <p>{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(monthlySpent)} spent</p>
            <p>Monthly limit: {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(budget)}</p>
          </div>
        </div>
        <div className='monthly-income'>
          <p>Monthly Income: {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(monthlyIncome)}</p>
        </div>
      </Card>
    </>
  );
};

export default ProgressBar;
