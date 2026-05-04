import React, { useState, useEffect, useCallback } from "react";
import { Button, Modal, Form, Badge, Table } from "react-bootstrap";
import axiosInstance from "../api/axiosInstence";
import { toast } from "react-toastify";

const initialForm = {
  name: "",
  categoryType: "expense",
  color: "#111827",
};

const AddCategory = () => {
  const [categories, setCategories] = useState([]);
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(initialForm);

  // pagination + search
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const perPage = 10;
  const [totalCount, setTotalCount] = useState(0);

  // delete modal state
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const totalPages = Math.ceil(totalCount / perPage);

  // =========================
  // FETCH
  // =========================
  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(
        `/finance/category-list?page=${page}&perPage=${perPage}&search=${search}`
      );

      setCategories(data?.data ?? []);
      setTotalCount(data?.totalCount ?? 0);
    } catch (err) {
      toast.error("Failed to load categories");
      console.error(err);
    }
  }, [page, search]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // =========================
  // MODAL CONTROL
  // =========================
  const openModal = useCallback((cat = null) => {
    if (cat) {
      setForm({
        name: cat.name || "",
        categoryType: cat.categoryType || "expense",
        color: cat.color || "#111827",
      });
      setEditId(cat._id);
    } else {
      setForm(initialForm);
      setEditId(null);
    }
    setShow(true);
  }, []);

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
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  // =========================
  // SAVE CATEGORY
  // =========================
  const save = async (e) => {
    e.preventDefault();

    const { name, categoryType, color } = form;

    if (!name || !categoryType || !color) {
      toast.error("All fields are required");
      return;
    }

    try {
      const payload = { name, categoryType, color };
      if (editId) payload.id = editId;

      const { data } = await axiosInstance.post(
        "/finance/add-category",
        payload
      );

      const updated = data?.data;

      setCategories((prev) => {
        if (editId) {
          return prev.map((c) => (c._id === editId ? updated : c));
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
  // DELETE FLOW
  // =========================
  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDelete(true);
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(
        `/finance/delete-category/${deleteId}`
      );

      setCategories((prev) =>
        prev.filter((c) => c._id !== deleteId)
      );

      toast.success("Deleted successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
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
          <h5 className="mb-0">Category Management</h5>
          <small style={{ color: "#6b7280" }}>
            Manage income and expense categories
          </small>
        </div>

        <Button
          style={{ background: "#111827", border: "none", borderRadius: 8 }}
          onClick={() => openModal()}
        >
          + Add Category
        </Button>
      </div>

      {/* SEARCH */}
      <div className="mb-3">
        <Form.Control
          style={{ maxWidth: 300 }}
          placeholder="Search category..."
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
            <th>Name</th>
            <th>Type</th>
            <th>Color</th>
            <th style={{ width: 150 }}>Action</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((cat) => (
            <tr key={cat._id}>
              <td className="fw-medium">{cat.name}</td>

              <td>
                <Badge
                  bg={
                    cat.categoryType?.toLowerCase() === "income"
                      ? "success"
                      : "danger"
                  }
                >
                  {cat.categoryType}
                </Badge>
              </td>

              <td>
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: cat.color,
                    border: "1px solid #ddd",
                  }}
                />
              </td>

              <td>
                <Button
                  size="sm"
                  variant="outline-primary"
                  className="me-2"
                  onClick={() => openModal(cat)}
                >
                  Edit
                </Button>

                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={() => confirmDelete(cat._id)}
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

      {/* ADD / EDIT MODAL */}
      <Modal show={show} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editId ? "Edit Category" : "Add Category"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select
                name="categoryType"
                value={form.categoryType}
                onChange={handleChange}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </Form.Select>
            </Form.Group>

            <Form.Group>
              <Form.Label>Color</Form.Label>
              <Form.Control
                type="color"
                name="color"
                value={form.color}
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

      {/* DELETE CONFIRMATION MODAL */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Are you sure you want to delete this category?
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

export default AddCategory;