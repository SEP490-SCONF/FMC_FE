import React, { useState, useRef, useMemo } from "react";
import {
  Table,
  Button,
  Tag,
  message,
  Modal,
  Pagination,
  Input,
  Select,
  Row,
  Col,
} from "antd";
import {
  UploadOutlined,
  EyeOutlined,
  RedoOutlined,
  DollarOutlined,
  FileSearchOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { uploadRevision } from "../../services/PaperRevisionService";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 5;
const { Option } = Select;

const Submited = ({ submissions = [], userId, conferenceId }) => {
  const [openIdx, setOpenIdx] = useState(null);
  const [uploadingIdx, setUploadingIdx] = useState(null);
  const [pendingPaperId, setPendingPaperId] = useState(null);
  const navigate = useNavigate();

  const [page, setPage] = useState(1);

  // --- Filters & Sorting ---
  const [searchText, setSearchText] = useState("");
  const [searchBy, setSearchBy] = useState("title");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("latest");

  // Sort + Filter logic
  const filteredAndSortedSubmissions = useMemo(() => {
    let filtered = submissions.filter((item) => {
      const field = (item[searchBy] || "").toString().toLowerCase();
      const matchSearch = field.includes(searchText.toLowerCase());
      const matchStatus =
        statusFilter === "All" || item.status === statusFilter;
      return matchSearch && matchStatus;
    });

    return filtered.sort((a, b) => {
      const getTime = (record) => {
        const lastRevision = record.paperRevisions?.[record.paperRevisions.length - 1];
        return lastRevision
          ? new Date(lastRevision.submittedAt).getTime()
          : 0;
      };
      if (sortBy === "latest") return getTime(b) - getTime(a);
      if (sortBy === "oldest") return getTime(a) - getTime(b);
      if (sortBy === "titleAsc")
        return a.title.localeCompare(b.title, "en", { sensitivity: "base" });
      if (sortBy === "titleDesc")
        return b.title.localeCompare(a.title, "en", { sensitivity: "base" });
      return 0;
    });
  }, [submissions, searchText, searchBy, statusFilter, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedSubmissions.length / ITEMS_PER_PAGE);
  const pagedSubmissions = filteredAndSortedSubmissions.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  // --- Handle resubmit ---
  const handleResubmit = (status, paperId) => {
    if (status === "Need Revision") {
      setPendingPaperId(paperId);
      document.getElementById("upload-input").click();
    } else {
      message.warning("You cannot resubmit this paper unless it needs revision.");
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      message.error("Only PDF files are allowed.");
      return;
    }
    if (!pendingPaperId) return;

    setUploadingIdx(pendingPaperId);
    const formData = new FormData();
    formData.append("PdfFile", file);
    formData.append("PaperId", pendingPaperId);

    try {
      await uploadRevision(formData);
      message.success("Resubmission successful!");
      setTimeout(() => window.location.reload(), 2000);
    } catch (err) {
      message.error(err.message || "Resubmission failed!");
    } finally {
      setUploadingIdx(null);
      setPendingPaperId(null);
    }
  };

  // --- Table Columns ---
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Topic",
      dataIndex: "topicName",
      key: "topicName",
      render: (topic) => topic || "N/A",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const colors = {
          Submitted: "green",
          "Need Revision": "gold",
          Rejected: "red",
          "Under Review": "blue",
          Accepted: "purple",
        };
        return <Tag color={colors[status] || "default"}>{status}</Tag>;
      },
    },
    {
      title: "Last Submitted",
      key: "lastSubmitted",
      render: (_, record) => {
        const lastRevision = record.paperRevisions?.[record.paperRevisions.length - 1];
        return lastRevision
          ? new Date(lastRevision.submittedAt).toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
          : "";
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            icon={<EyeOutlined />}
            type="link"
            onClick={() => setOpenIdx(record.paperId)}
          >
            View Revisions
          </Button>
          <Button
            icon={<RedoOutlined />}
            type="link"
            disabled={record.status !== "Need Revision" || uploadingIdx === record.paperId}
            onClick={() => handleResubmit(record.status, record.paperId)}
          >
            {uploadingIdx === record.paperId ? "Uploading..." : "Resubmit"}
          </Button>
          {record.status === "Accepted" && (
            <>
              <Button
                icon={<FileSearchOutlined />}
                type="link"
                onClick={() => navigate(`/author/view-certificates/${record.paperId}`)}
              >
                Certificate
              </Button>
              <Button
                icon={<DollarOutlined />}
                type="link"
                onClick={() =>
                  navigate(`/author/payment/${record.paperId}`, {
                    state: { userId, conferenceId, paperId: record.paperId },
                  })
                }
              >
                Payment
              </Button>
            </>
          )}
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <input
        id="upload-input"
        type="file"
        accept="application/pdf"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* Search and Filters */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={6}>
          <Select
            value={searchBy}
            onChange={setSearchBy}
            style={{ width: "100%" }}
          >
            <Option value="title">Title</Option>
            <Option value="topicName">Topic</Option>
            <Option value="status">Status</Option>
          </Select>
        </Col>
        <Col xs={24} sm={10}>
          <Input
            placeholder={`Search by ${searchBy}`}
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Col>
        <Col xs={24} sm={4}>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: "100%" }}
          >
            <Option value="All">All Status</Option>
            <Option value="Submitted">Submitted</Option>
            <Option value="Need Revision">Need Revision</Option>
            <Option value="Under Review">Under Review</Option>
            <Option value="Accepted">Accepted</Option>
            <Option value="Rejected">Rejected</Option>
          </Select>
        </Col>
        <Col xs={24} sm={4}>
          <Select
            value={sortBy}
            onChange={setSortBy}
            style={{ width: "100%" }}
          >
            <Option value="latest">Latest Submission</Option>
            <Option value="oldest">Oldest Submission</Option>
            <Option value="titleAsc">Title A-Z</Option>
            <Option value="titleDesc">Title Z-A</Option>
          </Select>
        </Col>
      </Row>

      {/* Table */}
      <Table
        dataSource={pagedSubmissions}
        columns={columns}
        rowKey="paperId"
        pagination={false}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          current={page}
          total={filteredAndSortedSubmissions.length}
          pageSize={ITEMS_PER_PAGE}
          onChange={(p) => setPage(p)}
          style={{ marginTop: 16, textAlign: "center" }}
        />
      )}

      {/* Modal for viewing revisions */}
      <Modal
        open={openIdx !== null}
        title="Paper Revisions"
        onCancel={() => setOpenIdx(null)}
        footer={null}
        width={600}
      >
        {openIdx !== null && (
          <Table
            dataSource={
              submissions.find((s) => s.paperId === openIdx)?.paperRevisions || []
            }
            columns={[
              { title: "#", render: (_, __, i) => i + 1 },
              { title: "Status", dataIndex: "status", render: (status) => <Tag>{status}</Tag> },
              {
                title: "Submitted At",
                dataIndex: "submittedAt",
                render: (date) =>
                  date
                    ? new Date(date).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                    : "",
              },
              {
                title: "Actions",
                render: (_, record) => (
                  <Button
                    icon={<EyeOutlined />}
                    onClick={() =>
                      navigate(`/author/view-paper-review/${record.revisionId}`)
                    }
                  >
                    View Review
                  </Button>
                ),
              },
            ]}
            rowKey="revisionId"
            pagination={false}
          />
        )}
      </Modal>
    </div>
  );
};

export default Submited;
