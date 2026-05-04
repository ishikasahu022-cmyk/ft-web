import React from "react";
import { Gear } from 'react-bootstrap-icons';
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  return (
    <div className="header">
      <h4 className="fw-semibold">Finance Tracker</h4>
      <div className="header-actions">
        <span className="me-3">Welcome, User!</span>
        <Gear size={20} style={{ cursor: "pointer" }}  onClick={() => navigate("/userProfile")}/>
      </div>
    </div>
  );
};

export default Header;