import React, { useState } from "react";
import TransactionHistory from "./TransactionHistory";
import TransactionModal from "./TransactionForm";
import { Button } from "react-bootstrap";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [show, setShow] = useState(false);

  const addTransaction = (data) => {
    setTransactions([
      { ...data, id: Date.now() },
      ...transactions,
    ]);
  };

  return (
    <div>
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Transactions</h5>

        <Button
          onClick={() => setShow(true)}
          style={{
            background: "#111827",
            border: "none",
            borderRadius: "8px",
          }}
        >
          + Add Transaction
        </Button>
      </div>

      {/* MODAL */}
      <TransactionModal
        show={show}
        onHide={() => setShow(false)}
        onSave={(data) => {
          addTransaction(data);
          setShow(false);
        }}
      />

      {/* LIST */}
      <TransactionHistory data={transactions} />
    </div>
  );
};

export default TransactionsPage;