// src/services/AnalyzeAiService.jsx
import { apiService } from './ApiService';

const AnalyzeAiService = {
    analyzeDocument: async (reviewId, chunks) => {
        console.log("AnalyzeAiService.analyzeDocument - request:", { reviewId, chunks });
        try {
            const response = await apiService.post('/AnalyzeAi', {
                reviewId,
                chunks
            });
            console.log("AnalyzeAiService.analyzeDocument - raw response:", response);
            return response;
        } catch (error) {
            console.error("AnalyzeAiService.analyzeDocument - error:", error);
            throw error;
        }
    },
};

// Hàm countWords (copy từ ReviewContent.jsx để tái sử dụng)
const countWords = (text) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

export default AnalyzeAiService;