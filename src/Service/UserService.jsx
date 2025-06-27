import { apiService } from "./ApiService";

export const getUserInformation = () => {
  return apiService.get("/User/Information");
};

export const getUserProfile = (id) => {
  return apiService.get(`/UserProfile/${id}`);
};