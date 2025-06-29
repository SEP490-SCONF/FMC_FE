import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReviewSidebar from '../components/pdfReview/ReviewSidebar';
import ReviewContent from '../components/pdfReview/reviewContent/ReviewContent';
import ReviewActions from '../components/pdfReview/ReviewActions';
import { getReviewByAssignmentId } from '../services/ReviewService';

const PaperReview = () => {
    const { assignmentId } = useParams();
    const [review, setReview] = useState(null);
    const [comment, setComment] = useState('');

    useEffect(() => {
        if (assignmentId) {
            getReviewByAssignmentId(assignmentId)
                .then(res => {
                    console.log("Review data:", res); // In ra dữ liệu review
                    setReview(res);
                })
                .catch(() => setReview(null));
        }
    }, [assignmentId]);

    const handleSave = () => {
        alert('Saved!');
    };

    const handleSendFeedback = () => {
        alert('Feedback sent!');
    };

    return (
        <main className="pt-10">
            <div className="flex flex-col gap-6 min-h-screen bg-gray-50 ">
                <div className="flex min-h-[400px]">
                    <div className="w-1/4">
                        <ReviewSidebar review={review} onChange={setReview} />
                    </div>
                    <div className="w-3/4 h-[95vh] p-10">
                        <ReviewContent />
                    </div>
                </div>
                
            </div>
        </main>
    );
};

export default PaperReview;