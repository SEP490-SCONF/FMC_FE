import { apiService } from "./ApiService";

// GET: /api/conferences/{conferenceId}/fees
export const getFeesByConferenceId = async (conferenceId) => {
  return apiService.get(`/conferences/${conferenceId}/fees`);
};

// GET: /api/fees/{feeDetailId}
export const getFeeDetailById = async (feeDetailId) => {
  return apiService.get(`/fees/${feeDetailId}`);
};

// POST: /api/conferences/{conferenceId}/fees
export const createFeeDetail = async (conferenceId, data) => {
  return apiService.post(`/conferences/${conferenceId}/fees`, data);
};

// PUT: /api/fees/{feeDetailId}
export const updateFeeDetail = async (feeDetailId, data) => {
  return apiService.put(`/fees/${feeDetailId}`, data);
};

// GET: /api/feetypes
export const getAllFeeTypes = async () => {
  return apiService.get(`/feetypes`);
};