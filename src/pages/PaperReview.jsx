import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReviewSidebar from '../components/pdfReview/ReviewSidebar';
import ReviewContent from '../components/pdfReview/reviewContent/ReviewContent';
import { getReviewByAssignmentId } from '../services/ReviewService';

const PaperReview = () => {
    const { assignmentId } = useParams();
    const [review, setReview] = useState(null);
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

    

    return (
        <main className="pt-10">
            <div className="flex flex-col gap-6 min-h-screen bg-gray-50 ">
                <div className="flex min-h-[400px]">
                    <div className="w-1/4">
                        <ReviewSidebar review={review} onChange={setReview} />
                    </div>
                    <div className="w-3/4 h-[95vh] p-10">
                        {review ? (
                            <ReviewContent review={review} />
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