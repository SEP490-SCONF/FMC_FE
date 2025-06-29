import { apiService } from "./ApiService";

export const uploadRevision = async (formData) => {
  // formData là FormData chứa các trường: PdfFile, PaperId, ...
  return await apiService.post(
    "/PaperRevisions/upload-revision",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};
export const getPdfUrlByReviewId = (reviewId) =>
    apiService.get(`/PaperRevisions/PaperRevisionUrl/${reviewId}`);