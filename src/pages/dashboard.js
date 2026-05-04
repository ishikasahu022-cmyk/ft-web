import React from "react";
import Card from "./card";
import ProgressBar from "./progressBar";
import Charts from "./charts";

const Dashboard = () => {
  // Sample data for charts
  const totalIncome = 10000;
  const totalExpenses = 4500;
  const budgetLimit = 12000;
  const actualSpending = 4500;

  return (
    <>
      <h5 className="fw-semibold mb-4">Financial Overview</h5>
      <p className="text-muted mb-4">
        Track your finances with a clear and easy-to-read overview.
      </p>

      {/* Total Income and Expenses */}
      <div className="row mb-5">
        <div className="col-md-6">
          <Card title="Total Income" value={`$${totalIncome}`} />
        </div>
        <div className="col-md-6">
          <Card title="Total Expenses" value={`$${totalExpenses}`} />
        </div>
      </div>

      {/* Budget Progress */}
      <ProgressBar actualSpending={actualSpending} budgetLimit={budgetLimit} />

      {/* Income vs Expenses and Budget Progress Over Time Charts */}
      <Charts totalIncome={totalIncome} totalExpenses={totalExpenses} />
    </>
  );
};

export default Dashboard;