// src/components/IncomeVsExpensesChart.js

import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
  Title,
} from 'chart.js';
import api from '../api'; // Import your existing api module

ChartJS.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip, Title);

const IncomeVsExpensesChart = () => {
  const [chartData, setChartData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Income',
        data: [],
        backgroundColor: '#84AE26', // green
      },
      {
        label: 'Expenses',
        data: [],
        backgroundColor: '#CD3738', // red
      }
    ]
  });

  useEffect(() => {
    // Fetch the transaction data from your backend API using the api module
    const fetchData = async () => {
      try {
        const response = await api.get('/api/transactions/'); // Use the api instance to make the GET request
        const transactions = response.data;

        // Initialize arrays for income and expense amounts by month
        const incomeData = Array(12).fill(0);
        const expenseData = Array(12).fill(0);

        // Process the transactions to sum income and expenses by month
        transactions.forEach(transaction => {
          const month = new Date(transaction.date).getMonth(); // Get the month index (0-11)
          if (transaction.transaction_type === 'income') {
            incomeData[month] += parseFloat(transaction.amount);
          } else if (transaction.transaction_type === 'expense') {
            expenseData[month] += parseFloat(transaction.amount);
          }
        });

        // Set the data for the chart
        setChartData({
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: 'Income',
              data: incomeData,
              backgroundColor: '#84AE26', // green
            },
            {
              label: 'Expenses',
              data: expenseData,
              backgroundColor: '#CD3738', // red
            }
          ]
        });
      } catch (error) {
        console.error('Error fetching transaction data', error);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: false,
        text: 'Income vs Expenses (2025)',
        font: {
          size: 24
        }
      },
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 500
        }
      }
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default IncomeVsExpensesChart;
