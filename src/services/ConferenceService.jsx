import { apiService } from "./ApiService";

const API_URL = "/Conferences";

export const getConferences = async () => {
    return apiService.get(API_URL, {}, { public: true });
};
export const searchConferences = async ({ search, filter, skip = 0, top = 10 }) => {
  let query = [];
  if (search) query.push(`$search=${encodeURIComponent(search)}`);
  if (filter) query.push(`$filter=${filter}`);
  if (typeof skip === "number") query.push(`$skip=${skip}`);
  if (typeof top === "number") query.push(`$top=${top}`);
  
  const queryString = query.length ? "?" + query.join("&") : "";
  return apiService.get(`/Conferences${queryString}`);
};

export const getConferenceById = async (id) => {
    return apiService.get(`${API_URL}/${id}`);
};

export const createConference = async (data) => {
    return apiService.post(API_URL, data);
};

export const updateConference = async (id, data) => {
    return apiService.put(`${API_URL}/${id}`, data);
};

export const updateConferenceStatus = async (id, statusData) => {
    return apiService.post(`${API_URL}/${id}/status`, statusData);
};

export const getConferencesCount = async () => {
    return apiService.get(`${API_URL}/count`);
};