import React, { useState, useEffect } from 'react';
import { getForumById, getForumQuestionsPaginated, createForumQuestion, getForumsByConferenceId, toggleQuestionLike } from '../services/ForumService';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserInformation } from '../services/UserService';

const Forum = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('list');
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    description: '',
    question: '',
    askBy: null // Will be set from userInfo
  });

  // API state
  const [forumData, setForumData] = useState(null);
  const [questionsData, setQuestionsData] = useState({
    questions: [],
    totalCount: 0,
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
    searchTerm: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [userInfo, setUserInfo] = useState(null); // Current logged in user info
  const [likingQuestions, setLikingQuestions] = useState(new Set()); // Track which questions are being liked/unliked
  const pageSize = 10;

  // Load forum data and questions on component mount
  useEffect(() => {
    loadUserInformation();
    if (id) {
      loadForumData();
    }
  }, [id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadQuestions();
    }, 1000);

    return () => clearTimeout(timer);
  }, [forumData, currentPage, searchTerm]);

  const loadUserInformation = async () => {
    try {
      const response = await getUserInformation();
      setUserInfo(response);
    } catch (error) {
      console.error('Error loading user information:', error);
      // If can't get user info, user is not logged in
      setUserInfo(null);
    }
  };

  const loadForumData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getForumsByConferenceId(id);
      // console.log('Forum data loaded:', response); 
      setForumData(response);
    } catch (error) {
      console.error('Error loading forum data:', error);
      setError('Unable to load forum information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getForumQuestionsPaginated(forumData.forumId, searchTerm, currentPage, pageSize);
      setQuestionsData(response);
    } catch (error) {
      console.error('Error loading questions:', error);
      setError('Unable to load questions list. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadQuestions();
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleQuestionClick = (question) => {
    navigate(`/conference/${id}/forum/question/${question.fqId}`);
  };

  const handleBackToList = () => {
    setCurrentView('list');
  };

  const handleCreateQuestion = () => {
    if (!userInfo) {
      navigate('/');
      return;
    }
    setCurrentView('create');
    setNewQuestion({
      title: '',
      description: '',
      question: '',
      askBy: userInfo.userId
    });
  };

  const handleBackFromCreate = () => {
    setCurrentView('list');
    setNewQuestion({
      title: '',
      description: '',
      question: '',
      askBy: userInfo ? userInfo.userId : null
    });
  };

  const handleSubmitQuestion = async () => {
    if (!userInfo) {
      navigate('/');
      return;
    }

    if (newQuestion.title.trim() && newQuestion.description.trim() && newQuestion.question.trim()) {
      try {
        setLoading(true);
        const questionData = {
          askBy: userInfo.userId,
          forumId: forumData.forumId,
          title: newQuestion.title,
          description: newQuestion.description,
          question: newQuestion.question
        };

        await createForumQuestion(questionData);

        // Reload questions after creating new one
        await loadQuestions();

        setCurrentView('list');
        setNewQuestion({
          title: '',
          description: '',
          question: '',
          askBy: userInfo.userId
        });
      } catch (error) {
        console.error('Error creating question:', error);
        alert('An error occurred while creating the question. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLikeQuestion = async (e, questionId) => {
    e.stopPropagation(); // Prevent navigating to question detail

    if (!userInfo) {
      navigate('/');
      return;
    }

    // Prevent multiple simultaneous like requests for the same question
    if (likingQuestions.has(questionId)) return;

    try {
      setLikingQuestions(prev => new Set(prev.add(questionId)));

      // Optimistically update UI
      setQuestionsData(prevData => ({
        ...prevData,
        questions: prevData.questions.map(question => {
          if (question.fqId === questionId) {
            const wasLiked = question.isLikedByCurrentUser;
            return {
              ...question,
              isLikedByCurrentUser: !wasLiked,
              totalLikes: question.totalLikes + (wasLiked ? -1 : 1)
            };
          }
          return question;
        })
      }));

      // Make API call
      await toggleQuestionLike(questionId, userInfo.userId);

    } catch (error) {
      console.error('Error toggling question like:', error);

      // Revert optimistic update on error
      setQuestionsData(prevData => ({
        ...prevData,
        questions: prevData.questions.map(question => {
          if (question.fqId === questionId) {
            const currentLiked = question.isLikedByCurrentUser;
            return {
              ...question,
              isLikedByCurrentUser: !currentLiked,
              totalLikes: question.totalLikes + (currentLiked ? 1 : -1)
            };
          }
          return question;
        })
      }));

      alert('An error occurred while liking/unliking the question. Please try again.');
    } finally {
      setLikingQuestions(prev => {
        const newSet = new Set(prev);
        newSet.delete(questionId);
        return newSet;
      });
    }
  };
  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center py-8">
            <div className="text-red-600 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">An error occurred</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null);
                if (id) {
                  loadForumData();
                  //loadQuestions();
                }
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state when no forumId
  if (!id) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center py-8">
            <p className="text-gray-600">Invalid Forum ID.</p>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'create') {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={handleBackFromCreate}
              className="text-gray-600 hover:text-gray-800 mb-4"
            >
              ← Back to list
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Create new question
            </h2>
          </div>

          {/* Create Question Form */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question title
                </label>
                <input
                  type="text"
                  value={newQuestion.title}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Enter your question title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short description
                </label>
                <input
                  type="text"
                  value={newQuestion.description}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Brief description of your question"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed question content
                </label>
                <textarea
                  value={newQuestion.question}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, question: e.target.value }))}
                  placeholder="Describe your question in detail..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-blue-500"
                  rows="6"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSubmitQuestion}
                  style={{ backgroundColor: '#1447e6' }}
                  disabled={!newQuestion.title.trim() || !newQuestion.description.trim() || !newQuestion.question.trim() || loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Create question'}
                </button>
                <button
                  onClick={handleBackFromCreate}
                  disabled={loading}
                  className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-6">
        {/* Forum Header */}
        <div className="mb-8 pb-4 border-b border-gray-200">
          <h2 className="text-base font-medium text-gray-800 mb-1">
            {forumData ? forumData.title : 'Loading...'}
          </h2>
          <p className="text-gray-600">
            {forumData ? `Created: ${formatDate(forumData.createdAt)} • Total questions: ${forumData.totalQuestions}` : 'Loading forum information...'}
          </p>
        </div>

        {/* Search and Create Question */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
          <form onSubmit={handleSearch} className="flex flex-1 max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search questions..."
              className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-gray-600 text-white px-4 py-3 rounded-r-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Search
            </button>
          </form>

          {userInfo ? (
            <button
              onClick={handleCreateQuestion}
              style={{ backgroundColor: '#1447e6' }}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Create new question
            </button>
          ) : (
            <button
              onClick={() => navigate('/')}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Login to create question
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        )}

        {/* Questions List */}
        {!loading && (
          <div className="space-y-6">
            {questionsData.questions && questionsData.questions.length > 0 ? (
              questionsData.questions.map((question) => (
                <div
                  key={question.fqId}
                  className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleQuestionClick(question)}
                >
                  {/* Question Header */}
                  <div className="mb-4">
                    <h2 style={{ fontSize: "30px", fontWeight: "500" }} className="text-gray-800">
                      {question.title}
                    </h2>
                    <p className="text-sm text-gray-600 mb-3">{question.description}</p>
                    <div className="text-xs text-gray-500 mb-3">
                      Author: {question.askerName} • Created: {formatDate(question.createdAt)}
                    </div>
                    <div className="flex gap-6 text-sm text-gray-600">
                      <span>{question.totalAnswers} answers</span>
                      <button
                        onClick={(e) => handleLikeQuestion(e, question.fqId)}
                        disabled={!userInfo || likingQuestions.has(question.fqId)}
                        className={`transition-colors ${question.isLikedByCurrentUser
                            ? 'text-blue-600 hover:text-blue-800'
                            : 'text-gray-600 hover:text-blue-600'
                          } ${!userInfo ? 'cursor-not-allowed opacity-50' : ''}`}
                        title={userInfo ? (question.isLikedByCurrentUser ? 'Unlike question' : 'Like question') : 'Login to like'}
                      >
                        {likingQuestions.has(question.fqId) ? (
                          <span>⏳ {question.totalLikes} likes</span>
                        ) : (
                          <span>
                            {question.isLikedByCurrentUser ? '❤️' : '🤍'} {question.totalLikes} likes
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Recent Answers */}
                  {question.recentAnswers && question.recentAnswers.length > 0 && (
                    <div className="space-y-3">
                      <h5 className="font-medium text-gray-700 text-sm">Latest answers:</h5>
                      {question.recentAnswers.slice(0, 2).map((answer) => (
                        <div key={answer.answerId} className="bg-gray-50 p-3 rounded">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium text-sm text-gray-800">{answer.answererName}</span>
                            <span className="text-xs text-gray-500">{formatDate(answer.createdAt)}</span>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{answer.answer}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {questionsData.searchTerm ? 'No matching questions found.' : 'No questions yet.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && questionsData.totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!questionsData.hasPreviousPage}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>

            <span className="px-4 py-2 text-sm text-gray-600">
              Page {questionsData.currentPage} / {questionsData.totalPages}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!questionsData.hasNextPage}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Forum;