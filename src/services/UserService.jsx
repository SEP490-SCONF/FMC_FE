import { apiService } from "./ApiService";

export const getUserInformation = () => {
  return apiService.get("/User/Information");
};



// Lấy thông tin hồ sơ người dùng theo ID
export const getUserProfile = (id) => {
  return apiService.get(`/UserProfile/${id}`);
};

// Cập nhật hồ sơ người dùng (name, avatarUrl)
export const updateUserProfile = (id, data) => {
  return apiService.put(`/UserProfile/${id}/profile`, data, {
    headers: {
      "Content-Type": "multipart/form-data", 
    },
  });
};


export const getUsersByRole = (roleId) => {
  return apiService.get(`/CRUDUser/role/${roleId}`);
};