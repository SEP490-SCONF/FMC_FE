import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReviewSidebar from '../components/pdfReview/ReviewSidebar';
import ReviewContent from '../components/pdfReview/reviewContent/ReviewContent';
import { getReviewByAssignmentId } from '../services/ReviewService';
import AnalyzeAiService from '../services/AnalyzeAiService';

const PaperReview = () => {
    const { assignmentId } = useParams();
    const [review, setReview] = useState(null);
    const [chunks, setChunks] = useState([]);
    const [aiPercentage, setAiPercentage] = useState(0);
    const [comment, setComment] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success'); // "success" or "error"

    useEffect(() => {
        if (assignmentId) {
            getReviewByAssignmentId(assignmentId)
                .then(res => {
                    console.log(res);
                    setReview(res);
                })
                .catch(() => setReview(null));
        }
    }, [assignmentId]);

    // Hàm trích xuất chunk và gọi API
    const handleChunksGenerated = async (generatedChunks) => {
        setChunks(generatedChunks);
        if (generatedChunks.length > 0) {
            console.log('Time:', new Date().toLocaleString(), 'Sending to:', '/api/AnalyzeAi', { ReviewId: review?.reviewId, Chunks: generatedChunks });
            try {
                const data = await AnalyzeAiService.analyzeDocument(review?.reviewId, generatedChunks);
                // console.log('Response at:', new Date().toLocaleString(), data);
                setAiPercentage(data.percentAi || 0);
                // setMessage(`AI Percentage: ${data.percentAi}%, Total Tokens: ${data.totalTokens}`);
                setMessageType('success');
            } catch (err) {
                console.error('Time:', new Date().toLocaleString(), 'Error:', err.message, err.response?.data);
                setMessage(`Failed to analyze AI content! (${err.message}${err.response?.data?.errors ? ': ' + JSON.stringify(err.response.data.errors) : ''})`);
                setMessageType('error');
            }
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
                            onChange={setReview}
                            onSave={() => { }}
                            onSendFeedback={() => { }}
                        />
                    </div>
                    <div className="w-3/4 h-[95vh] p-10">
                        {review ? (
                            <ReviewContent
                                review={review}
                                onChunksGenerated={handleChunksGenerated} // Truyền callback để nhận chunks
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