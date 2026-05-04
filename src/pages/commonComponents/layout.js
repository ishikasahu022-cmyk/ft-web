import React from "react";
import { Outlet } from "react-router-dom"; // Import Outlet for nested routes
import Sidebar from "./sidebar";
import Header from "./header";
import Footer from "./footer";

const Layout = () => {
  return (
    <div className="dashboard-container">
      <Header />
      <div className="main-content">
        <Sidebar />
        <div className="content-area">
          {/* This is where the child routes will be rendered */}
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;