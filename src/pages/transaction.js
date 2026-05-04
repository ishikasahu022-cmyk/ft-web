import React, { useState, useEffect, useCallback } from "react";
import { Button, Modal, Form, Badge, Table } from "react-bootstrap";
import axiosInstance from "../api/axiosInstence";
import { toast } from "react-toastify";

const initialForm = {
    categoryType: "",
    categoryId: "",
    amount: "",
    date: "",
    note: "",
};

const Transaction = () => {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);

    const [show, setShow] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState(initialForm);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const perPage = 10;
    const [totalCount, setTotalCount] = useState(0);

    const [showDelete, setShowDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const totalPages = Math.ceil(totalCount / perPage);

    // =========================
    // FETCH TRANSACTIONS
    // =========================
    const fetchTransactions = useCallback(async () => {
        try {
            const { data } = await axiosInstance.get(
                `/finance/transaction-list?page=${page}&perPage=${perPage}&search=${search}`
            );

            setTransactions(data?.data ?? []);
            setTotalCount(data?.totalCount ?? 0);
        } catch (err) {
            toast.error("Failed to load transactions");
        }
    }, [page, search]);

    // =========================
    // FETCH CATEGORIES
    // =========================
    const fetchCategories = async () => {
        try {
            const { data } = await axiosInstance.get(
                "/finance/category-list?perPage=1000"
            );
            setCategories(data?.data || []);
        } catch {
            toast.error("Failed to load categories");
        }
    };

    useEffect(() => {
        fetchTransactions();
        fetchCategories();
    }, [fetchTransactions]);

    // =========================
    // FILTER CATEGORY BY TYPE
    // =========================
    const filteredCategories = categories.filter(
        (c) => c.categoryType === form.categoryType
    );

    // =========================
    // MODAL CONTROL
    // =========================
    const openModal = useCallback((tx = null) => {
        if (tx) {
            setForm({
                categoryType: tx.categoryType,
                categoryId: tx.categoryId || "",
                amount: tx.amount || "",
                date: tx.date?.slice(0, 10) || "",
                note: tx.note || "",
            });
            setEditId(tx._id);
        } else {
            setForm(initialForm);
            setEditId(null);
        }
        setShow(true);
    }, []);

   const exportPdf = async () => {
        try {
            const { data } = await axiosInstance.get("/finance/export-pdf");
            const URL = `${process.env.REACT_APP_API_BASE_URL}${data?.url}`
            console.log('data == ', URL);
            const response = await fetch(URL);
            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');

            link.href = url;
            link.download = "transcations.pdf";
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        }
        catch (err) {
            console.error(err);
        }
    }

    const closeModal = useCallback(() => {
        setShow(false);
        setForm(initialForm);
        setEditId(null);
    }, []);

    // =========================
    // INPUT HANDLER
    // =========================
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;

        setForm((prev) => {
            if (name === "categoryType") {
                return {
                    ...prev,
                    categoryType: value,
                    categoryId: "", // reset category
                };
            }
            return { ...prev, [name]: value };
        });
    }, []);

    // =========================
    // SAVE
    // =========================
    const save = async (e) => {
        e.preventDefault();

        const { categoryType, categoryId, amount, date, note } = form;

        if (!categoryType || !categoryId || !amount || !date || !note) {
            toast.error("All fields are required");
            return;
        }

        try {
            const payload = { ...form };
            if (editId) payload.id = editId;

            const { data } = await axiosInstance.post(
                "/finance/add-transaction",
                payload
            );

            const updated = data?.data;

            setTransactions((prev) => {
                if (editId) {
                    return prev.map((t) => (t._id === editId ? updated : t));
                }
                return [updated, ...prev];
            });

            closeModal();
            toast.success(editId ? "Updated successfully" : "Added successfully");
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong");
        }
    };

    // =========================
    // DELETE
    // =========================
    const confirmDelete = (id) => {
        setDeleteId(id);
        setShowDelete(true);
    };

    const handleDelete = async () => {
        try {
            await axiosInstance.delete(
                `/finance/delete-transaction/${deleteId}`
            );

            setTransactions((prev) =>
                prev.filter((t) => t._id !== deleteId)
            );

            toast.success("Deleted successfully");
        } catch (err) {
            toast.error("Delete failed");
        } finally {
            setShowDelete(false);
            setDeleteId(null);
        }
    };

    return (
        <div className="card p-3">
            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h5 className="mb-0">Transaction Management</h5>
                    <small style={{ color: "#6b7280" }}>
                        Manage income and expense
                    </small>
                </div>
                <div className="d-flex gap-1">
                    <Button
                        style={{ background: "#111827", border: "none", borderRadius: 8 }}
                        onClick={() => openModal()}
                    >
                        + Add Transaction
                    </Button>
                    <Button
                        style={{ background: "#111827", border: "none", borderRadius: 8 }}
                        onClick={() => exportPdf()}
                    >
                        Export PDF
                    </Button>
                </div>
            </div>

            {/* SEARCH */}
            <div className="mb-3">
                <Form.Control
                    style={{ maxWidth: 300 }}
                    placeholder="Search transaction..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(0);
                    }}
                />
            </div>

            {/* TABLE */}
            <Table responsive hover className="align-middle">
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Notes</th>
                        <th style={{ width: 150 }}>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {transactions.map((t) => (
                        <tr key={t._id}>
                            <td>
                                <Badge
                                    bg={
                                        t.categoryType?.toLowerCase() === "income"
                                            ? "success"
                                            : "danger"
                                    }
                                >
                                    {t.categoryType}
                                </Badge>
                            </td>

                            <td>
                                <div className="d-flex align-items-center gap-2">
                                    <div
                                        style={{
                                            width: 12,
                                            height: 12,
                                            borderRadius: "50%",
                                            background: t.color,
                                            border: "1px solid #ddd",
                                        }}
                                    />
                                    {t.categoryName}
                                </div>
                            </td>

                            <td>₹ {t.amount}</td>

                            <td>
                                {new Date(t.date).toLocaleDateString()}
                            </td>

                            <td>{t.note}</td>

                            <td>
                                <Button
                                    size="sm"
                                    variant="outline-primary"
                                    className="me-2"
                                    onClick={() => openModal(t)}
                                >
                                    Edit
                                </Button>

                                <Button
                                    size="sm"
                                    variant="outline-danger"
                                    onClick={() => confirmDelete(t._id)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* PAGINATION */}
            <div className="d-flex justify-content-end align-items-center gap-2 mt-3">
                <Button
                    variant="outline-secondary"
                    disabled={page === 0}
                    onClick={() => setPage((p) => Math.max(p - 1, 0))}
                >
                    Prev
                </Button>

                <span className="px-2">
                    Page {page + 1} of {totalPages || 1}
                </span>

                <Button
                    variant="outline-secondary"
                    disabled={page + 1 >= totalPages}
                    onClick={() =>
                        setPage((p) => Math.min(p + 1, totalPages - 1))
                    }
                >
                    Next
                </Button>
            </div>

            {/* MODAL */}
            <Modal show={show} onHide={closeModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editId ? "Edit Transaction" : "Add Transaction"}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Type</Form.Label>
                            <Form.Select
                                name="categoryType"
                                value={form.categoryType}
                                onChange={handleChange}
                            >
                                <option value="">Select Type</option>
                                <option value="income">Income</option>
                                <option value="expense">Expense</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Select
                                disabled={!form.categoryType}
                                name="categoryId"
                                value={form.categoryId}
                                onChange={handleChange}
                            >
                                <option value="">Select Category</option>
                                {filteredCategories.map((c) => (
                                    <option key={c._id} value={c._id}>
                                        {c.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Amount</Form.Label>
                            <Form.Control
                                type="number"
                                name="amount"
                                value={form.amount}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="date"
                                value={form.date}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Note</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="note"
                                value={form.note}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="light" onClick={closeModal}>
                        Cancel
                    </Button>
                    <Button
                        style={{ background: "#111827", border: "none" }}
                        onClick={save}
                    >
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* DELETE MODAL */}
            <Modal show={showDelete} onHide={() => setShowDelete(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    Are you sure you want to delete this transaction?
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="light" onClick={() => setShowDelete(false)}>
                        Cancel
                    </Button>

                    <Button variant="danger" onClick={handleDelete}>
                        Yes, Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Transaction;