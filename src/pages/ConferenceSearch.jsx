import React, { useState, useEffect } from "react";
import { searchConferences } from "../services/ConferenceService";

const PAGE_SIZE = 10;

const ConferenceSearch = () => {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [topic, setTopic] = useState("");
  const [activeTab, setActiveTab] = useState("event"); // "event" or "topic"
  const [page, setPage] = useState(1);
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(false);

  // Build OData filter string
  const buildFilter = () => {
    let filters = ["Status eq true"];
    if (location) filters.push(`contains(Location,'${location}')`);
    if (activeTab === "topic" && topic)
      filters.push(`Topics/any(t: contains(t/Name,'${topic}'))`);
    return filters.join(" and ");
  };

  useEffect(() => {
    setLoading(true);
    searchConferences({
      search: activeTab === "event" ? search : "",
      filter: buildFilter(),
      skip: (page - 1) * PAGE_SIZE,
      top: PAGE_SIZE,
    })
      .then((res) => setConferences(res.value || res))
      .finally(() => setLoading(false));
  }, [search, location, topic, page, activeTab]);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-1/4">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Filter Events</h2>
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
            {activeTab === "topic" && (
              <div className="mb-4">
                <label className="block font-medium mb-1">Topic</label>
                <input
                  type="text"
                  placeholder="Search by Topic"
                  value={topic}
                  onChange={(e) => {
                    setTopic(e.target.value);
                    setPage(1);
                  }}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
            )}
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1">
          {/* Search Bar & Tabs */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            {activeTab === "event" ? (
              <input
                type="text"
                placeholder="Search within Events"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="flex-1 border px-4 py-2 rounded"
              />
            ) : (
              <input
                type="text"
                placeholder="Search by Topic"
                value={topic}
                onChange={(e) => {
                  setTopic(e.target.value);
                  setPage(1);
                }}
                className="flex-1 border px-4 py-2 rounded"
              />
            )}
            {/* Tabs for search mode */}
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 rounded font-semibold ${
                  activeTab === "event"
                    ? "bg-gray-200 text-gray-700"
                    : "bg-white text-gray-500 border"
                }`}
                onClick={() => {
                  setActiveTab("event");
                  setPage(1);
                }}
              >
                Search by Event
              </button>
              <button
                className={`px-4 py-2 rounded font-semibold ${
                  activeTab === "topic"
                    ? "bg-gray-200 text-gray-700"
                    : "bg-white text-gray-500 border"
                }`}
                onClick={() => {
                  setActiveTab("topic");
                  setPage(1);
                }}
              >
                Search by Topic
              </button>
            </div>
          </div>
          {/* Results */}
          <div className="mb-4 text-gray-600">
            Showing {conferences.length} Active Conferences {new Date().getFullYear()}
          </div>
          {loading ? (
            <div className="text-center py-10 text-lg text-gray-500">Loading...</div>
          ) : (
            <div className="flex flex-col gap-6">
              {conferences.map((conf) => (
                <div
                  key={conf.conferenceId}
                  className="bg-white rounded-lg shadow flex flex-col md:flex-row items-center p-6 gap-6"
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
                          ? new Date(conf.startDate).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                            })
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
                            {topic.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Pagination */}
          <div className="flex gap-2 mt-8 justify-center">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-3 py-2">{page}</span>
            <button
              disabled={conferences.length < PAGE_SIZE}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ConferenceSearch;