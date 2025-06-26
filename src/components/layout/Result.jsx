// ReviewResultPage.jsx
import React, { useState } from 'react';

const ReviewResultPage = () => {
    const reviewersData = [
        { name: 'Ngô Bảo A', score: 4.6, feedback: 'Some feedback here.', result: 'Need Revision' },
    ];

    const [reviewers, setReviewers] = useState(reviewersData);

    const handleResultChange = (index, newResult) => {
        const updated = [...reviewers];
        updated[index].result = newResult;
        setReviewers(updated);
    };

    const averageScore = reviewers.reduce((acc, curr) => acc + curr.score, 0) / reviewers.length;

    const finalResult = reviewers.every(r => r.result === 'Approved')
        ? 'Accepted'
        : reviewers.some(r => r.result === 'Deny')
            ? 'Denied'
            : 'Need Revision';

    const getResultBadge = (result) => {
        switch (result) {
            case "Approved":
                return <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-sm">Approved</span>;
            case "Deny":
                return <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 font-semibold text-sm">Denied</span>;
            case "Need Revision":
            default:
                return <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 font-semibold text-sm">Need Revision</span>;
        }
    };

    const SubmissionInfo = () => (
        <div className="w-1/2 bg-white p-6 rounded shadow-md flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-4">Submission Information</h2>
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <span className="font-medium w-36 text-left">Title</span>
                    <input className="border p-2 rounded flex-1" value="AI for work" readOnly />
                </div>
                <div className="flex items-center gap-4">
                    <span className="font-medium w-36 text-left">Abstract</span>
                    <textarea className="border p-2 rounded flex-1" value="About AI Development" readOnly />
                </div>
                <div className="flex items-center gap-4">
                    <span className="font-medium w-36 text-left">Topic</span>
                    <input className="border p-2 rounded flex-1" value="AI" readOnly />
                </div>
                <div className="flex items-center gap-4">
                    <span className="font-medium w-36 text-left">File PDF for submit</span>
                    <input className="border p-2 rounded flex-1" value="AI.pdf" readOnly />
                </div>
                <div className="flex items-center gap-4">
                    <span className="font-medium w-36 text-left">Submit Date</span>
                    <input className="border p-2 rounded flex-1" value="30/05/2025 11:10 AM" readOnly />
                </div>
                <div className="flex items-center gap-4">
                    <span className="font-medium w-36 text-left">Status</span>
                    <input className="border p-2 rounded flex-1" value={finalResult === 'Accepted' ? 'Approved' : finalResult} readOnly />
                </div>
            </div>
        </div>
    );

    const ReviewResultTable = () => (
        <div className="w-2/3 bg-white p-6 rounded shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-left">Review Result Aggregation</h2>
            <table className="w-full border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2 border text-left">Reviewer</th>
                        <th className="p-2 border text-left">Feedback</th>
                        <th className="p-2 border text-center">Score</th>
                        <th className="p-2 border text-center">Result</th>
                    </tr>
                </thead>
                <tbody>
                    {reviewers.map((r, index) => (
                        <tr key={index}>
                            <td className="p-2 border">{r.name}</td>
                            <td className="p-2 border">{r.feedback}</td>
                            <td className="p-2 border text-center">{r.score}</td>
                            <td className="p-2 border text-center">
                                {getResultBadge(r.result)}
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="bg-gray-100 font-bold">
                        <td className="p-2 border">Final</td>
                        <td className="p-2 border" colSpan="2">Score: {averageScore.toFixed(1)}</td>
                        <td className="p-2 border text-center">{getResultBadge(finalResult)}</td>
                    </tr>
                </tfoot>
            </table>
            <p className="mt-2 text-sm text-gray-600">Please edit your paper and resubmit!</p>
        </div>
    );

    return (
        <div className="flex flex-col items-center p-8 bg-gray-50 min-h-screen">
            <div className="flex gap-12 w-full max-w-6xl">
                <SubmissionInfo />
                <ReviewResultTable />
            </div>

            <div className="mt-8">
                {finalResult === 'Need Revision' && (
                    <button className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 rounded shadow">ReSubmit Paper</button>
                )}
                {finalResult === 'Accepted' && (
                    <button className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded shadow">Continue</button>
                )}
                {finalResult === 'Denied' && (
                    <button className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded shadow">Back to Conference</button>
                )}
            </div>
        </div>
    );
};

export default ReviewResultPage;