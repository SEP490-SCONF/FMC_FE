import React from "react";

export default function FilterPanel({
  topics = [],
  selectedTopics = [],
  onTopicChange,
  onSelectAll,
}) {
  return (
    <div className="mb-4">
      <label className="block font-medium mb-1">Disciplines</label>
      <div className="max-h-60 overflow-y-auto border rounded p-2 bg-gray-50">
        <div className="flex items-center justify-between px-2 py-1 mb-2 bg-gray-100 rounded">
          <span className="font-semibold text-gray-600 text-xs uppercase tracking-wide">
            Economics and Social Sciences
          </span>
          <button
            type="button"
            className="text-xs text-blue-600 hover:underline"
            onClick={onSelectAll}
            tabIndex={0}
          >
            Select All
          </button>
        </div>
        {topics.map((topic) => (
          <div key={topic.topicId} className="flex items-center mb-2 px-2">
            <input
              type="checkbox"
              id={`topic-${topic.topicId}`}
              checked={selectedTopics.includes(topic.topicId)}
              onChange={() => onTopicChange(topic.topicId)}
              className="mr-2"
            />
            <label
              htmlFor={`topic-${topic.topicId}`}
              className="text-base text-gray-900 cursor-pointer"
            >
              {topic.topicName}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}