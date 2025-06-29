import { apiService } from "./ApiService";

// Lấy danh sách reviewer (role 3) của hội thảo
export const getConferenceReviewers = async (conferenceId, params = {}, options = {}) => {
    return apiService.get(
        `/UserConferenceRoles/conference/${conferenceId}/roles-reviewer`,
        params,
        options
    );
};

// Gán reviewer cho paper
export const assignReviewerToPaper = async (paperId, reviewerId) => {
    return apiService.post(
        "/ReviewerAssignment",
        { paperId, reviewerId }
    );
};

export const updateReviewerAssignment = async (assignmentId, paperId, reviewerId) => {
    return apiService.put(
        `/ReviewerAssignment/${assignmentId}`,
        { paperId, reviewerId }
    );

};
// Lấy danh sách bài báo được giao cho reviewer
export const getReviewerAssignments = async (reviewerId, params = {}, options = {}) => {
    return apiService.get(
        `/ReviewerAssignment/reviewer/${reviewerId}`,
        params,
        options
    );
};