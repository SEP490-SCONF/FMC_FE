import React, { useState, useEffect, useCallback } from "react";
import { getAllConferences } from "../../services/ConferenceService";
import { getAllTopics } from "../../services/TopicService";
import { useNavigate } from "react-router-dom";
import { Pagination, Input, Select, Button, Checkbox, Space, Card } from "antd";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import NotFoundWithClearFilters from "../../components/common/NoResults/NotFoundWithClearFilters";
const { Search } = Input;
const { Option } = Select;
const PAGE_SIZE = 3;

const ConferenceSearch = () => {
  const [location, setLocation] = useState("");
  const [topics, setTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [page, setPage] = useState(1);
  const [allConferences, setAllConferences] = useState([]);
  const [filteredConferences, setFilteredConferences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTitle, setSearchTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    Promise.all([getAllConferences(), getAllTopics()])
      .then(([confs, tops]) => {
        setAllConferences(confs);
        setTopics(tops.value || tops);
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter/search logic
  useEffect(() => {
    let filtered = allConferences.filter((conf) => conf.status === true);

    if (location) {
      filtered = filtered.filter((conf) =>
        conf.location?.toLowerCase().includes(location.toLowerCase())
      );
    }
    if (searchTitle) {
      filtered = filtered.filter((conf) =>
        conf.title?.toLowerCase().includes(searchTitle.toLowerCase())
      );
    }
    if (selectedTopics.length > 0) {
      filtered = filtered.filter((conf) =>
        conf.topics?.some((t) => selectedTopics.includes(t.topicId))
      );
    }

    setFilteredConferences(filtered);
    setPage(1); // Reset về trang 1 khi filter/search
  }, [allConferences, location, searchTitle, selectedTopics]);
  // Hàm để xóa tất cả bộ lọc
  const handleClearFilters = useCallback(() => {
    setLocation("");
    setSearchTitle("");
    setSelectedTopics([]);
    setPage(1);
  }, []);
  // Pagination
  const pagedConferences = filteredConferences.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handleTopicChange = (checkedValues) => {
    setSelectedTopics(checkedValues);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-1/4">
          <Card title="Filter" bordered={false} style={{ marginBottom: 24 }}>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <Search
                placeholder="Search by title"
                allowClear
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                onSearch={(value) => setSearchTitle(value)}
              />
              <Input
                placeholder="Filter by location"
                allowClear
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <div>
                <div style={{ marginBottom: 8, fontWeight: 500 }}>
                  Disciplines
                </div>
                <Checkbox.Group
                  style={{ width: "100%" }}
                  value={selectedTopics}
                  onChange={handleTopicChange}
                >
                  <Space direction="vertical">
                    {topics.map((topic) => (
                      <Checkbox key={topic.topicId} value={topic.topicId}>
                        {topic.topicName}
                      </Checkbox>
                    ))}
                  </Space>
                </Checkbox.Group>
                <Button
                  size="small"
                  type="link"
                  style={{ paddingLeft: 0 }}
                  onClick={() =>
                    setSelectedTopics(topics.map((t) => t.topicId))
                  }
                >
                  Select All
                </Button>
                <Button
                  size="small"
                  type="link"
                  style={{ paddingLeft: 0 }}
                  onClick={() => setSelectedTopics([])}
                >
                  Clear
                </Button>
              </div>
            </Space>
          </Card>
        </aside>
        {/* Main Content */}
        <main className="flex-1">
          {loading ? (
            <LoadingSpinner />
          ) : filteredConferences.length === 0 ? (
            <NotFoundWithClearFilters onClear={handleClearFilters} />
          ) : (
            <div className="flex flex-col gap-6">
              {pagedConferences.map((conf) => (
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
          {!loading && filteredConferences.length > PAGE_SIZE && (
            <div className="flex justify-center mt-8">
              <Pagination
                current={page}
                total={filteredConferences.length}
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
