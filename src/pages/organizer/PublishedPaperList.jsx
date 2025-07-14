import React, { useEffect, useState } from "react";
import { getPublishedPapersByConferenceId } from "../../services/PaperSerice";
import { useParams } from "react-router-dom";
import {
  Collapse,
  Typography,
  message,
  Empty,
  Space,
  Pagination,
  Input,
} from "antd";
import { FileTextOutlined, SearchOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Panel } = Collapse;

export default function PublishedPaperList() {
  const { conferenceId, id } = useParams();
  const confId = conferenceId || id;
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");

  const pageSize = 2;

  useEffect(() => {
    if (!confId) return;

    getPublishedPapersByConferenceId(confId)
      .then((res) => {
        const result = Array.isArray(res) ? res : [];
        setPapers(result);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch published papers", err);
        message.error("Failed to load published papers");
        setPapers([]);
      })
      .finally(() => setLoading(false));
  }, [confId]);

  // 🔍 Lọc papers theo tiêu đề
  const filteredPapers = papers.filter((paper) =>
    paper.title.toLowerCase().includes(searchText.toLowerCase())
  );

  // 📄 Pagination sau khi lọc
  const indexOfLast = currentPage * pageSize;
  const indexOfFirst = indexOfLast - pageSize;
  const currentPapers = filteredPapers.slice(indexOfFirst, indexOfLast);

  return (
    <div className="p-6">
      <Title level={3} style={{ marginBottom: 16 }}>
        📢 Published Papers
      </Title>

      <Input
        prefix={<SearchOutlined />}
        placeholder="Search paper title..."
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value);
          setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
        }}
        style={{ maxWidth: 400, marginBottom: 24 }}
        allowClear
      />

      {filteredPapers.length === 0 && !loading ? (
        <Empty description="No published papers found." />
      ) : (
        <>
          <Collapse accordion>
            {currentPapers.map((paper) => {
              const acceptedRevision = paper.paperRevisions?.find(
                (rev) => rev.status === "Accepted"
              );

              return (
                <Panel
                  key={paper.paperId}
                  header={
                    <Space>
                      <FileTextOutlined style={{ color: "#1677ff" }} />
                      <Text strong style={{ fontSize: "16px", color: "#1677ff" }}>
                        {paper.title}
                      </Text>
                    </Space>
                  }
                >
                  <p>
                    <Text strong>📚 Topic:</Text> {paper.topicName || "N/A"}
                  </p>
                  <p>
                    <Text strong>👨‍💻 Author:</Text> {paper.name || "N/A"}
                  </p>
                  <p>
                    <Text strong>🕓 Submit Date:</Text>{" "}
                    {acceptedRevision?.submittedAt
                      ? new Date(acceptedRevision.submittedAt).toLocaleString()
                      : "N/A"}
                  </p>
                  <p>
                    <Text strong>📌 Status:</Text>{" "}
                    {acceptedRevision?.status || "N/A"}
                  </p>
                  <p>
                    <Text strong>📎 File:</Text>{" "}
                    {acceptedRevision?.filePath ? (
                      <a
                        href={acceptedRevision.filePath}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View PDF
                      </a>
                    ) : (
                      "No accepted file"
                    )}
                  </p>
                </Panel>
              );
            })}
          </Collapse>

          {/* Pagination */}
          <div style={{ marginTop: 24, textAlign: "center" }}>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredPapers.length}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
            />
          </div>
        </>
      )}
    </div>
  );
}
