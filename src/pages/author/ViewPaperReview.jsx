import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReviewSidebar from '../../components/pdfReview/ReviewSidebar';
import ReviewContent from '../../components/pdfReview/reviewContent/ReviewContent';
import { getReviewByRevisionId } from '../../services/ReviewService';

const ViewPaperReview = () => {
    const { revisionId } = useParams();
    const [review, setReview] = useState(null);

    useEffect(() => {
        if (revisionId) {
            getReviewByRevisionId(revisionId)
                .then(res => setReview(res))
                .catch(() => setReview(null));
        }
    }, [revisionId]);

    return (
        <main className="pt-10">
            <div className="flex flex-col gap-6 min-h-screen bg-gray-50 ">
                <div className="flex min-h-[400px]">
                    <div className="w-1/4">
                        <ReviewSidebar review={review} readOnly />
                    </div>
                    <div className="w-3/4 h-[95vh] p-10">
                        {review ? (
                            <ReviewContent review={review} readOnly />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400 text-lg">
                                Loading review...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ViewPaperReview;