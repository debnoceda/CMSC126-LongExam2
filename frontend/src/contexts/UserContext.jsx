import React, { createContext, useState, useEffect } from 'react';
import api from '../api';

/**
 * Sample Usage in a component:
 * import { useContext } from 'react';
 * import { UserContext } from '../contexts/UserContext';
 * const { user, loading, error, fetchUserData, updateMonthlyBudget } = useContext(UserContext);
 */

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Fetch user data when the provider mounts
  useEffect(() => {
    fetchUserData();
  }, []);

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
    <UserContext.Provider value={{ user, setUser, loading, error, fetchUserData, updateMonthlyBudget }}>
      {children}
    </UserContext.Provider>
  );
};