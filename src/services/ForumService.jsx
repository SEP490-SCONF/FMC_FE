import { apiService } from "./ApiService";

// Lấy tất cả Forum
export const getAllForums = async () => {
    return apiService.get("/Forums");
};

// Lấy Forum theo ID
export const getForumById = async (id) => {
    return apiService.get(`/Forums/${id}`);
};

// Tạo mới Forum
export const createForum = async (data) => {
    return apiService.post("/Forums", data);
};

// Cập nhật Forum
export const updateForum = async (id, data) => {
    return apiService.put(`/Forums/${id}`, data);
};

// Xóa Forum
export const deleteForum = async (id) => {
    return apiService.delete(`/Forums/${id}`);
};

export const createForumQuestion = async ( data) => {
    return apiService.post(`/ForumQuestions`, data);
};

//get by conferenceId
export const getForumsByConferenceId = async (conferenceId) => {
    return apiService.get(`/Forums/conference/${conferenceId}`);
};

export const getForumQuestionsById = async (forumQuestionId) => {
    return apiService.get(`/ForumQuestions/${forumQuestionId}`);
};

export const getForumQuestionsByForumId = async (forumId) => {
    return apiService.get(`/ForumQuestions/forum/${forumId}`);
};

export const getForumQuestionsSummaryById = async (forumId) => {
    return apiService.get(`/ForumQuestions/${forumId}/summary`);
};

export const getForumQuestionsPaginated = async (forumId, search, page, pageSize) => {
    const queryParams = new URLSearchParams({
        page: page,
        pageSize: pageSize,
        ...(search && { search: search })
    });
    
    return apiService.get(`/ForumQuestions/forum/${forumId}/paginated?${queryParams}`);
};

// Like/Unlike question
export const toggleQuestionLike = async (fqId, userId) => {
    const data = { fqId: fqId, userId: userId };
    return apiService.post("/ForumQuestions/like", data);
};

// Get like stats with user status
export const getQuestionLikes = async (fqId, currentUserId = null) => {
    const queryParams = new URLSearchParams();
    if (currentUserId) {
        queryParams.append('currentUserId', currentUserId);
    }
    const url = `/ForumQuestions/${fqId}/likes${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return apiService.get(url);
};

// Check if user can moderate forum (delete any answers)
export const canModerate = async (conferenceId) => {
    return apiService.get(`/Forums/can-moderate/${conferenceId}`);
};
