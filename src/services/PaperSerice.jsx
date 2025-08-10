    import { apiService } from "./ApiService";

    // Upload PDF
    export const uploadPaperPdf = async (formData) => {
        // formData là FormData chứa các trường của PaperUploadDto
        return apiService.post("/Papers/upload-pdf", formData);
    };

    // Lấy danh sách tất cả paper (OData query nếu cần)
    export const getPapers = async (query = "") => {
        // query là chuỗi query OData, ví dụ: "?$filter=IsPublished eq true"
        return apiService.get(`/Papers${query}`);
    };

    // Lấy chi tiết paper theo id
    export const getPaperById = async (paperId) => {
        return apiService.get(`/Papers/${paperId}`);
    };

    // Đánh dấu paper là deleted
    export const markPaperAsDeleted = async (paperId) => {
        return apiService.put(`/Papers/mark-as-deleted/${paperId}`);
    };

    // Cập nhật trạng thái xuất bản (IsPublished)
    export const updatePaperPublishStatus = async (paperId, isPublished) => {
        // isPublished là boolean
        return apiService.put(`/Papers/${paperId}/publish`, { isPublished });
    };

    // Lấy danh sách paper đã submitted theo conferenceId
    export const getSubmittedPapersByConferenceId = async (conferenceId, queryParams = "") => {
    const url = `/Papers/conference/${conferenceId}/status/submitted${queryParams}`;
    return apiService.get(url);
    };


    // Lấy danh sách paper theo userId và conferenceId
    export const getPapersByUserAndConference = async (userId, conferenceId) => {
        return apiService.get(`/Papers/user/${userId}/conference/${conferenceId}`);
    };
    // Lấy danh sách paper đã được publish theo conferenceId
    export const getPublishedPapersByConferenceId = (conferenceId) => {
    return apiService.get(`/Papers/conference/${conferenceId}/published`);
    };
    export const getPapersByConferenceWithFilter = async (conferenceId, query = "") => {
        return apiService.get(`/Papers/conference/${conferenceId}${query}`);
    };

    export const uploadAndSpellCheck = async (file) => {
  const formData = new FormData();
  formData.append("pdfFile", file);
  return apiService.post("/Papers/upload-and-spell-check", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};


