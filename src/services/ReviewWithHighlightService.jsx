import { apiService } from "./ApiService";

// Thêm mới Review + Highlight + Comment
export const addReviewWithHighlightAndComment = (data) =>
    apiService.post("/Review/WithHighlightAndComment", data, {
        headers: { "Content-Type": "multipart/form-data" },
    });

// Cập nhật Review + Highlight + Comment
export const updateReviewWithHighlightAndComment = (reviewId, data) =>
    apiService.put(`/Review/WithHighlightAndComment/${reviewId}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });

// Lấy chi tiết Review + Highlight + Comment theo reviewId
export const getReviewWithHighlightAndComment = (reviewId) =>
    apiService.get(`/Review/WithHighlightAndComment/${reviewId}`);

// Xóa Highlight + Comment theo highlightId
export const deleteReviewWithHighlightAndComment = (highlightId) =>
    apiService.delete(`/Review/DeletWithHighlightAndComment/${highlightId}`);