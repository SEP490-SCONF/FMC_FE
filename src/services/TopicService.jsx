import { apiService } from "./ApiService";

const API_URL = "/Topics";

// 🔍 Lấy tất cả topic
export const getAllTopics = async () => {
  return apiService.get("/Topics", {}, { public: true });
};

// 🔍 Lấy 1 topic theo ID
export const getTopicById = async (id) => {
    return apiService.get(`${API_URL}/${id}`);
};

// ➕ Tạo topic mới (POST)
export const createTopic = async (topicData) => {
    return apiService.post(API_URL, topicData);
};

// ✏️ Cập nhật topic theo ID (PUT)
export const updateTopic = async (id, topicData) => {
    return apiService.put(`${API_URL}/${id}`, topicData);
};

// ❌ Xóa topic theo ID (DELETE)
export const deleteTopic = async (id) => {
    return apiService.delete(`${API_URL}/${id}`);
};
