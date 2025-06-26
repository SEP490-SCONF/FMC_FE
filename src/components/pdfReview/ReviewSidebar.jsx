import React from 'react';

const ReviewSidebar = ({ paper }) => (
    <div className="flex-1 p-6 border-r border-gray-200 bg-white">
        <h2 className="text-center text-xl font-bold border-b pb-2 mb-4">AI Conference</h2>
        <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
                type="text"
                value={paper.title}
                readOnly
                className="w-full border rounded px-3 py-2 bg-gray-100"
            />
        </div>
        <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Abstract</label>
            <input
                type="text"
                value={paper.abstract}
                readOnly
                className="w-full border rounded px-3 py-2 bg-gray-100"
            />
        </div>
        <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Score</label>
            <input
                type="text"
                value={paper.score}
                readOnly
                className="w-full border rounded px-3 py-2 bg-gray-100"
            />
        </div>
        <div className="mb-4">
            <label className="block text-sm font-medium mb-1">File PDF for submit</label>
            <input
                type="text"
                value={paper.fileName}
                readOnly
                className="w-full border rounded px-3 py-2 bg-gray-100"
            />
        </div>
        <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Submit Date</label>
            <input
                type="text"
                value={paper.submitDate}
                readOnly
                className="w-full border rounded px-3 py-2 bg-gray-100"
            />
        </div>
        <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
                value={paper.status}
                disabled
                className="w-full border rounded px-3 py-2 bg-gray-100"
            >
                <option>Need Revision</option>
                <option>Accepted</option>
                <option>Rejected</option>
            </select>
        </div>
    </div>
);

export default ReviewSidebar;