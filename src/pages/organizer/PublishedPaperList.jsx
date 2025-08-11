// src/pages/ProceedingsPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Space,
  Typography,
  DatePicker,
  Select,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

import {
  getProceedingsByConferenceId,
  createProceedingFromPaper,
} from "../../services/ProceedingService";
import { getPublishedPapersByConferenceId } from "../../services/PaperSerice";
import { getConferenceTopicsByConferenceId } from "../../services/ConferenceTopicService";
import { getConferenceById } from "../../services/ConferenceService";

const { Title } = Typography;
const { Option } = Select;

export default function ProceedingsPage() {
  const { conferenceId, id } = useParams();
  const confId = conferenceId || id;

  const [loading, setLoading] = useState(false);
  const [proceedings, setProceedings] = useState([]);
  const [papers, setPapers] = useState([]);
  const [topics, setTopics] = useState([]);
  const [bannerUrl, setBannerUrl] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedProceeding, setSelectedProceeding] = useState(null);

  // Search & Filter states
  const [searchBy, setSearchBy] = useState("title");
  const [searchText, setSearchText] = useState("");
  const [fileFilter, setFileFilter] = useState("All");
  const [dateRange, setDateRange] = useState(null);
  const removeVietnameseTones = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};


  const handleViewDetail = (record) => {
    setSelectedProceeding(record);
    setDetailOpen(true);
  };

  // Fetch data
  useEffect(() => {
    if (!confId) return;
    setLoading(true);

    Promise.all([
      getProceedingsByConferenceId(confId),
      getPublishedPapersByConferenceId(confId),
      getConferenceTopicsByConferenceId(confId),
      getConferenceById(confId),
    ])
      .then(([procRes, papersRes, topicsRes, conferenceRes]) => {
        setProceedings(procRes || []);
        console.log(procRes);


        const accepted = (papersRes || []).filter((p) =>
          p.paperRevisions?.some((rev) => rev.status === "Accepted")
        );
        setPapers(accepted);

        setTopics(topicsRes || []);

        setBannerUrl(
          conferenceRes?.bannerUrl ||
            "https://via.placeholder.com/250x120?text=Conference+Banner"
        );
      })
      .catch((err) => {
        console.error("❌ Failed to fetch data", err);
        message.error("Failed to load proceedings or papers or topics");
      })
      .finally(() => setLoading(false));
  }, [confId]);

  // Create proceeding
  const handleCreateProceeding = async (values) => {
    try {
      await createProceedingFromPaper({
        paperId: values.paperId,
        conferenceId: confId,
        title: values.title,
        description: values.description,
      });
      message.success("Proceeding created successfully!");
      setModalOpen(false);
      form.resetFields();

      const procRes = await getProceedingsByConferenceId(confId);
      setProceedings(procRes || []);
    } catch (err) {
      console.error(err);
      message.error("Failed to create proceeding");
    }
  };

  // Filtered data
 const filteredProceedings = proceedings.filter((p) => {
  const fieldValue = p[searchBy] || "";
  const value = removeVietnameseTones(fieldValue.toString().toLowerCase());
  const searchValue = removeVietnameseTones(searchText.toLowerCase());

  const matchesSearch = value.includes(searchValue);

  

  const matchesDate =
    !dateRange ||
    (p.publishedDate &&
      dayjs(p.publishedDate).isBetween(dateRange[0], dateRange[1], "day", "[]"));

  return matchesSearch && matchesDate;
});


  const columns = [
    {
      title: "ID",
      render: (_, __, index) => index + 1,
      width: 60,
    },
    {
      title: "Title",
      dataIndex: "title",
      render: (_, record) => (
        <a onClick={() => handleViewDetail(record)}>{record.title}</a>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      ellipsis: true,
    },
    {
      title: "File",
      dataIndex: "filePath",
      render: (file) =>
        file ? (
          <a href={file} target="_blank" rel="noopener noreferrer">
            View PDF
          </a>
        ) : (
          "N/A"
        ),
    },
    {
      title: "Published Date",
      dataIndex: "publishedDate",
    },
    {
      title: "Published By",
      dataIndex: "publishedByName",
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", gap: 24 }}>
        {/* Left column */}
        <div style={{ flex: "0 0 250px" }}>
          {bannerUrl && (
            <div style={{ marginBottom: 16 }}>
              <img
                src={bannerUrl}
                alt="Conference Banner"
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "160px",
                  borderRadius: 8,
                  objectFit: "cover",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              />
            </div>
          )}

          <div>
            <Title level={5}>📂 Topics</Title>
            <ul style={{ paddingLeft: 20, listStyle: "disc" }}>
              {topics.map((t) => (
                <li key={t.topicId}>{t.topicName}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right column */}
        <div style={{ flex: 1 }}>
          <Space
            style={{
              marginBottom: 16,
              width: "100%",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <Title level={3}>📚 Proceedings</Title>
            {/* <Button type="primary" onClick={() => setModalOpen(true)}>
              + Create Proceeding
            </Button> */}
          </Space>

          {/* Search & Filter */}
          <Space style={{ marginBottom: 16, flexWrap: "wrap" }}>
            <Select
              value={searchBy}
              onChange={setSearchBy}
              style={{ width: 160 }}
            >
              <Option value="title">Title</Option>
              <Option value="description">Description</Option>
              <Option value="publishedByName">Published By</Option>
            </Select>

            <Input
              placeholder={`Search by ${searchBy}`}
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />

         

            <DatePicker.RangePicker
              style={{ width: 260 }}
              onChange={(dates) => setDateRange(dates)}
              format="YYYY-MM-DD"
            />
          </Space>

          {/* Table */}
          <Table
            bordered
            dataSource={filteredProceedings}
            columns={columns}
            rowKey={(record) => record.proceedingId || record.id}
            loading={loading}
            pagination={{ pageSize: 5 }}
          />
        </div>
      </div>

      {/* Modal View Detail */}
      <Modal
        title="Proceeding Detail"
        open={detailOpen}
        footer={null}
        onCancel={() => setDetailOpen(false)}
      >
        {selectedProceeding && (
          <div>
            <p>
              <strong>Conference:</strong>{" "}
              {selectedProceeding.conferenceTitle}
            </p>
            <p>
              <strong>Title:</strong> {selectedProceeding.title}
            </p>
            <p>
              <strong>Description:</strong>{" "}
              {selectedProceeding.description}
            </p>
            <p>
              <strong>FilePath:</strong>{" "}
              {selectedProceeding.filePath ? (
                <a
                  href={selectedProceeding.filePath}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {selectedProceeding.filePath}
                </a>
              ) : (
                "N/A"
              )}
            </p>
            <p>
              <strong>PublishedDate:</strong>{" "}
              {selectedProceeding.publishedDate}
            </p>
            <p>
              <strong>CreatedAt:</strong> {selectedProceeding.createdAt}
            </p>
            <p>
              <strong>UpdatedAt:</strong> {selectedProceeding.updatedAt}
            </p>
            <p>
              <strong>PublishedBy:</strong>{" "}
              {selectedProceeding.publishedByName}
            </p>
          </div>
        )}
      </Modal>

      {/* Modal Create Proceeding */}
      <Modal
        title="Create New Proceeding"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText="Create"
      >
        <Form form={form} layout="vertical" onFinish={handleCreateProceeding}>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter title" }]}
          >
            <Input placeholder="Proceeding title" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea placeholder="Description" rows={3} />
          </Form.Item>

          <Form.Item
            name="paperId"
            label="Select Paper (Accepted)"
            rules={[{ required: true, message: "Please select a paper" }]}
          >
            <select style={{ width: "100%", padding: 8 }}>
              <option value="">-- Select Paper --</option>
              {papers.map((p) => (
                <option key={p.paperId} value={p.paperId}>
                  {p.title}
                </option>
              ))}
            </select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
