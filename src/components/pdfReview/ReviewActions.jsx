import React from 'react';

const ReviewActions = ({ comment, onCommentChange, onSave, onSendFeedback }) => (
    <div className="mt-8 flex flex-col items-center">
        <textarea
            className="w-3/5 h-24 mb-4 border rounded px-3 py-2"
            placeholder="Comment"
            value={comment}
            onChange={e => onCommentChange(e.target.value)}
        />
        <div className="flex gap-8">
            <button
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                onClick={onSave}
            >
                Save
            </button>
            <button
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                onClick={onSendFeedback}
            >
                Send Feedback
            </button>
        </div>
    </div>
);

export default ReviewActions;