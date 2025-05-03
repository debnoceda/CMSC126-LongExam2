import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  Title,
  ArcElement,
} from 'chart.js';
import api from '../api';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const ExpensesSummaryChart = ({ selectedYear, selectedMonth }) => {
  const [expensesData, setExpensesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/api/transactions/');
        const expenses = response.data.filter(
          (t) => t.transaction_type === 'expense'
        );
        setExpensesData(expenses);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchData();
  }, []);

  const filteredData = expensesData.filter((t) => {
    const date = new Date(t.date);
    return (
      date.getFullYear() === selectedYear && date.getMonth() === selectedMonth
    );
  });

  const categories = {};
  filteredData.forEach((t) => {
    const category = t.category_name;
    categories[category] = (categories[category] || 0) + parseFloat(t.amount);
  });

  const chartData = {
    labels: Object.keys(categories),
    datasets: [
      {
        label: Object.keys(categories),
        data: Object.values(categories),
        backgroundColor: ['#F08F8F', '#F4DD7A', '#9FD6CB', '#9AC67B', '#9966ff'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: { display: false },
      legend: { position: 'right' },
    },
  };

  return (
    <div style={{ width: 'fit-content', maxWidth: '500px' }}>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default ExpensesSummaryChart;
