import React from 'react';
import { updateReview, sendFeedback } from '../../services/ReviewService';

const ReviewSidebar = ({ review, onChange, onSave, onSendFeedback }) => {
    if (!review) {
        return (
            <div className="flex-1 p-6 border-r border-gray-200 bg-white">
                <h2 className="text-center text-xl font-bold border-b pb-2 mb-4">Review Info</h2>
                <div className="text-gray-500 text-center">No review data</div>
            </div>
        );
    }

    const handleChange = (field, value) => {
        if (onChange) {
            onChange({ ...review, [field]: value });
        }
    };

    const handleSave = async () => {
        const formData = new FormData();
        formData.append("Comments", review.comments ?? "");
        formData.append("Score", review.score ?? "");
        formData.append("PaperStatus", review.paperStatus ?? "");
        try {
            await updateReview(review.reviewId, formData);
            alert("Review updated!");
            if (onSave) onSave();
        } catch (err) {
            alert("Update failed!");
        }
    };

    // Gửi phản hồi: cập nhật review rồi gọi API gửi feedback
    const handleSendFeedback = async () => {
        const formData = new FormData();
        formData.append("Comments", review.comments ?? "");
        formData.append("Score", review.score ?? "");
        formData.append("PaperStatus", review.paperStatus ?? "");
        try {
            await updateReview(review.reviewId, formData); // Cập nhật review trước
            await sendFeedback(review.reviewId);           // Gọi API gửi feedback
            alert('Feedback sent and statuses updated!');
            if (onSendFeedback) onSendFeedback();
        } catch (err) {
            alert('Error sending feedback');
        }
    };

    return (
        <div className="flex-1 p-6 border-r border-gray-200 bg-white flex flex-col h-full">
            <h2 className="text-center text-xl font-bold border-b pb-2 mb-4">Review Info</h2>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Score</label>
                <input
                    type="number"
                    value={review.score ?? ""}
                    onChange={e => handleChange("score", e.target.value)}
                    className="w-full border rounded px-3 py-2 bg-gray-100"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Comments</label>
                <textarea
                    value={review.comments ?? ""}
                    onChange={e => handleChange("comments", e.target.value)}
                    className="w-full border rounded px-3 py-2 bg-gray-100"
                    rows={3}
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                    value={review.paperStatus ?? ""}
                    onChange={e => handleChange("paperStatus", e.target.value)}
                    className="w-full border rounded px-3 py-2 bg-gray-100"
                >
                    <option value="Need Revision">Need Revision</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>
            <div className="flex gap-4 mt-auto">
                <button
                    className="flex-1 px-6 py-2 bg-blue-100 text-blue-700 border border-blue-600 rounded font-semibold hover:bg-blue-600 hover:text-white transition"
                    onClick={handleSave}
                >
                    Save
                </button>
                <button
                    className="flex-1 px-6 py-2 bg-green-100 text-green-700 border border-green-600 rounded font-semibold hover:bg-green-600 hover:text-white transition"
                    onClick={handleSendFeedback}
                >
                    Send Feedback
                </button>
            </div>
        </div>
    );
};

export default ReviewSidebar;