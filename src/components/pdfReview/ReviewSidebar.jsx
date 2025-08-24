import React, { useState } from "react";
import { updateReview, sendFeedback } from "../../services/ReviewService";
import AnalyzeAiService from "../../services/AnalyzeAiService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Thêm `readOnly` vào danh sách props
const ReviewSidebar = ({
  review,
  chunks, // Sử dụng mảng chunks thay vì rawText
  onChange,
  onSave,
  onSendFeedback,
  readOnly = false, // Đặt giá trị mặc định là false
}) => {
  const [aiPercentage, setAiPercentage] = useState(review?.percentAi || 0);

  const safePaperStatus = review?.paperStatus || "Need Revision";

  if (!review) {
    return (
      <div className="flex-1 p-6 border-r border-gray-200 bg-white">
        <h2 className="text-center text-xl font-bold border-b pb-2 mb-4">
          Review Info
        </h2>
        <div className="text-gray-500 text-center">No review data</div>
      </div>
    );
  }

  const handleChange = (field, value) => {
    if (!readOnly && onChange) {
      if (field === "paperStatus" && !value) {
        value = "Need Revision";
      }
      onChange({ ...review, [field]: value });
    }
  };

  const handleSave = async () => {
    if (readOnly) return;
    const formData = new FormData();
    formData.append("Comments", review.comments ?? "");
    formData.append("Score", review.score ?? "");
    formData.append("PaperStatus", safePaperStatus);
    try {
      await updateReview(review.reviewId, formData);
      toast.success("Review updated successfully!");
      if (onSave) onSave();
    } catch (err) {
      toast.error("Update failed!");
    }
  };

  const handleSendFeedback = async () => {
    if (readOnly) return;
    const formData = new FormData();
    formData.append("Comments", review.comments ?? "");
    formData.append("Score", review.score ?? "");
    formData.append("PaperStatus", safePaperStatus);
    try {
      await updateReview(review.reviewId, formData);
      await sendFeedback(review.reviewId);
      toast.success("Feedback sent and statuses updated!");
      if (onSendFeedback) onSendFeedback();
    } catch (err) {
      toast.error("Error sending feedback!");
    }
  };

  const handleCheckAiAgain = async () => {
    if (readOnly) return;
    if (!review?.reviewId || !chunks?.length || !chunks[0]?.RawText) {
      console.error('Missing reviewId or rawText in chunks:', { reviewId: review?.reviewId, chunks });
      toast.error("No data available to check AI.");
      return;
    }

    try {
      console.log("Chunks being sent", chunks);
      const response = await AnalyzeAiService.analyzeDocument(review.reviewId, chunks); // Gửi mảng chunks
      const percentAi = response?.PercentAi !== undefined ? response.PercentAi : 0;
      setAiPercentage(percentAi);
      toast.info(`AI check completed! Percentage: ${percentAi}%`);
      if (onChange) {
        onChange({ ...review, percentAi });
      }
    } catch (err) {
      console.error("Error checking AI:", err);
      const errorMessage = err.response?.data?.message || err.message;
      toast.error(`Failed to re-check AI: ${errorMessage}`);
    }
  };

  return (
    <div className="flex-1 p-6 border-r border-gray-200 bg-white flex flex-col h-full">
      <h2 className="text-center text-xl font-bold border-b pb-2 mb-4">
        Review Info
      </h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Score</label>
        <input
          type="number"
          value={review.score ?? ""}
          onChange={(e) => handleChange("score", e.target.value)}
          className="w-full border rounded px-3 py-2 bg-gray-100"
          disabled={readOnly}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Comments</label>
        <textarea
          value={review.comments ?? ""}
          onChange={(e) => handleChange("comments", e.target.value)}
          className="w-full border rounded px-3 py-2 bg-gray-100"
          rows={3}
          disabled={readOnly}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          value={safePaperStatus}
          onChange={(e) => handleChange("paperStatus", e.target.value)}
          className="w-full border rounded px-3 py-2 bg-gray-100"
          disabled={readOnly}
        >
          <option value="Need Revision">Need Revision</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">AI Percentage</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={aiPercentage + "%"}
            className="w-full border rounded px-3 py-2 bg-gray-100"
            disabled
          />
          {!readOnly && (
            <button
              className="px-4 py-2 bg-blue-100 text-blue-700 border border-blue-600 rounded font-semibold hover:bg-blue-600 hover:text-white transition"
              onClick={handleCheckAiAgain}
            >
              Check Again
            </button>
          )}
        </div>
      </div>
      {!readOnly && (
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
      )}
    </div>
  );
};

export default ReviewSidebar;