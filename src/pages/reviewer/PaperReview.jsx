import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReviewSidebar from '../../components/pdfReview/ReviewSidebar';
import ReviewContent from '../../components/pdfReview/reviewContent/ReviewContent';
import { getReviewByAssignmentId } from '../../services/ReviewService';
import AnalyzeAiService from '../../services/AnalyzeAiService';

const PaperReview = () => {
    const navigate = useNavigate();
    const { assignmentId } = useParams();
    const [review, setReview] = useState(null);
    const [chunks, setChunks] = useState([]); // Thêm state để lưu mảng chunks
    const [aiPercentage, setAiPercentage] = useState(0);
    const [comment, setComment] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success'); // "success" or "error"

    useEffect(() => {
        if (assignmentId) {
            const fetchReview = async () => {
                try {
                    const res = await getReviewByAssignmentId(assignmentId);
                    if (!res) {
                        navigate("/not-found");
                        return;
                    }
                    setReview(res);
                } catch (error) {
                    setReview(null);
                    navigate("/not-found");
                }
            };

            fetchReview();
        }
    }, [assignmentId, navigate]);

    // Hàm xử lý khi chunks được tạo từ ReviewContent
    // Trong handleChunksGenerated
    const handleChunksGenerated = async (data) => {
        if (!data || !data.rawText || !Array.isArray(data.chunks)) {
            setMessage("No valid chunks provided.");
            setMessageType('error');
            return;
        }
        setChunks(data.chunks);

        if (!review?.reviewId) {
            setMessage("Review ID not available.");
            setMessageType('error');
            return;
        }

        // Gửi đúng payload cho API
        const payload = {
            reviewId: review.reviewId,
            rawText: data.rawText,
            chunks: data.chunks
        };

        try {
            const response = await AnalyzeAiService.analyzeDocument(payload.reviewId, payload.chunks);
            setAiPercentage(response.percentAi || 0);
            setMessageType('success');
        } catch (err) {
            setMessageType('error');
        }
    };

    const handleSidebarChange = (newReview) => {
        setReview(newReview);
        if (typeof newReview.percentAi === "number") {
            setAiPercentage(newReview.percentAi);
        }
    };

    return (
        <main className="pt-10">
            <div className="flex flex-col gap-6 min-h-screen bg-gray-50 ">
                <div className="flex min-h-[400px]">
                    <div className="w-1/4">
                        <ReviewSidebar
                            review={review}
                            chunks={chunks}
                            aiPercentage={aiPercentage}
                            onChange={handleSidebarChange}
                            onSave={() => { }}
                            onSendFeedback={() => { }}
                        />
                    </div>
                    <div className="w-3/4 h-[95vh] p-10">
                        {review ? (
                            <ReviewContent
                                review={review}
                                onChunksGenerated={handleChunksGenerated}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400 text-lg">
                                Loading review...
                            </div>
                        )}
                    </div>
                </div>
                {/* Notification message */}
                {message && (
                    <div
                        className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg text-center max-w-xs z-50
                        ${messageType === "success"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                    >
                        {message}
                    </div>
                )}
            </div>
        </main>
    );
};

export default PaperReview;