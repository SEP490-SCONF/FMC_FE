// src/services/AnalyzeAiService.jsx
import { apiService } from './ApiService';

const AnalyzeAiService = {
    analyzeDocument: async (reviewId, rawText) => {
        try {
            const response = await apiService.post('/AnalyzeAi', {
                ReviewId: reviewId,
                RawText: rawText,
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

export default AnalyzeAiService;