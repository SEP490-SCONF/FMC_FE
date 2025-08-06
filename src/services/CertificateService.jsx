import { apiService } from "./ApiService";

const API_URL = "/Certificates";

// 📄 Lấy tất cả certificate
export const getAllCertificates = async () => {
  return apiService.get(API_URL);
};

// 🔍 Lấy certificate theo ID
export const getCertificateById = async (id) => {
  return apiService.get(`${API_URL}/${id}`);
};

// 🔍 Lấy certificate theo userId
export const getCertificatesByUserId = async (userId) => {
  return apiService.get(`${API_URL}/user/${userId}`);
};

// 🔍 Lấy certificate theo conferenceId
export const getCertificatesByConferenceId = async (conferenceId) => {
  return apiService.get(`${API_URL}/conference/${conferenceId}`);
};

// 🎓 Tạo certificate cho paper đã được duyệt
export const generateCertificatesForPaper = async (paperId) => {
  return apiService.post(`${API_URL}/generate-for-paper`, paperId);
};

// 🎓 Tạo certificate thủ công theo RegId
export const generateCertificate = async (certificateGenerateDto) => {
  return apiService.post(`${API_URL}/generate`, certificateGenerateDto);
};

// 🧾 Lấy URL của certificate
export const getCertificateUrl = async (id) => {
  return apiService.get(`${API_URL}/${id}/url`);
};

// 📥 Tải ảnh certificate
export const downloadCertificateImage = async (id) => {
  return apiService.get(`${API_URL}/${id}/download-image`, {}, { responseType: "blob" });
};

// 📥 Tải file PDF certificate
export const downloadCertificatePdf = async (id) => {
  return apiService.get(`${API_URL}/${id}/download`, {}, { responseType: "blob" });
};

// ✅ Xác thực certificate theo số
export const verifyCertificate = async (certificateNumber) => {
  return apiService.post(`${API_URL}/verify`, certificateNumber);
};

// ✏️ Cập nhật certificate
export const updateCertificate = async (id, updateDto) => {
  return apiService.put(`${API_URL}/${id}`, updateDto);
};

// ❌ Xóa certificate
export const deleteCertificate = async (id) => {
  return apiService.delete(`${API_URL}/${id}`);
};
