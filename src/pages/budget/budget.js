import React, { useState, useEffect, useCallback } from "react";
import {
    Button,
    Modal,
    Form,
    Table,
    ProgressBar,
    Badge
} from "react-bootstrap";
import axiosInstance from "../../api/axiosInstence";
import { toast } from "react-toastify";

const initialForm = {
    name: "",
    categoryIds: [],
    amount: "",
    timeFrame: "",
    startDate: "",
    endDate: "",
};

const Budget = () => {
    const [budgets, setBudgets] = useState([]);
    const [categories, setCategories] = useState([]);

    const [show, setShow] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState(initialForm);

    // DELETE STATES
    const [showDelete, setShowDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    // =========================
    // FETCH DATA
    // =========================
    const fetchBudgets = useCallback(async () => {
        try {
            const { data } = await axiosInstance.get("/finance/budget-list");
            setBudgets(data?.data || []);
        } catch {
            toast.error("Failed to load budgets");
        }
    }, []);

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
        fetchBudgets();
        fetchCategories();
    }, [fetchBudgets]);

    // =========================
    // MODAL CONTROL
    // =========================
    const openModal = (b = null) => {
        if (b) {
            const categories = b.categories.map((c) => c._id);

            setForm({
                name: b.name,
                categoryIds: categories || [],
                amount: b.amount,
                timeFrame: b.timeFrame,
                startDate: b.startDate?.slice(0, 10) || "",
                endDate: b.endDate?.slice(0, 10) || "",
            });
            setEditId(b._id);
        } else {
            setForm(initialForm);
            setEditId(null);
        }
        setShow(true);
    };

    const closeModal = () => {
        setShow(false);
        setForm(initialForm);
        setEditId(null);
    };

    // =========================
    // DELETE HANDLERS
    // =========================
    const openDeleteModal = (id) => {
        setDeleteId(id);
        setShowDelete(true);
    };

    const closeDeleteModal = () => {
        setDeleteId(null);
        setShowDelete(false);
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            await axiosInstance.delete(`/finance/delete-budget/${deleteId}`);

            setBudgets((prev) =>
                prev.filter((b) => b._id !== deleteId)
            );

            toast.success("Deleted successfully");
            closeDeleteModal();
        } catch {
            toast.error("Delete failed");
        }
    };

    // =========================
    // HANDLERS
    // =========================
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (id) => {
        setForm((prev) => {
            const exists = prev.categoryIds.includes(id);
            return {
                ...prev,
                categoryIds: exists
                    ? prev.categoryIds.filter((c) => c !== id)
                    : [...prev.categoryIds, id],
            };
        });
    };

    // =========================
    // SAVE
    // =========================
    const save = async (e) => {
        e.preventDefault();

        if (!form.name || !form.amount || form.categoryIds.length === 0) {
            return toast.error("All fields are required");
        }

        if (form.timeFrame === "custom") {
            if (!form.startDate || !form.endDate) {
                return toast.error("Start and End date required");
            }
        }

        try {
            const payload = { ...form };
            if (editId) payload.id = editId;

            const { data } = await axiosInstance.post(
                "/finance/add-budget",
                payload
            );

            const updated = data?.data;

            setBudgets((prev) => {
                if (editId) {
                    return prev.map((b) =>
                        b._id === editId ? updated : b
                    );
                }
                return [updated, ...prev];
            });

            toast.success(editId ? "Updated successfully" : "Created successfully");
            closeModal();
        } catch {
            toast.error("Save failed");
        }
    };

    // =========================
    // PROGRESS HELPERS
    // =========================
    const getProgress = (spent = 0, amount = 1) =>
        Math.min((spent / amount) * 100, 100);

    const getVariant = (spent = 0, amount = 1) => {
        const percent = (spent / amount) * 100;
        if (percent < 70) return "success";
        if (percent < 90) return "warning";
        return "danger";
    };

    return (
        <div className="card p-3">

            {/* HEADER */}
            <div className="d-flex justify-content-between mb-3">
                <div>
                    <h5 className="mb-0">Budget Management</h5>
                    <small style={{ color: "#6b7280" }}>
                        Track and control your spending
                    </small>
                </div>

                <Button
                    style={{
                        background: "#111827",
                        border: "none",
                        borderRadius: 8,
                    }}
                    onClick={() => openModal()}
                >
                    + Add Budget
                </Button>
            </div>

            {/* TABLE */}
            <Table responsive hover className="align-middle">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Categories</th>
                        <th>Amount</th>
                        <th>Spent</th>
                        <th>Progress</th>
                        <th>Period</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {budgets.map((b) => (
                        <tr key={b._id}>
                            <td>{b.name}</td>

                            <td>
                                {b.categories?.map((c) => (
                                    <Badge
                                        key={c._id}
                                        bg="secondary"
                                        className="me-1"
                                    >
                                        {c.name}
                                    </Badge>
                                ))}
                            </td>

                            <td>₹ {b.amount}</td>
                            <td>₹ {b.spent || 0}</td>

                            <td style={{ minWidth: 150 }}>
                                <ProgressBar
                                    now={getProgress(b.spent, b.amount)}
                                    variant={getVariant(b.spent, b.amount)}
                                />
                            </td>

                            <td>
                                <Badge bg="info">{b.timeFrame}</Badge>

                                {b.timeFrame === "custom" && (
                                    <div style={{ fontSize: 12 }}>
                                        {b.startDate?.slice(0, 10)} →{" "}
                                        {b.endDate?.slice(0, 10)}
                                    </div>
                                )}
                            </td>

                            <td>
                                <Button
                                    size="sm"
                                    variant="outline-primary"
                                    className="me-2"
                                    onClick={() => openModal(b)}
                                >
                                    Edit
                                </Button>

                                <Button
                                    size="sm"
                                    variant="outline-danger"
                                    onClick={() => openDeleteModal(b._id)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* CREATE / EDIT MODAL */}
            <Modal show={show} onHide={closeModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editId ? "Edit Budget" : "Create Budget"}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Budget Name</Form.Label>
                            <Form.Control
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Categories</Form.Label>
                            <div style={{ maxHeight: 150, overflowY: "auto" }}>
                                {categories.map((c) => (
                                    <Form.Check
                                        key={c._id}
                                        type="checkbox"
                                        label={c.name}
                                        checked={form.categoryIds.includes(c._id)}
                                        onChange={() =>
                                            handleCategoryChange(c._id)
                                        }
                                    />
                                ))}
                            </div>
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

                        <Form.Group>
                            <Form.Label>Time Frame</Form.Label>
                            <Form.Select
                                name="timeFrame"
                                value={form.timeFrame}
                                onChange={handleChange}
                            >
                                <option value="">Select</option>
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                                <option value="custom">Custom</option>
                            </Form.Select>
                        </Form.Group>

                        {form.timeFrame === "custom" && (
                            <>
                                <Form.Group className="mt-3">
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="startDate"
                                        value={form.startDate}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Form.Group className="mt-3">
                                    <Form.Label>End Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="endDate"
                                        value={form.endDate}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </>
                        )}
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

            {/* DELETE CONFIRMATION MODAL */}
            <Modal show={showDelete} onHide={closeDeleteModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    Are you sure you want to delete this budget?
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="light" onClick={closeDeleteModal}>
                        Cancel
                    </Button>

                    <Button variant="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Budget;