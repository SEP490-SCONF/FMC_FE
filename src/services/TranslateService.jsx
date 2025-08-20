import { apiService } from "./ApiService";

const API_URL = "/Translation";

export const translateHighlightedText = async (text, targetLang = "en-US") => {
  const formData = new FormData();
  formData.append("Text", text);           
  formData.append("TargetLanguage", targetLang);

  const res = await apiService.post(`${API_URL}/translate-highlight`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  // Trả về đúng thuộc tính TranslatedText
  return res.data?.TranslatedText || "";
};
