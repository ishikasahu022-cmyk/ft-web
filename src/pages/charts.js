import React from "react";
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const Charts = ({ totalIncome, totalExpenses }) => {
  const incomeVsExpensesData = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        label: 'Income vs Expenses',
        data: [totalIncome, totalExpenses],
        backgroundColor: ['#4CAF50', '#F44336'],
        borderColor: ['#4CAF50', '#F44336'],
        borderWidth: 1,
      },
    ],
  };

  const budgetProgressLineData = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Budget Limit',
        data: [12000, 12000, 12000, 12000, 12000],
        borderColor: '#2196F3',
        borderWidth: 2,
        fill: false,
      },
      {
        label: 'Actual Spending',
        data: [1000, 2500, 4000, 4500, 5500],
        borderColor: '#FFC107',
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  return (
    <div className="charts-container">
      <div className="chart-card">
        <h6 className="text-muted">Income vs. Expenses</h6>
        <div style={{ height: "300px" }}>
          <Pie data={incomeVsExpensesData} />
        </div>
      </div>
      <div className="chart-card">
        <h6 className="text-muted">Budget Progress Over Time</h6>
        <div style={{ height: "300px" }}>
          <Line data={budgetProgressLineData} />
        </div>
      </div>
    </div>
  );
};

export default Charts;