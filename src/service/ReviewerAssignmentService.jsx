import { apiService } from "./ApiService";

// Lấy danh sách reviewer (role 3) của hội thảo
export const getConferenceReviewers = async (conferenceId, params = {}, options = {}) => {
    return apiService.get(
        `/UserConferenceRoles/conference/${conferenceId}/roles-reviewer`,
        params,
        options
    );
};