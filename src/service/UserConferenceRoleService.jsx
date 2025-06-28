import { apiService } from "./ApiService";

// Lấy tất cả UserConferenceRole
export const getAllUserConferenceRoles = async () => {
    return apiService.get("/UserConferenceRoles");
};

// Lấy UserConferenceRole theo id
export const getUserConferenceRoleById = async (id) => {
    return apiService.get(`/UserConferenceRoles/${id}`);
};

// Lấy UserConferenceRole theo conferenceId
export const getUserConferenceRolesByConferenceId = async (conferenceId) => {
    return apiService.get(`/UserConferenceRoles/conference/${conferenceId}`);
};

// Tạo mới UserConferenceRole
export const createUserConferenceRole = async (data) => {
    // data là UserConferenceRoleCreateDto
    return apiService.post("/UserConferenceRoles", data);
};

// Lấy danh sách thành viên (role 3 hoặc 4) của hội thảo
export const getConferenceMembersByRoles = async (conferenceId) => {
    return apiService.get(`/UserConferenceRoles/conference/${conferenceId}/roles/members`);
};


export const changeUserConferenceRole = async (data) => {
    // data là UserConferenceRoleChangeRoleDto
    return apiService.put("/UserConferenceRoles/change-role", data);
};

// Xóa UserConferenceRole theo id
export const deleteUserConferenceRole = async (id) => {
    return apiService.delete(`/UserConferenceRoles/${id}`);
};