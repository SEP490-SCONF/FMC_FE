import { apiService } from "./ApiService";



// Lấy danh sách bài báo được giao cho reviewer
export const getReviewerAssignments = async (reviewerId, params = {}, options = {}) => {
    return apiService.get(
        `/ReviewerAssignment/reviewer/${reviewerId}`,
        params,
        options
    );
};