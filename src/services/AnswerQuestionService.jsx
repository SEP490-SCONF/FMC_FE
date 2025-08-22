import { apiService } from "./ApiService";

// AnswerQuestion Services

// Lấy tất cả AnswerQuestion
export const getAllAnswerQuestions = async () => {
    return apiService.get("/AnswerQuestions");
};

// Lấy AnswerQuestion theo ID
export const getAnswerQuestionById = async (id) => {
    return apiService.get(`/AnswerQuestions/${id}`);
};

// Lấy AnswerQuestions theo ForumQuestionId (không phân trang)
export const getAnswerQuestionsByForumQuestionId = async (forumQuestionId) => {
    return apiService.get(`/AnswerQuestions/question/${forumQuestionId}`);
};

// Lấy AnswerQuestions theo ForumQuestionId với phân trang và tìm kiếm
export const getAnswerQuestionsPaginated = async (forumQuestionId, search, page = 1, pageSize = 10) => {
    const queryParams = new URLSearchParams({
        page: page,
        pageSize: pageSize,
        ...(search && { search: search })
    });
    
    return apiService.get(`/AnswerQuestions/question/${forumQuestionId}/paginated?${queryParams}`);
};

// Lấy AnswerQuestions theo UserId
export const getAnswerQuestionsByUserId = async (userId) => {
    return apiService.get(`/AnswerQuestions/user/${userId}`);
};

// Tạo mới AnswerQuestion (có thể là answer hoặc reply)
export const createAnswerQuestion = async (data) => {
    return apiService.post("/AnswerQuestions", data);
};

// Tạo reply cho một answer (helper function)
export const createReply = async (forumQuestionId, parentAnswerId, answerBy, answerContent) => {
    const data = {
        fqId: forumQuestionId,
        answerBy: answerBy,
        parentAnswerId: parentAnswerId,
        answer: answerContent
    };
    return apiService.post("/AnswerQuestions", data);
};

// Tạo answer chính (helper function)
export const createMainAnswer = async (forumQuestionId, answerBy, answerContent) => {
    const data = {
        fqId: forumQuestionId,
        answerBy: answerBy,
        answer: answerContent
    };
    return apiService.post("/AnswerQuestions", data);
};

// Cập nhật AnswerQuestion
export const updateAnswerQuestion = async (id, answerContent) => {
    const data = {
        answerId: id,
        answer: answerContent
    };
    return apiService.put(`/AnswerQuestions/${id}`, data);
};

// Xóa AnswerQuestion
export const deleteAnswerQuestion = async (id) => {
    return apiService.delete(`/AnswerQuestions/${id}`);
};

// Like/Unlike answer
export const toggleAnswerLike = async (answerId, userId) => {
    const data = {
        answerId: answerId,
        userId: userId
    };
    return apiService.post("/AnswerQuestions/like", data);
};

// Get like stats with user status
export const getAnswerLikes = async (answerId, currentUserId = null) => {
    const queryParams = new URLSearchParams();
    if (currentUserId) {
        queryParams.append('currentUserId', currentUserId);
    }
    
    const url = `/AnswerQuestions/${answerId}/likes${queryParams.toString() ? `?${queryParams}` : ''}`;
    return apiService.get(url);
};

// Tìm kiếm AnswerQuestions với các filter
export const searchAnswerQuestions = async (searchTerm, forumQuestionId, userId, page = 1, pageSize = 10) => {
    const queryParams = new URLSearchParams({
        page: page,
        pageSize: pageSize,
        ...(searchTerm && { search: searchTerm }),
        ...(forumQuestionId && { forumQuestionId: forumQuestionId }),
        ...(userId && { userId: userId })
    });
    
    return apiService.get(`/AnswerQuestions/search?${queryParams}`);
};

// Lấy replies của một answer cụ thể
export const getRepliesByParentAnswerId = async (parentAnswerId) => {
    return apiService.get(`/AnswerQuestions/parent/${parentAnswerId}/replies`);
};

// Lấy summary của AnswerQuestion (nếu có endpoint này)
export const getAnswerQuestionSummary = async (id) => {
    return apiService.get(`/AnswerQuestions/${id}/summary`);
};

// Helper functions for better UX

// Lấy thread đầy đủ (parent + all replies)
export const getAnswerThread = async (parentAnswerId) => {
    try {
        const parentAnswer = await getAnswerQuestionById(parentAnswerId);
        const replies = await getRepliesByParentAnswerId(parentAnswerId);
        
        return {
            parent: parentAnswer.data,
            replies: replies.data
        };
    } catch (error) {
        throw error;
    }
};

// Lấy AnswerQuestions với thống kê
export const getAnswerQuestionsWithStats = async (forumQuestionId, page = 1, pageSize = 10) => {
    try {
        const response = await getAnswerQuestionsPaginated(forumQuestionId, null, page, pageSize);
        
        // Thêm thống kê tổng quan
        const stats = {
            totalAnswers: response.data.totalCount,
            totalPages: response.data.totalPages,
            currentPage: response.data.currentPage,
            hasMorePages: response.data.hasNextPage
        };
        
        return {
            ...response,
            stats: stats
        };
    } catch (error) {
        throw error;
    }
};

// Batch operations
export const createMultipleAnswers = async (answers) => {
    const promises = answers.map(answer => createAnswerQuestion(answer));
    return Promise.allSettled(promises);
};

// Export grouped services for better organization
export const answerQuestionServices = {
    // Basic CRUD
    getAll: getAllAnswerQuestions,
    getById: getAnswerQuestionById,
    create: createAnswerQuestion,
    update: updateAnswerQuestion,
    delete: deleteAnswerQuestion,
    
    // Specific queries
    getByForumQuestion: getAnswerQuestionsByForumQuestionId,
    getByUser: getAnswerQuestionsByUserId,
    getPaginated: getAnswerQuestionsPaginated,
    
    // Helper functions
    createReply: createReply,
    createMainAnswer: createMainAnswer,
    getThread: getAnswerThread,
    getWithStats: getAnswerQuestionsWithStats,
    
    // Like functionality
    toggleLike: toggleAnswerLike,
    getLikes: getAnswerLikes,
    
    // Search & Filter
    search: searchAnswerQuestions
};
