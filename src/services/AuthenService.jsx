import { apiService } from "./ApiService";
 // hoặc đúng path của bạn

export const loginWithGoogle = async (credential) => {
  try {
    const data = await apiService.post("/GoogleLogin/Login", {
      idToken: credential,
    });
   
    return data;
  } catch (err) {
    throw err;
  }
};
export const logout = async () => {
  try {
    const res = await apiService.post("/GoogleLogin/Logout");
    
    return res;
  } catch (err) {
    throw err;
  }
};

export const refreshToken = async () => {
  try {
    const res = await apiService.post("/GoogleLogin/RefreshToken", {}, { withCredentials: true });
    return res; 
  } catch (err) {
    throw err;
  }
};