import React from "react";
import { Row, Col, Form } from "react-bootstrap";

const SearchFilter = ({ search, setSearch, category, setCategory, categories }) => {
  return (
    <Row className="mb-4 g-2">
      <Col md={5}>
        <Form.Control
          placeholder="Search blogs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Col>

      <Col md={3}>
        <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.categoryName}
            </option>
          ))}
        </Form.Select>
      </Col>
    </Row>
  );
};

export default SearchFilter;