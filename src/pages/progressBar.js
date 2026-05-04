import React from "react";

const ProgressBar = ({ actualSpending, budgetLimit }) => {
  const progressPercentage = (actualSpending / budgetLimit) * 100;

  return (
    <div className="progress-container">
      <h6 className="text-muted">Budget Progress</h6>
      <div className="progress">
        <div
          className="progress-bar"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <div className="text-center">{`${progressPercentage.toFixed(2)}% of your budget used`}</div>
    </div>
  );
};

export default ProgressBar;