import { apiService } from "../Service/ApiService";

const API_URL = "/ConferenceTopic";

export const getConferenceTopics = async () => {
    return await apiService.get(API_URL);
};

export const createConferenceTopic = async (data) => {
    return await apiService.post(API_URL, data);
};

export const deleteConferenceTopic = async (conferenceId, topicId) => {
    const url = `${API_URL}/${conferenceId}/${topicId}`;
    return await apiService.delete(url);
};