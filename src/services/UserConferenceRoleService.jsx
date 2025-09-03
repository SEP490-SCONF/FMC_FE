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
// Lấy danh sách reviewer (role 3) của hội thảo
export const getConferenceReviewers = async (
  conferenceId,
  { page = 1, pageSize = 10, search = "" } = {}
) => {
  let url = `/UserConferenceRoles/conference/${conferenceId}/roles-reviewer?page=${page}&pageSize=${pageSize}`;
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
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

// Lấy thông tin committee form (GET /UserConferenceRoles/{id}/form?token=...)
export const getCommitteeForm = async (id, token) => {
  return apiService.get(`/UserConferenceRoles/${id}/form?token=${encodeURIComponent(token)}`);
};

// Gửi thông tin hoàn thiện committee form (POST /UserConferenceRoles/{id}/complete)
export const completeCommitteeForm = async (id, data) => {
  return apiService.post(`/UserConferenceRoles/${id}/complete`, data);
};

// Lấy danh sách committee theo conferenceId (GET /UserConferenceRoles/conference/{conferenceId}/committee)
export const getCommitteeByConference = async (conferenceId) => {
  return apiService.get(`/UserConferenceRoles/conference/${conferenceId}/committee`);
};
// Lấy UserConferenceRole theo userId
export const getUserConferenceRolesByUserId = async (userId) => {
    return apiService.get(`/UserConferenceRoles/user/${userId}`);
};

export const getReviewerAssignedPaperCount = async (conferenceId, reviewerId) => {
  return apiService.get(
    `/UserConferenceRoles/reviewers/${reviewerId}/assigned-paper-count?conferenceId=${conferenceId}`
  );
};

export const resolveAuthors = async (emails) => {
  return apiService.post("/UserConferenceRoles/resolve-authors", {
    emails: emails,
  });
};


export const getUserRolesInConference = async (userId, conferenceId) => {
  return apiService.get(`/UserConferenceRoles/user/${userId}/conference/${conferenceId}/roles`);
};
