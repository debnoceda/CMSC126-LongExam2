import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext"; // Import UserContext
import "../styles/Home.css";
import Header from "../components/Header";
import BalanceSummary from "../components/BalanceSummary";
import Card from "../components/Card";
import SpendingSummaryCard from "../components/SpendingSummaryCard";
import WalletsList from "../components/WalletsList";
import Button from "../components/Button";
import ExpensesSummaryChart from "../components/ExpensesSummaryChart";
import Dropdown from "../components/Dropdown";
import { useNavigate } from "react-router-dom";

function Home() {
  const {
    user,
    transactions,
    fetchUserData,
    fetchTransactions,
    fetchBalanceSummary,
    fetchWallets,
  } = useContext(UserContext);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const [recentTransactions, setRecentTransactions] = useState([]);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const navigate = useNavigate();

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

  const monthlyFilteredTransactions = transactions.filter(tx => {
    if (!tx?.date) return false;
    const txDate = new Date(tx.date);
    return (
      txDate.getFullYear() === selectedYear &&
      txDate.getMonth() === selectedMonth
    );
  });

  useEffect(() => {
    fetchUserData(); // Fetch user data from context
    fetchTransactions(); // Fetch transactions from context
    fetchBalanceSummary(); // Fetch balance summary
    fetchWallets(); // Fetch wallets
  }, []);

  useEffect(() => {
    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    setRecentTransactions(sortedTransactions.slice(0, 3));
  }, [transactions]);

  return (
    <div className="home-wrapper">
      <Header />
      <div className="home-container">
        <SpendingSummaryCard budget={user?.monthly_budget?.toFixed(2) || '0.00'} />
        <div className="home-balance-summary-wrapper">
          <BalanceSummary />
        </div>
        <Card title="Wallets" className="wallets-section">
          <div className="home-sections-header">
            <h2>Wallets</h2>
            <Button
              type="small"
              text={"View All"}
              onClick={() => navigate("/wallets")}
            />
          </div>
          <WalletsList limit={3} />
        </Card>
        <Card title="Expenses Summary" className="chart expenses-summary">
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
        </Card>
        <Card title="Recent Transactions" className="recent-transactions">
            <div className="home-sections-header">
                <h2>Recent Transactions</h2>
                <Button
                type="small"
                text={"View All"}
                onClick={() => navigate("/transaction")}
                />
            </div>
            {recentTransactions.length === 0 ? (
                <p>No recent transactions.</p>
            ) : (
                <ul className="recent-transactions-list">
                {recentTransactions.map(transaction => (
                    <li key={transaction.id} className="transaction-item">
                    <div className="transaction-details">
                        <div className="left-section">
                            <p className="transaction-category">{transaction.category?.name || (transaction.transaction_type === 'income' ? 'Income' : 'Others')}</p>
                            <p className="transaction-date">
                                {new Date(transaction.date).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="right-section">
                        <span
                            className={`transaction-amount ${transaction.transaction_type === 'expense' ? 'expense' : 'income'}`}
                        >
                            {typeof transaction.amount === 'string' ? `₱${parseFloat(transaction.amount).toFixed(2)}` : `$${transaction.amount.toFixed(2)}`}
                        </span>
                        <span className="transaction-wallet">
                            {transaction.wallet?.name || 'Unknown'}
                        </span>
                        </div>
                    </div>
                    </li>
                ))}
                </ul>
            )}
        </Card>
      </div>
    </div>
  );
}

export default Home;