import { apiService } from "./ApiService";

const BASE_URL = "/CallForPaper";

export const getCallForPapersByConferenceId = (conferenceId) => {
  return apiService.get(`${BASE_URL}/byconference/${conferenceId}`);
};

export const getCallForPaperById = (id) => {
  return apiService.get(`${BASE_URL}/${id}`);
};

export const createCallForPaper = (data) => {
  return apiService.post(BASE_URL, data); // gửi dưới dạng multipart/form-data
};

export const updateCallForPaper = (id, data) => {
  return apiService.put(`${BASE_URL}/${id}`, data);
};

export const deleteCallForPaper = (id) => {
  return apiService.delete(`${BASE_URL}/${id}`);
};
