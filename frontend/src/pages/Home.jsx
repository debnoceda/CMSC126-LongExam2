import React, { useState, useEffect } from "react";
import api from "../api";
import "../styles/Home.css";
import Header from "../components/Header";
import BalanceSummary from "../components/BalanceSummary";
import Card from "../components/Card";
import SpendingSummaryCard from "../components/SpendingSummaryCard";
import WalletsList from "../components/WalletsList";
import Button from "../components/Button";
import ExpensesSummaryChart from '../components/ExpensesSummaryChart';
import Dropdown from "../components/Dropdown";
import { useNavigate } from "react-router-dom";

function Home() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [loading, setLoading] = useState(true);
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
    const fetchUserData = async () => {
      try {
        const userResponse = await api.get("/api/users/");
        const userData = userResponse.data;

        if (Array.isArray(userData) && userData.length > 0) {
          setUser(userData[0]);
        } else if (!Array.isArray(userData)) {
          setUser(userData);
        } else {
          console.warn("No user data available");
          setUser(null);
        }

        const transactionsResponse = await api.get('/api/transactions/');
        setTransactions(transactionsResponse.data);

      } catch (error) {
        console.error("Failed to load data:", error);
        alert("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <>
      <Header />
      <div className="home-container">
        <SpendingSummaryCard budget={user?.monthly_budget?.toFixed(2) || '0.00'} />
        <BalanceSummary />
        <Card title="Wallets" className="wallets-section">
          <div className="wallets-header">
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
        <BalanceSummary />
      </div>
    </>
  );
}

export default Home;
