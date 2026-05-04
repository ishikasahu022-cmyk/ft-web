import React from "react";

const Card = ({ title, value }) => {
  return (
    <div className="card">
      <h6 className="text-muted">{title}</h6>
      <h4>{value}</h4>
    </div>
  );
};

export default Card;