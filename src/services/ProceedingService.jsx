import { apiService } from "./ApiService";

const API_URL = "/Proceeding";

// 🔍 Lấy tất cả proceedings (nếu có endpoint, hoặc dùng riêng lẻ theo conference)
export const getProceedingsByConference = async (conferenceId) => {
  return apiService.get(`${API_URL}/papers/${conferenceId}`);
};

// 🔍 Lấy 1 proceeding theo ID
export const getProceedingById = async (id) => {
  return apiService.get(`${API_URL}/${id}`);
};

// ➕ Tạo proceeding mới (POST) với form data
export const createProceeding = async (formData) => {
  // formData là instance của FormData, gồm các field: ConferenceId, Title, Description, PaperIds, CoverImageFile, PublishedBy, Doi
  return apiService.post(`${API_URL}/create`, formData);
};

// ✏️ Cập nhật proceeding theo ID (PUT)
export const updateProceeding = async (id, proceedingData) => {
  // proceedingData là object JSON gồm các field có thể cập nhật: Title, Description, FilePath, Status, Version, Doi
  return apiService.put(`${API_URL}/update/${id}`, proceedingData);
};

// ⬇️ Download file proceeding
export const downloadProceeding = async (conferenceId) => {
  return apiService.get(`${API_URL}/download/${conferenceId}`);
};
