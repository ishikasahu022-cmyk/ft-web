import React, { useState } from "react";
import { Table, Form, Button, Row, Col, Badge } from "react-bootstrap";

const TransactionHistory = ({ data }) => {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");

  const [page, setPage] = useState(1);
  const perPage = 5;

  // FILTER
  const filtered = data
    .filter((t) =>
      t.category?.toLowerCase().includes(search.toLowerCase()) ||
      t.date?.includes(search)
    )
    .filter((t) => (type ? t.type === type : true))
    .filter((t) => (category ? t.category === category : true));

  // PAGINATION
  const totalPages = Math.ceil(filtered.length / perPage);
  const start = (page - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);

  // EXPORT CSV
  const exportCSV = () => {
    const header = "Date,Category,Type,Amount,Notes\n";
    const rows = filtered
      .map(
        (t) =>
          `${t.date},${t.category},${t.type},${t.amount},${t.notes || ""}`
      )
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
  };

  return (
    <div className="card">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 className="mb-0">Transaction History</h5>
          <small style={{ color: "#6b7280" }}>
            All income & expense records
          </small>
        </div>

        <Button
          onClick={exportCSV}
          style={{ background: "#111827", border: "none" }}
        >
          Export CSV
        </Button>
      </div>

      {/* FILTERS */}
      <Row className="mb-3">
        <Col md={4}>
          <Form.Control
            placeholder="Search date or category"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>

        <Col md={4}>
          <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">All Types</option>
            <option>Income</option>
            <option>Expense</option>
          </Form.Select>
        </Col>

        <Col md={4}>
          <Form.Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option>Salary</option>
            <option>Groceries</option>
            <option>Rent</option>
          </Form.Select>
        </Col>
      </Row>

      {/* TABLE */}
      <Table hover responsive>
        <thead style={{ background: "#f9fafb" }}>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Notes</th>
          </tr>
        </thead>

        <tbody>
          {paginated.map((t, i) => (
            <tr key={i}>
              <td>{t.date}</td>
              <td>{t.category}</td>
              <td>
                <Badge bg={t.type === "Income" ? "success" : "danger"}>
                  {t.type}
                </Badge>
              </td>
              <td>₹ {t.amount}</td>
              <td>{t.notes}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* PAGINATION */}
      <div className="d-flex justify-content-between">
        <small>
          Page {page} of {totalPages || 1}
        </small>

        <div>
          <Button
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </Button>

          <Button
            size="sm"
            className="ms-2"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;