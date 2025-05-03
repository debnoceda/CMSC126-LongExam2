import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Legend, Tooltip, Title } from "chart.js";
import api from "../api";

ChartJS.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip, Title);

const IncomeVsExpensesChart = () => {
    const [chartData, setChartData] = useState({
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
            {
                label: "Income",
                data: [],
                backgroundColor: "#84AE26",
            },
            {
                label: "Expenses",
                data: [],
                backgroundColor: "#CD3738",
            },
        ],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await api.get("/api/transactions/income_vs_expenses/"); // Corrected URL
                const data = response.data;

                if (data && data.months && data.income && data.expenses) {
                    setChartData({
                        labels: data.months,
                        datasets: [
                            {
                                label: "Income",
                                data: data.income,
                                backgroundColor: "#84AE26",
                            },
                            {
                                label: "Expenses",
                                data: data.expenses,
                                backgroundColor: "#CD3738",
                            },
                        ],
                    });
                } else {
                    console.error("Unexpected data format from API:", data);
                }
            } catch (error) {
                console.error("Error fetching income vs expenses data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: false,
                text: "Income vs Expenses",
                font: {
                    size: 24,
                },
            },
            legend: {
                position: "top",
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 500,
                },
            },
        },
    };

    if (loading) {
        return <div>Loading Income vs Expenses Chart...</div>;
    }

    return (
        <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default IncomeVsExpensesChart;
