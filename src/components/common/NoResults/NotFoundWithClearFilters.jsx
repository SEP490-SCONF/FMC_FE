import React from "react";

export default function NoData({ message }) {
  return (
    <div className="bg-gray-50 rounded-lg p-8 flex flex-col items-center text-center border border-gray-200">
      <div className="text-4xl mb-2">📭</div>
      <h2 className="text-lg font-semibold text-gray-700 mb-2">
        {message || "No data available."}
      </h2>
      <p className="text-gray-600">There is currently no data to display.</p>
    </div>
  );
}