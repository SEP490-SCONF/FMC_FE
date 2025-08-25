import React, { useEffect, useRef, useState } from "react";
import { updateReview, sendFeedback } from "../../services/ReviewService";
import AnalyzeAiService from "../../services/AnalyzeAiService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const ReviewSidebar = ({
  review,
  chunks,
  aiPercentage, // nhận prop này
  onChange,
  onSave,
  onSendFeedback,
  readOnly = false,
}) => {
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
  const navigate = useNavigate();
  const handleChange = (field, value) => {
    if (!readOnly && onChange) {
      if (field === "paperStatus" && !value) {
        value = "Need Revision";
      }
      onChange({ ...review, [field]: value });
    }
  };

  // Thêm state loading
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  const handleSave = async () => {
    if (readOnly) return;
    setLoadingSave(true);
    const formData = new FormData();
    formData.append("Comments", review.comments ?? "");
    formData.append("Score", review.score ?? "");
    formData.append("PaperStatus", safePaperStatus);
    try {
      await updateReview(review.reviewId, formData);
      toast.success("Review updated successfully!");
      navigate("/reviewer/assigned-papers");
      if (onSave) onSave();
    } catch (err) {
      toast.error("Update failed!");
    } finally {
      setLoadingSave(false);
    }
  };

  const handleSendFeedback = async () => {
    if (readOnly) return;
    setLoadingFeedback(true);
    const formData = new FormData();
    formData.append("Comments", review.comments ?? "");
    formData.append("Score", review.score ?? "");
    formData.append("PaperStatus", safePaperStatus);
    try {
      await updateReview(review.reviewId, formData);
      await sendFeedback(review.reviewId);
      toast.success("Feedback sent!");
      navigate("/reviewer/assigned-papers");
      if (onSendFeedback) onSendFeedback();
    } catch (err) {
      toast.error("Send feedback failed!");
    } finally {
      setLoadingFeedback(false);
    }
  };

  const handleCheckAiAgain = async () => {
    // console.log("Check Again Clicked");
    // console.log("reviewId:", review?.reviewId);
    // console.log("chunks:", chunks);

    if (!review?.reviewId || !chunks?.length) {
      toast.error("No data available to check AI.");
      return;
    }
    try {
      const response = await AnalyzeAiService.analyzeDocument(review.reviewId, chunks);
      console.log("AI API response:", response);
      const percent = response?.percentAi ?? response?.PercentAi ?? 0;
      if (onChange) onChange({ ...review, percentAi: percent });
    } catch (err) {
      console.error("Check AI error:", err);
      toast.error("Failed to re-check AI");
    }
  };

  // Hiệu ứng số nhảy cho AI Percentage
  const [displayedAiPercentage, setDisplayedAiPercentage] = useState(aiPercentage ?? 0);
  const intervalRef = useRef();

  useEffect(() => {
    // Nếu giá trị mới khác với đang hiển thị, bắt đầu hiệu ứng
    if (typeof aiPercentage === "number" && aiPercentage !== displayedAiPercentage) {
      clearInterval(intervalRef.current);
      let current = 0;
      intervalRef.current = setInterval(() => {
        // Tăng số ngẫu nhiên, nhưng không vượt quá giá trị thực
        current = Math.min(
          aiPercentage,
          Math.round(current + Math.random() * (aiPercentage / 8 + 1))
        );
        setDisplayedAiPercentage(current);
        if (current >= aiPercentage) {
          clearInterval(intervalRef.current);
          setDisplayedAiPercentage(aiPercentage);
        }
      }, 40); // tốc độ nhảy, có thể chỉnh lại cho mượt hơn
      return () => clearInterval(intervalRef.current);
    } else {
      setDisplayedAiPercentage(aiPercentage ?? 0);
    }
  }, [aiPercentage]);

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
            value={displayedAiPercentage + "%"}
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
            className="flex-1 px-6 py-2 bg-blue-100 text-blue-700 border border-blue-600 rounded font-semibold hover:bg-blue-600 hover:text-white transition disabled:opacity-60"
            onClick={handleSave}
            disabled={loadingSave || loadingFeedback}
          >
            {loadingSave ? "Saving..." : "Save"}
          </button>
          <button
            className="flex-1 px-6 py-2 bg-green-100 text-green-700 border border-green-600 rounded font-semibold hover:bg-green-600 hover:text-white transition disabled:opacity-60"
            onClick={handleSendFeedback}
            disabled={loadingFeedback || loadingSave}
          >
            {loadingFeedback ? "Sending..." : "Send Feedback"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewSidebar;