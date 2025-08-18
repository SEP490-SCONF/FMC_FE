import React from "react";

export default function NotFoundWithClearFilters({ onClear, message }) {
  return (
    <div className="bg-[#faf7f3] rounded-lg p-8 flex flex-col items-center text-center border border-gray-200">
      <div className="text-4xl mb-2">😕</div>
      <h2 className="text-xl font-semibold text-brown-700 mb-2">
        {message || "Sorry, no results found."}
      </h2>
      <p className="mb-4 text-gray-700">
        We couldn't find any results matching your search. Please adjust your filters or try again.
      </p>
      <button
        onClick={onClear}
        className="px-5 py-2 bg-yellow-700 text-white rounded font-semibold hover:bg-yellow-800 transition"
      >
        Clear Filters
      </button>
    </div>
  );
}