import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getForumQuestionsById, toggleQuestionLike, canModerate } from '../services/ForumService';
import { 
    getAnswerQuestionsPaginated, 
    createMainAnswer, 
    createReply,
    updateAnswerQuestion,
    deleteAnswerQuestion,
    toggleAnswerLike
} from '../services/AnswerQuestionService';
import { getUserInformation } from '../services/UserService';

const ForumQuestionDetail = () => {
    const { id, questionId } = useParams(); // id = conferenceId, questionId = fqId
    const navigate = useNavigate();
    
    const [questionDetail, setQuestionDetail] = useState(null);
    const [answersData, setAnswersData] = useState({
        answers: [],
        totalCount: 0,
        currentPage: 1,
        pageSize: 10,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
        searchTerm: "",
        forumQuestionId: null,
        forumQuestionTitle: ""
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [newAnswer, setNewAnswer] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyContent, setReplyContent] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedReplies, setExpandedReplies] = useState(new Set()); // Track which answers have expanded replies
    const [repliesData, setRepliesData] = useState({}); // Store replies for each answer
    const [loadingReplies, setLoadingReplies] = useState(new Set()); // Track which replies are loading
    const [userInfo, setUserInfo] = useState(null); // Current logged in user info
    const [editingAnswer, setEditingAnswer] = useState(null); // Track which answer is being edited
    const [editContent, setEditContent] = useState(''); // Content for editing
    const [likedAnswers, setLikedAnswers] = useState(new Set()); // Track which answers user has liked
    const [likingAnswers, setLikingAnswers] = useState(new Set()); // Track which answers are being liked/unliked
    const [isQuestionLiked, setIsQuestionLiked] = useState(false); // Track if user liked the question
    const [likingQuestion, setLikingQuestion] = useState(false); // Track if question is being liked/unliked
    const [canUserModerate, setCanUserModerate] = useState(false); // Track if user can moderate (delete any answers)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null); // Track which answer is being confirmed for deletion
    const [sortBy, setSortBy] = useState('newest'); // Track sorting option: 'newest', 'oldest', 'likes'
    const [expandedAnswers, setExpandedAnswers] = useState(new Set()); // Track which answers have expanded replies
    const [openMenus, setOpenMenus] = useState(new Set()); // Track which answer menus are open
    const pageSize = 10;

    useEffect(() => {
        loadUserInformation();
        if (questionId) {
            loadQuestionDetail();
            loadAnswers();
        }
    }, [questionId]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (questionDetail) {
                loadAnswers();
                // Reload question detail when userInfo changes to get updated like status
                if (userInfo !== null) { // Only reload if userInfo is not null (after initial load)
                    loadQuestionDetail();
                }
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [currentPage, searchTerm, userInfo, sortBy]); // Add sortBy to dependencies

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.relative')) {
                setOpenMenus(new Set());
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const loadUserInformation = async () => {
        try {
            const response = await getUserInformation();
            console.log('User information loaded:', response);
            setUserInfo(response);
            
            // Check if user can moderate after getting user info
            if (response && id) {
                await checkModerationPermission();
            }
        } catch (error) {
            console.error('Error loading user information:', error);
            // If can't get user info, user is not logged in
            setUserInfo(null);
            setCanUserModerate(false);
        }
    };

    const checkModerationPermission = async () => {
        try {
            const response = await canModerate(id); // id is conferenceId
            setCanUserModerate(response === true || response?.canModerate === true);
        } catch (error) {
            console.error('Error checking moderation permission:', error);
            setCanUserModerate(false);
        }
    };

    const checkUserAuthentication = () => {
        if (!userInfo) {
            navigate('/');
            return false;
        }
        return true;
    };

    const loadQuestionDetail = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getForumQuestionsById(questionId);
            setQuestionDetail(response);
            
            // Set question like status from response if available
            if (response.isLikedByCurrentUser !== undefined) {
                console.log('response', response);
                console.log(' response.isLikedByCurrentUser', response.isLikedByCurrentUser);
                setIsQuestionLiked(response.isLikedByCurrentUser);
            }
        } catch (error) {
            console.error('Error loading question detail:', error);
            setError('Unable to load question details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const loadAnswers = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getAnswerQuestionsPaginated(questionId, searchTerm, currentPage, pageSize);
            
            // Sort answers based on selected option
            let sortedAnswers = [...response.answers];
            switch (sortBy) {
                case 'newest':
                    sortedAnswers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    break;
                case 'oldest':
                    sortedAnswers.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                    break;
                case 'likes':
                    sortedAnswers.sort((a, b) => b.totalLikes - a.totalLikes);
                    break;
                default:
                    // Keep original order
                    break;
            }
            
            setAnswersData({
                ...response,
                answers: sortedAnswers
            });
            
            // Set liked answers from response if available
            if (sortedAnswers && sortedAnswers.length > 0) {
                const likedAnswerIds = new Set();
                sortedAnswers.forEach(answer => {
                    if (answer.isLikedByCurrentUser) {
                        likedAnswerIds.add(answer.answerId);
                    }
                });
                setLikedAnswers(likedAnswerIds);
            }
        } catch (error) {
            console.error('Error loading answers:', error);
            setError('Unable to load answers list. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitAnswer = async () => {
        if (!checkUserAuthentication()) return;
        
        if (newAnswer.trim()) {
            try {
                setLoading(true);
                await createMainAnswer(parseInt(questionId), userInfo.userId, newAnswer);
                setNewAnswer(''); 
                await loadAnswers();
                await loadQuestionDetail(); // Refresh to update totalAnswers count
            } catch (error) {
                console.error('Error creating answer:', error);
                alert('An error occurred while sending the answer. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSubmitReply = async (parentAnswerId) => {
        if (!checkUserAuthentication()) return;
        
        if (replyContent.trim()) {
            try {
                setLoading(true);
                await createReply(parseInt(questionId), parentAnswerId, userInfo.userId, replyContent);
                setReplyContent('');
                setReplyingTo(null);
                await loadAnswers();
            } catch (error) {
                console.error('Error creating reply:', error);
                alert('An error occurred while sending the reply. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US') + ' ' + date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    const handleBackToForum = () => {
        navigate(`/conference/${id}/forum`);
    };

    const handleEditAnswer = (answer) => {
        setEditingAnswer(answer.answerId);
        setEditContent(answer.answer);
    };

    const handleSaveEdit = async (answerId) => {
        if (editContent.trim()) {
            try {
                setLoading(true);
                await updateAnswerQuestion(answerId, editContent);
                setEditingAnswer(null);
                setEditContent('');
                await loadAnswers();
            } catch (error) {
                console.error('Error updating answer:', error);
                alert('An error occurred while updating the answer. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleCancelEdit = () => {
        setEditingAnswer(null);
        setEditContent('');
    };

    const handleDeleteAnswer = async (answerId) => {
        setShowDeleteConfirm(answerId);
    };

    const confirmDeleteAnswer = async (answerId) => {
        try {
            setLoading(true);
            await deleteAnswerQuestion(answerId);
            await loadAnswers();
            await loadQuestionDetail(); // Refresh to update totalAnswers count
            setShowDeleteConfirm(null);
        } catch (error) {
            console.error('Error deleting answer:', error);
            alert('An error occurred while deleting the answer. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const cancelDeleteAnswer = () => {
        setShowDeleteConfirm(null);
    };

    const canUserEditAnswer = (answerBy) => {
        return userInfo && userInfo.userId === answerBy;
    };

    const canUserDeleteAnswer = (answerBy) => {
        return userInfo && (userInfo.userId === answerBy || canUserModerate);
    };

    const handleLikeAnswer = async (answerId) => {
        if (!checkUserAuthentication()) return;
        
        // Prevent multiple simultaneous like requests for the same answer
        if (likingAnswers.has(answerId)) return;
        
        try {
            setLikingAnswers(prev => new Set(prev.add(answerId)));
            
            // Optimistically update UI
            const wasLiked = likedAnswers.has(answerId);
            if (wasLiked) {
                setLikedAnswers(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(answerId);
                    return newSet;
                });
            } else {
                setLikedAnswers(prev => new Set(prev.add(answerId)));
            }
            
            // Update answer totalLikes count optimistically
            setAnswersData(prevData => ({
                ...prevData,
                answers: prevData.answers.map(answer => 
                    answer.answerId === answerId 
                        ? { ...answer, totalLikes: answer.totalLikes + (wasLiked ? -1 : 1) }
                        : answer
                )
            }));
            
            // Make API call
            await toggleAnswerLike(answerId, userInfo.userId);
            
        } catch (error) {
            console.error('Error toggling like:', error);
            
            // Revert optimistic update on error
            const wasLiked = !likedAnswers.has(answerId);
            if (wasLiked) {
                setLikedAnswers(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(answerId);
                    return newSet;
                });
            } else {
                setLikedAnswers(prev => new Set(prev.add(answerId)));
            }
            
            setAnswersData(prevData => ({
                ...prevData,
                answers: prevData.answers.map(answer => 
                    answer.answerId === answerId 
                        ? { ...answer, totalLikes: answer.totalLikes + (wasLiked ? -1 : 1) }
                        : answer
                )
            }));
            
            alert('An error occurred while liking/unliking the answer. Please try again.');
        } finally {
            setLikingAnswers(prev => {
                const newSet = new Set(prev);
                newSet.delete(answerId);
                return newSet;
            });
        }
    };

    const handleLikeQuestion = async () => {
        if (!checkUserAuthentication()) return;
        
        // Prevent multiple simultaneous like requests
        if (likingQuestion) return;
        
        try {
            setLikingQuestion(true);
            
            // Optimistically update UI
            const wasLiked = isQuestionLiked;
            setIsQuestionLiked(!wasLiked);
            
            // Update question totalLikes count optimistically
            setQuestionDetail(prevDetail => ({
                ...prevDetail,
                totalLikes: prevDetail.totalLikes + (wasLiked ? -1 : 1)
            }));
            
            // Make API call
            await toggleQuestionLike(questionId, userInfo.userId);
            
        } catch (error) {
            console.error('Error toggling question like:', error);
            
            // Revert optimistic update on error
            setIsQuestionLiked(isQuestionLiked);
            setQuestionDetail(prevDetail => ({
                ...prevDetail,
                totalLikes: prevDetail.totalLikes + (isQuestionLiked ? 1 : -1)
            }));
            
            alert('An error occurred while liking/unliking the question. Please try again.');
        } finally {
            setLikingQuestion(false);
        }
    };

    const buildAnswerTree = (answers) => {
        const answerMap = new Map();
        const rootAnswers = [];
        
        // Create a map of all answers
        answers.forEach(answer => {
            answerMap.set(answer.answerId, { ...answer, children: [] });
        });
        
        // Build the tree
        answers.forEach(answer => {
            if (answer.parentAnswerId) {
                // This is a reply, add to parent's children
                const parent = answerMap.get(answer.parentAnswerId);
                if (parent) {
                    parent.children.push(answerMap.get(answer.answerId));
                }
            } else {
                // This is a root answer
                rootAnswers.push(answerMap.get(answer.answerId));
            }
        });
        
        return rootAnswers;
    };

    // Function to toggle expanded state of an answer
    const toggleAnswerExpanded = (answerId) => {
        setExpandedAnswers(prev => {
            const newSet = new Set(prev);
            if (newSet.has(answerId)) {
                newSet.delete(answerId);
            } else {
                newSet.add(answerId);
            }
            return newSet;
        });
    };

    // Function to toggle menu visibility
    const toggleMenu = (answerId) => {
        setOpenMenus(prev => {
            const newSet = new Set(prev);
            if (newSet.has(answerId)) {
                newSet.delete(answerId);
            } else {
                // Close all other menus and open this one
                newSet.clear();
                newSet.add(answerId);
            }
            return newSet;
        });
    };

    // Recursive component to render answers with nesting
    const renderAnswer = (answer, level = 0) => {
        const maxLevel = 5; // Limit nesting depth
        const currentLevel = Math.min(level, maxLevel);
        const marginLeft = currentLevel * 24; // 24px per level
        const isExpanded = expandedAnswers.has(answer.answerId);
        const hasReplies = answer.children && answer.children.length > 0;
        const isMenuOpen = openMenus.has(answer.answerId);
        const canEdit = canUserEditAnswer(answer.answerBy);
        const canDelete = canUserDeleteAnswer(answer.answerBy);
        
        return (
            <div key={answer.answerId} style={{ marginLeft: `${marginLeft}px` }}>
                <div className="bg-gray-50 p-4 rounded-lg mb-3 border-l-2 border-gray-300">
                    <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-gray-800">{answer.answererName}</span>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">{formatDate(answer.createdAt)}</span>
                            {(canEdit || canDelete) && (
                                <div className="relative">
                                    <button
                                        onClick={() => toggleMenu(answer.answerId)}
                                        className="text-gray-500 hover:text-gray-700 px-2 py-1"
                                        title="Options"
                                    >
                                        ⋯
                                    </button>
                                    {isMenuOpen && (
                                        <div className="absolute right-0 top-8 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-[100px]">
                                            {canEdit && (
                                                <button
                                                    onClick={() => {
                                                        handleEditAnswer(answer);
                                                        setOpenMenus(new Set()); // Close menu
                                                    }}
                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    Edit
                                                </button>
                                            )}
                                            {canDelete && (
                                                <button
                                                    onClick={() => {
                                                        handleDeleteAnswer(answer.answerId);
                                                        setOpenMenus(new Set()); // Close menu
                                                    }}
                                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Answer content - show edit form if editing */}
                    {editingAnswer === answer.answerId ? (
                        <div className="mb-3">
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-blue-500"
                                rows="3"
                            />
                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={() => handleSaveEdit(answer.answerId)}
                                    disabled={!editContent.trim() || loading}
                                    style={{ backgroundColor: '#1447e6' }}
                                    className="text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                                >
                                    {loading ? 'Saving...' : 'Save'}
                                </button>
                                <button
                                    onClick={handleCancelEdit}
                                    className="border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-700 mb-3">{answer.answer}</p>
                    )}
                    
                    <div className="flex gap-4 items-center">
                        <button 
                            onClick={() => handleLikeAnswer(answer.answerId)}
                            disabled={!userInfo || likingAnswers.has(answer.answerId)}
                            className={`text-sm transition-colors ${
                                likedAnswers.has(answer.answerId) 
                                    ? 'text-blue-600 hover:text-blue-800' 
                                    : 'text-gray-500 hover:text-blue-600'
                            } ${!userInfo ? 'cursor-not-allowed opacity-50' : ''}`}
                            title={userInfo ? (likedAnswers.has(answer.answerId) ? 'Unlike' : 'Like') : 'Login to like'}
                        >
                            {likingAnswers.has(answer.answerId) ? (
                                <span>⏳ {answer.totalLikes} likes</span>
                            ) : (
                                <span>
                                    {likedAnswers.has(answer.answerId) ? '❤️' : '🤍'} {answer.totalLikes} likes
                                </span>
                            )}
                        </button>
                        
                        {/* Show replies count and toggle button */}
                        {hasReplies && (
                            <button
                                onClick={() => toggleAnswerExpanded(answer.answerId)}
                                className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                            >
                                {isExpanded ? (
                                    <span> Hide {answer.children.length} replies</span>
                                ) : (
                                    <span> Show {answer.children.length} replies</span>
                                )}
                            </button>
                        )}
                        
                        <button
                            onClick={() => setReplyingTo(replyingTo === answer.answerId ? null : answer.answerId)}
                            className="text-sm text-blue-600 hover:text-blue-800"
                            disabled={!userInfo}
                        >
                            Reply
                        </button>
                    </div>
                    
                    {/* Reply Form */}
                    {replyingTo === answer.answerId && userInfo && (
                        <div className="mt-3 border-l-2 border-gray-200 pl-4">
                            <div className="flex gap-2">
                                <textarea
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    placeholder="Enter your reply..."
                                    className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-blue-500"
                                    rows="3"
                                />
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => handleSubmitReply(answer.answerId)}
                                        disabled={!replyContent.trim() || loading}
                                        style={{ backgroundColor: '#1447e6' }}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
                                    >
                                        {loading ? 'Sending...' : 'Send'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setReplyingTo(null);
                                            setReplyContent('');
                                        }}
                                        className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Render children recursively - only if expanded */}
                {hasReplies && isExpanded && (
                    <div className="ml-4">
                        {answer.children.map(child => renderAnswer(child, level + 1))}
                    </div>
                )}
            </div>
        );
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
                                if (questionId) {
                                    loadQuestionDetail();
                                    loadAnswers();
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

    // Show loading state when no questionId
    if (!questionId) {
        return (
            <div className="min-h-screen bg-white">
                <div className="max-w-4xl mx-auto p-6">
                    <div className="text-center py-8">
                        <p className="text-gray-600">Invalid Question ID.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto p-6">
                {/* Header */}
                <div className="mb-6">
                    <button 
                        onClick={handleBackToForum}
                        className="text-gray-600 hover:text-gray-800 mb-4"
                        style={{fontSize : '20px'}}
                    >
                        ← Back to forum
                    </button>
                    
                    {questionDetail ? (
                        <>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                {questionDetail.title}
                            </h3>
                            <div className="text-gray-500 mb-4"   style={{fontSize : '14px'}}>
                                Author: {questionDetail.askerName} • Created: {formatDate(questionDetail.createdAt)}
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                <h6 className="font-semibold text-gray-800 mb-2">Description:</h6>
                                <p className="text-gray-700 mb-2" style={{fontSize : '14px'}}>{questionDetail.description}</p>
                                <h6 className="font-semibold text-gray-800 mb-2">Question details:</h6>
                                <p className="text-gray-700" style={{fontSize : '14px'}}>{questionDetail.question}</p>
                            </div>
                            <div className="flex gap-6 text-sm text-gray-600 mb-6">
                                <span style={{fontSize : '14px'}}>{questionDetail.totalAnswers} answers</span>
                                <button 
                                    onClick={handleLikeQuestion}
                                    disabled={!userInfo || likingQuestion}
                                    className={`transition-colors ${
                                        isQuestionLiked 
                                            ? 'text-blue-600 hover:text-blue-800' 
                                            : 'text-gray-600 hover:text-blue-600'
                                    } ${!userInfo ? 'cursor-not-allowed opacity-50' : ''}`}
                                    title={userInfo ? (isQuestionLiked ? 'Unlike question' : 'Like question') : 'Login to like'}
                                >
                                    {likingQuestion ? (
                                        <span>⏳ {questionDetail.totalLikes} likes</span>
                                    ) : (
                                        <span>
                                            {isQuestionLiked ? '❤️' : '🤍'} {questionDetail.totalLikes} likes
                                        </span>
                                    )}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                            <div className="h-24 bg-gray-200 rounded mb-4"></div>
                        </div>
                    )}
                </div>

                {/* Search Answers */}
                <div className="mb-6">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                        <form onSubmit={handleSearch} className="flex max-w-md flex-1">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search in answers..."
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
                        
                        {/* Sort Dropdown */}
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-600 whitespace-nowrap">Sort by:</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                            >
                                <option value="newest">Newest first</option>
                                <option value="oldest">Oldest first</option>
                                <option value="likes">Most liked</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* All Answers */}
                <div className="space-y-4 mb-6">
                    <h4 className="text-sm font-semibold text-gray-800 border-b border-gray-200 pb-2">
                        All answers ({answersData.totalCount})
                    </h4>

                    {loading && (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <p className="mt-2 text-gray-600">Loading...</p>
                        </div>
                    )}

                    {!loading && answersData.answers && answersData.answers.length > 0 ? (
                        <div className="space-y-2">
                            {buildAnswerTree(answersData.answers).map(answer => renderAnswer(answer, 0))}
                        </div>
                    ) : !loading && (
                        <p className="text-gray-500 text-center py-4">
                            {answersData.searchTerm ? 'No matching answers found.' : 'No answers yet.'}
                        </p>
                    )}
                </div>

                {/* Pagination */}
                {!loading && answersData.totalPages > 1 && (
                    <div className="mb-6 flex justify-center items-center space-x-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={!answersData.hasPreviousPage}
                            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Previous
                        </button>
                        
                        <span className="px-4 py-2 text-sm text-gray-600">
                            Page {answersData.currentPage} / {answersData.totalPages}
                        </span>
                        
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={!answersData.hasNextPage}
                            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Next
                        </button>
                    </div>
                )}

                {/* Answer Form */}
                {userInfo ? (
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-800 mb-3">Answer question</h4>
                        <div className="flex gap-2">
                            <textarea
                                value={newAnswer}
                                onChange={(e) => setNewAnswer(e.target.value)}
                                placeholder="Enter your answer..."
                                className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-blue-500"
                                rows="4"
                            />
                            <button
                                onClick={handleSubmitAnswer}
                                disabled={!newAnswer.trim() || loading}
                                style={{ backgroundColor: '#1447e6' }}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap self-start"
                            >
                                {loading ? 'Sending...' : 'Send'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <p className="text-gray-600 mb-2">You need to login to answer questions</p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Login
                        </button>
                    </div>
                )}
            </div>
            
            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Confirm Delete Answer
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this answer? This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={cancelDeleteAnswer}
                                disabled={loading}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => confirmDeleteAnswer(showDeleteConfirm)}
                                disabled={loading}
                                style={{ backgroundColor: '#e62914ff' }}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-400"
                            >
                                {loading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ForumQuestionDetail;
