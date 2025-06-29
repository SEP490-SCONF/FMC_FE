import { apiService } from "./ApiService";

// Lấy tất cả ConferenceTopic
export const getAllConferenceTopics = async () => {
    return apiService.get("/ConferenceTopic");
};

// Thêm ConferenceTopic mới
export const addConferenceTopic = async (conferenceTopicDto) => {
    // conferenceTopicDto: { conferenceId, topicId }
    return apiService.post("/ConferenceTopic", conferenceTopicDto);
};

// Lấy tất cả topic theo conferenceId
export const getConferenceTopicsByConferenceId = async (conferenceId) => {
    return apiService.get(`/ConferenceTopic/conference/${conferenceId}`);
};

// Xóa ConferenceTopic theo conferenceId và topicId
export const deleteConferenceTopic = async (conferenceId, topicId) => {
    return apiService.delete(`/ConferenceTopic/${conferenceId}/${topicId}`);
};