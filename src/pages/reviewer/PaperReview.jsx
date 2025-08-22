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
    const [rawText, setRawText] = useState('');
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
                        // Nếu cần điều hướng khi không tìm thấy review
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

    // Hàm trích xuất raw text và gọi API
    const handleChunksGenerated = async (data) => {
        const rawText = data[0]?.RawText; // Lấy RawText từ mảng
        if (!rawText) {
            setMessage("No raw text provided in data.");
            setMessageType('error');
            return;
        }
        setRawText(rawText); // Lưu raw text vào state
        console.log('Time:', new Date().toLocaleString(), 'Sending to:', '/api/AnalyzeAi', { ReviewId: review?.reviewId, RawText: rawText });

        if (!review?.reviewId) {
            setMessage("Review ID not available.");
            setMessageType('error');
            return;
        }

        try {
            const data = await AnalyzeAiService.analyzeDocument(review.reviewId, rawText);
            console.log('Response at:', new Date().toLocaleString(), data);
            setAiPercentage(data.PercentAi || 0); // Cập nhật với PercentAi (chữ cái đầu in hoa theo convention)
            setMessage(`AI Percentage: ${data.PercentAi}%, Total Tokens: ${data.TotalTokens}`);
            setMessageType('success');
        } catch (err) {
            console.error('Time:', new Date().toLocaleString(), 'Error:', err.message, err.response?.data);
            setMessage(`Failed to analyze AI content! (${err.message}${err.response?.data?.errors ? ': ' + JSON.stringify(err.response.data.errors) : ''})`);
            setMessageType('error');
        }
    };

    return (
        <main className="pt-10">
            <div className="flex flex-col gap-6 min-h-screen bg-gray-50 ">
                <div className="flex min-h-[400px]">
                    <div className="w-1/4">
                        <ReviewSidebar
                            review={review}
                            chunks={rawText ? [{ RawText: rawText }] : []} // Truyền rawText dưới dạng mảng cho tương thích
                            aiPercentage={aiPercentage}
                            onChange={setReview}
                            onSave={() => { }}
                            onSendFeedback={() => { }}
                        />
                    </div>
                    <div className="w-3/4 h-[95vh] p-10">
                        {review ? (
                            <ReviewContent
                                review={review}
                                onChunksGenerated={handleChunksGenerated} // Truyền callback
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