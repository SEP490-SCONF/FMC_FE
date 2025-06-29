import { apiService } from "./ApiService";

// Lấy danh sách paper của user theo conference
export const getPapersByUserAndConference = (userId, conferenceId) => {
    return apiService.get(`/api/Papers/user/${userId}/conference/${conferenceId}`);
};

// Lấy tất cả paper
export const getAllPapers = () => {
    return apiService.get("/api/Papers");
};