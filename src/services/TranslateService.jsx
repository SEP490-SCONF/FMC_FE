import { apiService } from "./ApiService";

const API_URL = "/Translation";

export const translateHighlightedText = async (text, targetLang = "en-US") => {
  // chuẩn bị body JSON
  const body = {
    Text: text,
    TargetLanguage: targetLang,
  };

  const res = await apiService.post(`${API_URL}/translate-highlight`, body, {
    headers: { "Content-Type": "application/json" },
  });

  console.log("API response:", res);
  return res?.translatedText || "";
};
