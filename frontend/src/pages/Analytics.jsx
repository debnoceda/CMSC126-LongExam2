import React, { useState, useEffect } from 'react';
import Header from "../components/Header";
import "../styles/Analytics.css";
import ExpensesSummaryChart from '../components/ExpensesSummaryChart';
import Dropdown from '../components/Dropdown';
import IncomeVsExpensesChart from '../components/IncomeVsExpensesChart';
import Button from '../components/Button';
import { useLocation, useNavigate } from "react-router-dom";

import Table from '../components/Table';
import Modal from '../components/Modal';
import TransactionForm from '../components/TransactionForm';
import api from '../api';

function Analytics() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleYearChange = (value) => setSelectedYear(value);
  const handleMonthChange = (value) => setSelectedMonth(value);

  const yearOptions = [2023, 2024, 2025];
  const monthOptions = [
    { label: 'Jan', value: 0 },
    { label: 'Feb', value: 1 },
    { label: 'Mar', value: 2 },
    { label: 'Apr', value: 3 },
    { label: 'May', value: 4 },
    { label: 'Jun', value: 5 },
    { label: 'Jul', value: 6 },
    { label: 'Aug', value: 7 },
    { label: 'Sep', value: 8 },
    { label: 'Oct', value: 9 },
    { label: 'Nov', value: 10 },
    { label: 'Dec', value: 11 }
  ];

  const selectedMonthObj = monthOptions.find(m => m.value === selectedMonth);

  const location = useLocation();
  const navigate = useNavigate();

  const monthlyFilteredTransactions = transactions.filter(tx => {
    if (!tx?.date) return false;
    const txDate = new Date(tx.date);
    return (
      txDate.getFullYear() === selectedYear &&
      txDate.getMonth() === selectedMonth
    );
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get('/api/transactions/');
        setTransactions(response.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };
    fetchTransactions();
  }, []);

  const handleViewDetails = async (id) => {
    try {
      const response = await api.get(`/api/transactions/${id}/`);
      setSelectedTransaction(response.data);
      setIsModalOpen(true);
    } catch (error) {
      alert("Could not fetch transaction details.");
    }
  };

  const handleTransactionAdded = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
    api.get('/api/transactions/').then(res => setTransactions(res.data));
  };

  return (
    <>
      <Header />
      <div className="analytics-container">
        <div className="card chart expenses-summary">
          <h2 className='expenses-summary-title'>Expenses Summary</h2>
          <div className='summary-date'>
            <Dropdown
              options={yearOptions}
              selected={selectedYear}
              onSelect={handleYearChange}
              placeholder={selectedYear.toString()}
            />
            <Dropdown
              options={monthOptions}
              selected={selectedMonthObj}
              onSelect={handleMonthChange}
              placeholder={selectedMonthObj?.label}
            />
          </div>
          {monthlyFilteredTransactions.length === 0 ? (
            <p className='no-data'>No data found</p>
          ) : (
            <ExpensesSummaryChart
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              transactions={monthlyFilteredTransactions}
            />
          )}
        </div>

        <div className="card chart income-vs-expenses">
          <h2 className='income-vs-expenses'>Income vs Expenses</h2>
          <IncomeVsExpensesChart />
        </div>

        <div className="card recent-transactions">
          <div className='recent-transactions-header'>
            <h2 className='recent-transactions-title'>Recent Transactions</h2>
            <Button
              type='small'
              text={'View All'}
              onClick={() => navigate('/transaction')}
            />
          </div>
          <Table
            transactions={
              [...transactions]
                .filter(tx => tx?.date)
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) //need iupdate ang datetime kay muequal sya if same date ;-;
                .slice(0, 5)
            }
            onViewDetails={handleViewDetails}
          />
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => {
        setIsModalOpen(false);
        setSelectedTransaction(null);
      }}>
        <TransactionForm
          initialData={selectedTransaction}
          wallets={transactions.map(t => t.wallet).filter((w, i, self) =>
            w && self.findIndex(t => t.id === w.id) === i
          )}
          categories={transactions.map(t => t.category).filter((c, i, self) =>
            c && self.findIndex(t => t.id === c.id) === i
          )}
          onTransactionAdded={handleTransactionAdded}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedTransaction(null);
          }}
        />
      </Modal>
    </>
  );
}

export default Analytics;
