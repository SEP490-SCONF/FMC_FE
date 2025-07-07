import { apiService } from "./ApiService";

// Lấy tất cả review
export const getAllReviews = async () => {
    return apiService.get("/Review");
};

// Lấy review theo ID
export const getReviewById = async (id) => {
    return apiService.get(`/Review/${id}`);
};

// Lấy review theo paperId
export const getReviewsByPaperId = async (paperId) => {
    return apiService.get(`/Review/paper/${paperId}`);
};

// Thêm review mới (dạng form-data)
export const addReview = async (formData) => {
    return apiService.post("/Review", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};

// Cập nhật review (dạng form-data)
export const updateReview = async (id, formData) => {
    return apiService.put(`/Review/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};

// Xóa review
export const deleteReview = async (id) => {
    return apiService.delete(`/Review/${id}`);
};

// Thêm review kèm highlight và comment (dạng form-data)
export const addReviewWithHighlightAndComment = async (formData) => {
    return apiService.post("/Review/WithHighlightAndComment", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};

// Cập nhật review kèm highlight và comment (dạng form-data)
export const updateReviewWithHighlightAndComment = async (reviewId, formData) => {
    return apiService.put(`/Review/WithHighlightAndComment/${reviewId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};

// Lấy chi tiết review kèm highlight và comment
export const getReviewWithHighlightAndComment = async (reviewId) => {
    return apiService.get(`/Review/WithHighlightAndComment/${reviewId}`);
};

// Lấy review theo assignmentId
export const getReviewByAssignmentId = async (assignmentId) => {
    return apiService.get(`/Review/assignment/${assignmentId}`);
};

// Lấy review theo revisionId
export const getReviewByRevisionId = async (revisionId) => {
    return apiService.get(`/Review/revision/${revisionId}`);
};

export const sendFeedback = async (reviewId) => {
    const formData = new FormData();
    formData.append("reviewId", reviewId);
    return apiService.post("/Review/SendFeedback", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};