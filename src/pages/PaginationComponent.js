import React from "react";
import { Pagination } from "react-bootstrap";

const PaginationComponent = ({ page, totalPages, setPage }) => {
  return (
    <div className="d-flex justify-content-center mt-5">
      <Pagination>
        <Pagination.Prev disabled={page === 1} onClick={() => setPage((p) => p - 1)} />
        {[...Array(totalPages)].map((_, i) => (
          <Pagination.Item key={i} active={page === i + 1} onClick={() => setPage(i + 1)}>
            {i + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} />
      </Pagination>
    </div>
  );
};

export default PaginationComponent;