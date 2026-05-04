import React from "react";
import {
  Wallet,
  Grid3x3Gap,
  ArrowLeftRight,
  PiggyBank
} from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <div className="mb-4">
        <h6 className="text-secondary">Navigation</h6>
        <ul className="list-unstyled">
          <li>
            <a
              href="#overview"
              className="sidebar-link"
              onClick={() => navigate("/")}
            >
              <Wallet className="me-2" size={18} /> Overview
            </a>
          </li>

          <li>
            <a
              className="sidebar-link"
              onClick={() => navigate("/category")}
            >
              <Grid3x3Gap className="me-2" size={18} /> Category
            </a>
          </li>

          <li>
            <a
              className="sidebar-link"
              onClick={() => navigate("/transaction")}
            >
              <ArrowLeftRight className="me-2" size={18} /> Transaction
            </a>
          </li>

          <li>
            <a
              className="sidebar-link"
              onClick={() => navigate("/budget")}
            >
              <PiggyBank className="me-2" size={18} /> Budget
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;