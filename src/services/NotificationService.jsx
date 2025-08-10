import { apiService } from "./ApiService";



export const getNotificationsByUserId = async (userId) => {
    return await apiService.get(`/Notification/${userId}`);
};