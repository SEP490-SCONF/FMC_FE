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
        if (!data || !Array.isArray(data) || !data[0]?.RawText) {
            setMessage("No valid chunks provided.");
            setMessageType('error');
            return;
        }
        setChunks(data); // Lưu mảng chunks vào state

        if (!review?.reviewId) {
            setMessage("Review ID not available.");
            setMessageType('error');
            return;
        }

        // Chuyển đổi dữ liệu chunk thành định dạng ChunkPayloadDTO
        const formattedChunks = data.map((chunk, index) => ({
            ChunkId: index + 1,
            Text: chunk.RawText, // Sử dụng full RawText thay vì chỉ 50 ký tự
            TokenCount: countWords(chunk.RawText), // Sử dụng wordCount làm TokenCount
            Hash: null // Có thể thêm logic hash nếu cần
        }));

        try {
            console.log('Sending to API:', { ReviewId: review.reviewId, Chunks: formattedChunks });
            const response = await AnalyzeAiService.analyzeDocument(review.reviewId, formattedChunks); // Gửi mảng chunks đã định dạng
            console.log('Response at:', new Date().toLocaleString(), response);
            setAiPercentage(response.PercentAi || 0); // Cập nhật với PercentAi
            setMessageType('success');
        } catch (err) {
            console.error('Time:', new Date().toLocaleString(), 'Error:', err.message, err.response?.data);
            setMessageType('error');
        }
    };

    // Hàm countWords (copy từ ReviewContent.jsx để tái sử dụng)
    const countWords = (text) => {
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    };

    return (
        <main className="pt-10">
            <div className="flex flex-col gap-6 min-h-screen bg-gray-50 ">
                <div className="flex min-h-[400px]">
                    <div className="w-1/4">
                        <ReviewSidebar
                            review={review}
                            chunks={chunks} // Truyền mảng chunks thay vì rawText
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