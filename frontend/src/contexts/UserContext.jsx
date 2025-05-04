import React, { createContext, useState, useEffect } from 'react';
import api from '../api';

/**
 * Sample Usage in a component:
 * import { useContext } from 'react';
 * import { UserContext } from '../contexts/UserContext';
 * const { user, loading, error, fetchUserData, updateMonthlyBudget, balanceSummary, fetchBalanceSummary, wallets, fetchWallets, transactions, fetchTransactions } = useContext(UserContext);
 */

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [balanceSummary, setBalanceSummary] = useState({
    total_balance: 0,
    total_income: 0,
    total_expense: 0,
  });
  const [wallets, setWallets] = useState([]);
  const [walletsLoading, setWalletsLoading] = useState(true);
  const [walletsError, setWalletsError] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [transactionsError, setTransactionsError] = useState(null);

  // Function to fetch user data
  const fetchUserData = async () => {
    setLoading(true); // Set loading to true while fetching
    try {
      const response = await api.get('/api/users/');
      const data = response.data;

      if (Array.isArray(data) && data.length > 0) {
        setUser(data[0]);
      } else if (!Array.isArray(data)) {
        setUser(data);
      } else {
        setError('No user data available');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load user information');
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  // Function to fetch balance summary
  const fetchBalanceSummary = async () => {
    try {
      const response = await api.get('/api/transactions/total_balance/');
      setBalanceSummary(response.data);
    } catch (error) {
      console.error('Error fetching balance summary:', error);
    }
  };

  // Function to fetch wallets
  const fetchWallets = async () => {
    setWalletsLoading(true);
    try {
      const response = await api.get('/api/wallets/');
      setWallets(response.data);
      setWalletsError(null);
    } catch (error) {
      console.error('Error fetching wallets:', error);
      setWalletsError('Failed to fetch wallets. Please try again.');
    } finally {
      setWalletsLoading(false);
    }
  };

  // Function to fetch transactions
  const fetchTransactions = async () => {
    setTransactionsLoading(true);
    try {
      const response = await api.get('/api/transactions/');
      setTransactions(response.data);
      setTransactionsError(null);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactionsError('Failed to fetch transactions. Please try again.');
    } finally {
      setTransactionsLoading(false);
    }
  };

  // Function to update the monthly budget
  const updateMonthlyBudget = async (newBudget) => {
    if (!user) {
      console.error("User is not loaded. Cannot update monthly budget.");
      return false;
    }

    try {
      console.log("Before update - Current user:", user);

      const response = await api.patch(`/api/users/${user.id}/`, {
        monthly_budget: newBudget,
      });

      console.log("Response from server:", response.data);

      if (response.data) {
        // Update user state with the new data
        setUser((prevUser) => ({
          ...prevUser,
          monthly_budget: newBudget,
        }));

        return true;
      }
    } catch (error) {
      if (error.response) {
        console.error("Error updating user data:", error.response.data);
      } else {
        console.error("Error updating user data:", error.message);
      }
      return false;
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,
        error,
        fetchUserData,
        updateMonthlyBudget,
        balanceSummary,
        fetchBalanceSummary,
        wallets,
        fetchWallets,
        walletsLoading,
        walletsError,
        transactions,
        fetchTransactions,
        transactionsLoading,
        transactionsError,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};