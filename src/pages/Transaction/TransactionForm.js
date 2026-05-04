import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const categories = ["Salary", "Groceries", "Rent", "Utilities", "Travel"];

const TransactionModal = ({ show, onHide, onSave }) => {
  const [form, setForm] = useState({
    type: "Expense",
    category: "",
    amount: "",
    date: "",
    notes: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.amount || !form.category || !form.date) return;

    onSave(form);

    setForm({
      type: "Expense",
      category: "",
      amount: "",
      date: "",
      notes: "",
    });
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Transaction</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* TYPE TOGGLE */}
        <div className="txn-toggle-modal">
          <button
            className={form.type === "Expense" ? "active expense" : ""}
            onClick={() => setForm({ ...form, type: "Expense" })}
            type="button"
          >
            Expense
          </button>

          <button
            className={form.type === "Income" ? "active income" : ""}
            onClick={() => setForm({ ...form, type: "Income" })}
            type="button"
          >
            Income
          </button>
        </div>

        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Category</Form.Label>
            <Form.Select
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option value="">Select</option>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="Enter amount"
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Optional"
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="light" onClick={onHide}>
          Cancel
        </Button>

        <Button
          onClick={handleSubmit}
          style={{
            background: "#111827",
            border: "none",
          }}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TransactionModal;