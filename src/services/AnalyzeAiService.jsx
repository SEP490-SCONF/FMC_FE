// src/services/AnalyzeAiService.jsx
import axios from "axios";

const API_URL = "https://ai-detector-guxq-67835dd3.mt-guc1.bentoml.ai/predict";

const AnalyzeAiService = {
    analyzeDocument: async (reviewId, chunks) => {
        try {
            // Ghép tất cả text từ chunks thành một chuỗi
            const fullText = chunks.map((c) => c.text || c.RawText || "").join(" ");

            const response = await axios.post(API_URL, {
                req: { // Wrap the payload in a 'req' key
                    text: "...",
                    max_chunk_tokens: 400,
                    stride: 50,
                }
            }, {
                withCredentials: true,  // Add this for credential support
            });

            const data = response.data;
            console.log("AnalyzeAiService response:", data);

            // Trả về % AI tổng
            return {
                percentAi: Math.round((data.ai_probability || 0) * 100),
            };
        } catch (error) {
            console.error("AnalyzeAiService.analyzeDocument - error:", error);
            throw error;
        }
    },
};

export default AnalyzeAiService;