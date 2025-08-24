// src/services/AnalyzeAiService.jsx
import { apiService } from './ApiService';

const AnalyzeAiService = {
    analyzeDocument: async (reviewId, chunks) => {
        try {
            const response = await apiService.post('/AnalyzeAi', {
                ReviewId: reviewId,
                Chunks: chunks,
            });
            return response;
        } catch (error) {
            console.error('Failed to analyze document:', {
                message: error.message,
                response: error.response?.data,
                config: error.config,
            });
            throw error;
        }
    },
};

// Hàm countWords (copy từ ReviewContent.jsx để tái sử dụng)
const countWords = (text) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

export default AnalyzeAiService;