import React from "react";

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex gap-2 mt-8 justify-center items-center select-none">
      <button
        disabled={page === 1}
        onClick={() => onPageChange(1)}
        className="text-gray-500 px-2 py-1 rounded disabled:opacity-50 hover:bg-gray-200"
      >
        &laquo; first
      </button>
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="text-gray-500 px-2 py-1 rounded disabled:opacity-50 hover:bg-gray-200"
      >
        &lsaquo; previous
      </button>
      {pageNumbers.map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          className={`px-3 py-2 rounded ${
            num === page
              ? "bg-yellow-700 text-white font-bold"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          {num}
        </button>
      ))}
      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="text-gray-500 px-2 py-1 rounded disabled:opacity-50 hover:bg-gray-200"
      >
        next &rsaquo;
      </button>
      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(totalPages)}
        className="text-gray-500 px-2 py-1 rounded disabled:opacity-50 hover:bg-gray-200"
      >
        last &raquo;
      </button>
    </div>
  );
}