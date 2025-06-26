import React, { useState } from 'react';
import ReviewSidebar from '../components/pdfReview/ReviewSidebar';
import ReviewContent from '../components/pdfReview/reviewContent/ReviewContent';
import ReviewActions from '../components/pdfReview/ReviewActions';

const paperData = {
    title: "AI for work",
    abstract: "About AI Development",
    score: "6.3",
    fileName: "AI.pdf",
    submitDate: "30/05/2025 11:10 AM",
    status: "Need Revision"
};

const PaperReview = () => {
    const [comment, setComment] = useState('');

    const handleSave = () => {
        alert('Saved!');
    };

    const handleSendFeedback = () => {
        alert('Feedback sent!');
    };

    return (
        <>
            
            <main className="pt-10">
        <div className="flex flex-col gap-6 min-h-screen bg-gray-50 pt-20">
            <div className="flex min-h-[400px]">
                <div className="w-1/4">
                
                 <ReviewSidebar paper={paperData} />
                </div>
                <div className="w-3/4 h-[95vh] p-10">
                <ReviewContent />
                </div>
            </div>
            <ReviewActions
                comment={comment}
                onCommentChange={setComment}
                onSave={handleSave}
                onSendFeedback={handleSendFeedback}
            />
        </div>
        </main>
        </>
    );
};

export default PaperReview;