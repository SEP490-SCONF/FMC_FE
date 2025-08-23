import { apiService } from "./ApiService";

const API_URL = "/Schedule";

// 🔍 Lấy tất cả schedule theo conferenceId
export const getSchedulesByConference = async (conferenceId) => {
  return apiService.get(`${API_URL}/conference/${conferenceId}`);
};

// 🔍 Lấy 1 schedule theo scheduleId
export const getScheduleById = async (scheduleId) => {
  return apiService.get(`${API_URL}/${scheduleId}`);
};

export const getSchedulesByTimeline = async (timelineId) => {
  return apiService.get(`${API_URL}/timeline/${timelineId}`);
};

// ➕ Tạo schedule mới (POST)
export const createSchedule = async (data) => {
  const formData = new FormData();
  formData.append("timeLineId", data.timeLineId);
  formData.append("sessionTitle", data.sessionTitle || "");
  formData.append("location", data.location || "");
  formData.append("paperId", data.paperId ?? ""); // tránh null
  formData.append("presenterId", data.presenterId ?? "");
  formData.append("presentationStartTime", data.presentationStartTime || "");
  formData.append("presentationEndTime", data.presentationEndTime || "");

  return apiService.post(`${API_URL}/add`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ✏️ Cập nhật schedule theo scheduleId (PUT)
export const updateSchedule = async (scheduleId, scheduleData) => {
  const formData = new FormData();
  formData.append("timeLineId", scheduleData.timeLineId);
  formData.append("sessionTitle", scheduleData.sessionTitle || "");
  formData.append("location", scheduleData.location || "");
  formData.append("paperId", scheduleData.paperId ?? "");
  formData.append("presenterId", scheduleData.presenterId ?? "");
  formData.append(
    "presentationStartTime",
    scheduleData.presentationStartTime || ""
  );
  formData.append(
    "presentationEndTime",
    scheduleData.presentationEndTime || ""
  );

  return apiService.put(`${API_URL}/edit/${scheduleId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ❌ Xóa schedule theo scheduleId (DELETE)
export const deleteSchedule = async (scheduleId) => {
  return apiService.delete(`${API_URL}/delete/${scheduleId}`);
};

export const countSchedulesByTimeline = async (timelineId) => {
  return apiService.get(`${API_URL}/timeline/${timelineId}/count`);
};