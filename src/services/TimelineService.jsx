import { apiService } from "./ApiService";

const API_URL = "/Timelines";

// 🔍 Lấy tất cả timeline của một hội thảo
export const getTimelinesByConferenceId = async (conferenceId) => {
  return apiService.get(`${API_URL}/conference/${conferenceId}`);
};

// ➕ Tạo timeline mới
export const createTimeline = async (formData) => {
  return apiService.post(API_URL, formData, { isFormData: true });
};

// ✏️ Cập nhật timeline
export const updateTimeline = async (timelineId, formData) => {
  return apiService.put(`${API_URL}/${timelineId}`, formData, { isFormData: true });
};

// ❌ Xóa timeline
export const deleteTimeline = async (timelineId) => {
  return apiService.delete(`${API_URL}/${timelineId}`);
};

// 🧪 Test Hangfire job (tùy chọn, để test hệ thống)
export const testHangfireJob = async () => {
  return apiService.get(`${API_URL}/test-hangfire-job`);
};
