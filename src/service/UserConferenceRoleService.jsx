import apiService from "./ApiService";
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
// Lấy danh sách reviewer (role 3) của hội thảo
export const getConferenceReviewers = async (conferenceId, { page = 1, pageSize = 10, search = "" } = {}) => {
    let url = `/UserConferenceRoles/conference/${conferenceId}/roles-reviewer?$top=${pageSize}&$skip=${(page - 1) * pageSize}`;
    if (search) {
        url += `&$filter=contains(Name,'${encodeURIComponent(search)}') or contains(Email,'${encodeURIComponent(search)}')`;
    }
    return apiService.get(url);
};

export const changeUserConferenceRole = async (data) => {
    // data là UserConferenceRoleChangeRoleDto
    return apiService.put("/UserConferenceRoles/change-role", data);
};

// Xóa UserConferenceRole theo id
export const deleteUserConferenceRole = async (id) => {
    return apiService.delete(`/UserConferenceRoles/${id}`);
};

// Lấy danh sách conference theo userId và roleName
export const getConferencesByUserAndRole = async (userId, roleName) => {
    return apiService.get(`/UserConferenceRoles/user/${userId}/conferences/${roleName}`);
};