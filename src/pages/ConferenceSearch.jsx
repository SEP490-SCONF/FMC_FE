import React, { useState, useEffect } from "react";
import { searchConferences } from "../services/ConferenceService";
import { getAllTopics } from "../services/TopicService";
import { useNavigate } from "react-router-dom";
import { Pagination } from "antd";
import LoadingSpinner from "../components/common/LoadingSpinner";

const PAGE_SIZE = 2;

const ConferenceSearch = () => {
  const [location, setLocation] = useState("");
  const [topics, setTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [page, setPage] = useState(1);
  const [conferences, setConferences] = useState([]);
  const [totalCount, setTotalCount] = useState(0); // Thêm state này
  const [loading, setLoading] = useState(false);
  const [searchTitle, setSearchTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getAllTopics().then((res) => setTopics(res.value || res));
  }, []);

  // Build OData filter string
  const buildFilter = () => {
    let filters = ["Status eq true"];
    if (location) filters.push(`contains(Location,'${location}')`);
    if (searchTitle)
      filters.push(`contains(tolower(Title),'${searchTitle.toLowerCase()}')`);
    if (selectedTopics.length > 0) {
      const topicFilters = selectedTopics
        .map((topicId) => `Topics/any(t: t/TopicId eq ${topicId})`)
        .join(" and ");
      filters.push(`(${topicFilters})`);
    }
    return filters.join(" and ");
  };

  useEffect(() => {
    setLoading(true);
    searchConferences({
      filter: buildFilter(),
      skip: (page - 1) * PAGE_SIZE,
      top: PAGE_SIZE,
    })
      .then((res) => {
        setConferences(res.value || res);
        setTotalCount(res["@odata.count"] || res.count || 0);
        console.log("API Response:", res);
        console.log("OData Count:", res["@odata.count"]); // 👈 log riêng count
      })
      .finally(() => setLoading(false));
  }, [location, selectedTopics, page, searchTitle]);

  const handleTopicChange = (topicId) => {
    setPage(1);
    setSelectedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId]
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-1/4">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="mb-4">
              <label className="block font-medium mb-1">Search by Title</label>
              <input
                type="text"
                placeholder="Enter conference title"
                value={searchTitle}
                onChange={(e) => {
                  setSearchTitle(e.target.value);
                  setPage(1);
                }}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-1">Location</label>
              <input
                type="text"
                placeholder="Filter by Location"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setPage(1);
                }}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-1">Disciplines</label>
              <div className="max-h-60 overflow-y-auto border rounded p-2 bg-gray-50">
                {/* Header group + Select All */}
                <div className="flex items-center justify-between px-2 py-1 mb-2 bg-gray-100 rounded">
                  <span className="font-semibold text-gray-600 text-xs uppercase tracking-wide">
                    Economics and Social Sciences
                  </span>
                  <button
                    type="button"
                    className="text-xs text-blue-600 hover:underline"
                    onClick={() =>
                      setSelectedTopics(topics.map((t) => t.topicId))
                    }
                    tabIndex={0}
                  >
                    Select All
                  </button>
                </div>
                {/* List topics */}
                {topics.map((topic) => (
                  <div
                    key={topic.topicId}
                    className="flex items-center mb-2 px-2"
                  >
                    <input
                      type="checkbox"
                      id={`topic-${topic.topicId}`}
                      checked={selectedTopics.includes(topic.topicId)}
                      onChange={() => handleTopicChange(topic.topicId)}
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
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1">
          {/* Results */}
          <div className="mb-4 text-gray-600"></div>
          {loading ? (
            <div className="text-center py-10">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {conferences.map((conf) => (
                <div
                  key={conf.conferenceId}
                  className="bg-white rounded-lg shadow flex flex-col md:flex-row items-center p-6 gap-6 cursor-pointer hover:bg-gray-100 transition"
                  onClick={() => {
                    navigate(`/conference/${conf.conferenceId}`);
                  }}
                >
                  {/* Banner or logo */}
                  <div className="flex-shrink-0 w-32 h-32 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                    {conf.bannerUrl ? (
                      <img
                        src={conf.bannerUrl}
                        alt={conf.title}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="text-gray-400 text-4xl font-bold">
                        {conf.title?.charAt(0) || "C"}
                      </span>
                    )}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="mb-1">
                      <span className="font-semibold text-yellow-700">
                        Conference
                      </span>
                      {conf.callForPaper && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          Call for Papers
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {conf.title}
                    </h3>
                    <div className="text-gray-700 mb-2 line-clamp-2">
                      {conf.description}
                    </div>
                    <div className="text-gray-600 text-sm mb-1">
                      Between{" "}
                      <span className="font-semibold">
                        {conf.startDate
                          ? new Date(conf.startDate).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                            }
                          )
                          : ""}
                      </span>{" "}
                      and{" "}
                      <span className="font-semibold">
                        {conf.endDate
                          ? new Date(conf.endDate).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                          })
                          : ""}
                      </span>{" "}
                      in{" "}
                      <span className="font-semibold">
                        {conf.location || "TBA"}
                      </span>
                    </div>
                    {/* Topics */}
                    {conf.topics && conf.topics.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {conf.topics.map((topic) => (
                          <span
                            key={topic.topicId}
                            className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs"
                          >
                            {topic.topicName}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Pagination Ant Design */}
          {!loading && totalCount > PAGE_SIZE && (
            <div className="flex justify-center mt-8">
              <Pagination
                current={page}
                total={totalCount}
                pageSize={PAGE_SIZE}
                onChange={(p) => setPage(p)}
                showSizeChanger={false}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ConferenceSearch;
