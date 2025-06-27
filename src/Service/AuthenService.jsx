import { apiService } from "./ApiService";

export const loginWithGoogle = async (credential) => {
  try {
    const data = await apiService.post("/GoogleLogin/Login", { idToken: credential });
    localStorage.setItem("accessToken", data.accessToken);
    return data;
  } catch (err) {
    throw err;
  }
};