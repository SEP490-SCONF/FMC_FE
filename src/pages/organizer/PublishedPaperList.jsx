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
  Upload,
} from "antd";
import { SearchOutlined, UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

import {
  getProceedingsByConference,
  createProceeding,
  downloadProceeding,
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
  const [conferenceTitle, setConferenceTitle] = useState("");
  const [conferenceDescription, setConferenceDescription] = useState("");
  const [searchBy, setSearchBy] = useState("title");
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState(null);

  const removeVietnameseTones = (str) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");

  const handleViewDetail = (record) => {
    setSelectedProceeding(record);
    setDetailOpen(true);
  };

  useEffect(() => {
    if (!confId) return;
    setLoading(true);

    Promise.all([
      getProceedingsByConference(confId),
      getPublishedPapersByConferenceId(confId),
      getConferenceTopicsByConferenceId(confId),
      getConferenceById(confId),
    ])
      .then(([procRes, papersRes, topicsRes, conferenceRes]) => {
        // Nếu API trả object, wrap thành mảng
        const procArray = procRes
          ? Array.isArray(procRes)
            ? procRes
            : [procRes]
          : [];
        setProceedings(procArray);

        // Lọc bài Accepted
        const accepted = (papersRes || []).filter(
          (p) =>
            p.paperRevisions?.some((rev) => rev.status === "Accepted") ||
            p.status === "Accepted"
        );
        setPapers(accepted);

        setTopics(topicsRes || []);
        setBannerUrl(
          conferenceRes?.bannerUrl ||
            "https://via.placeholder.com/250x120?text=Conference+Banner"
        );

        setConferenceTitle(conferenceRes?.title || "");
        setConferenceDescription(conferenceRes?.description || "");
      })
      .catch((err) => {
        console.error("❌ Failed to fetch data", err);
        message.error("Failed to load proceedings or papers or topics");
      })
      .finally(() => setLoading(false));
  }, [confId]);

  const handleCreateProceeding = async (values) => {
    try {
      const formData = new FormData();
      formData.append("ConferenceId", confId);
      formData.append("Title", conferenceTitle);
      formData.append("Description", conferenceDescription);
      formData.append("PaperIds", values.paperIds.join(","));
      if (values.coverImage?.file) {
        formData.append("CoverImageFile", values.coverImage.file);
      }
      formData.append("PublishedBy", 1); // hardcode userId
      formData.append("Doi", values.doi || "");

      await createProceeding(formData);
      message.success("Proceeding created successfully!");
      setModalOpen(false);
      form.resetFields();

      const procRes = await getProceedingsByConference(confId);
      setProceedings(procRes ? (Array.isArray(procRes) ? procRes : [procRes]) : []);
    } catch (err) {
      console.error(err);
      message.error("Failed to create proceeding");
    }
  };

  const filteredProceedings = Array.isArray(proceedings)
    ? proceedings.filter((p) => {
        const fieldValue = p[searchBy] || "";
        const value = removeVietnameseTones(fieldValue.toString().toLowerCase());
        const searchValue = removeVietnameseTones(searchText.toLowerCase());
        const matchesSearch = value.includes(searchValue);
        const matchesDate =
          !dateRange ||
          (p.publishedDate &&
            dayjs(p.publishedDate).isBetween(
              dateRange[0],
              dateRange[1],
              "day",
              "[]"
            ));
        return matchesSearch && matchesDate;
      })
    : [];

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
      <a
        href={file}
        target="_blank"
        rel="noopener noreferrer"
        style={{ cursor: "pointer" }}
      >
        Download PDF
      </a>
    ) : (
      "N/A"
    ),
}
,
    {
      title: "Published Date",
      dataIndex: "publishedDate",
      render: (date) => (date ? dayjs(date).format("YYYY-MM-DD") : "N/A"),
    },
    {
      title: "Published By",
      dataIndex: ["publishedBy", "fullName"],
      render: (_, record) => record.publishedBy?.fullName || "N/A",
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", gap: 24 }}>
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
            <Button type="primary" onClick={() => setModalOpen(true)}>
              + Create Proceeding
            </Button>
          </Space>

          <Space style={{ marginBottom: 16, flexWrap: "wrap" }}>
            <Select value={searchBy} onChange={setSearchBy} style={{ width: 160 }}>
              <Option value="title">Title</Option>
              <Option value="description">Description</Option>
              <Option value="publishedBy">Published By</Option>
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
              {selectedProceeding.conferenceTitle || conferenceTitle}
            </p>
            <p>
              <strong>Title:</strong> {selectedProceeding.title}
            </p>
            <p>
              <strong>Description:</strong> {selectedProceeding.description}
            </p>
            <p>
              <strong>File:</strong>{" "}
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
              <strong>Published Date:</strong> {selectedProceeding.publishedDate}
            </p>
            <p>
              <strong>Published By:</strong>{" "}
              {selectedProceeding.publishedBy?.fullName || "N/A"}
            </p>
          </div>
        )}
      </Modal>

      <Modal
        title="Create New Proceeding"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText="Create"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) =>
            handleCreateProceeding({
              ...values,
              title: conferenceTitle,
              description: conferenceDescription,
            })
          }
        >
          <Form.Item
            name="paperIds"
            label="Select Papers (Accepted)"
            rules={[{ required: true, message: "Please select at least one paper" }]}
          >
            <Select mode="multiple" placeholder="Select accepted papers" optionLabelProp="label">
              {papers.map((p) => (
                <Option key={p.paperId} value={p.paperId} label={p.title}>
                  {p.title}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="coverImage" label="Cover Image">
            <Upload maxCount={1} beforeUpload={() => false} listType="picture">
              <Button icon={<UploadOutlined />}>Select Cover Image</Button>
            </Upload>
          </Form.Item>

          <Form.Item name="doi" label="DOI">
            <Input placeholder="DOI (optional)" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
