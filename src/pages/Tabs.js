import React from "react";
import { Button } from "react-bootstrap";

const Tabs = ({ activeTab, setActiveTab, setPage, token }) => {
  return (
    token && (
      <div className="d-flex justify-content-center mb-3">
        <Button
          variant={activeTab === "blogs" ? "primary" : "outline-primary"}
          className="me-2"
          onClick={() => {
            setActiveTab("blogs");
            setPage(1);
          }}
        >
          Blogs
        </Button>

        <Button
          variant={activeTab === "myBlogs" ? "primary" : "outline-primary"}
          onClick={() => {
            setActiveTab("myBlogs");
            setPage(1);
          }}
        >
          My Blogs
        </Button>
      </div>
    )
  );
};

export default Tabs;