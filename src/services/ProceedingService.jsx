import { apiService } from "./ApiService";

// Tạo proceeding từ paper đã được accept
export const createProceedingFromPaper = async (data) => {
    // data là ProceedingCreateFromPaperDto
    return apiService.post("/Proceedings/from-paper", data);
};

// Cập nhật proceeding
export const updateProceeding = async (data) => {
    // data là ProceedingUpdateDto
    return apiService.put("/Proceedings", data);
};

// Xóa proceeding theo ID
export const deleteProceeding = async (proceedingId) => {
    return apiService.delete(`/Proceedings/${proceedingId}`);
};

// Lấy chi tiết proceeding theo ID
export const getProceedingById = async (proceedingId) => {
    return apiService.get(`/Proceedings/${proceedingId}`);
};

// Lấy danh sách proceeding theo conferenceId
export const getProceedingsByConferenceId = async (conferenceId) => {
    return apiService.get(`/Proceedings/conference/${conferenceId}`);
};

// Lấy tất cả proceeding
export const getAllProceedings = async () => {
    return apiService.get("/Proceedings");
};
