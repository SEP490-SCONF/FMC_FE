import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Card,
  Button,
  List,
  Modal,
  Spin,
  message,
  Form,
  Input,
  Upload,
  Select,
  Space,
} from "antd";
import { UploadOutlined,BookOutlined, EditOutlined} from "@ant-design/icons";
import dayjs from "dayjs";

import {
  getProceedingsByConference,
  createProceeding,
  updateProceeding,
} from "../../services/ProceedingService";
import { getPublishedPapersByConferenceId } from "../../services/PaperSerice";
import { getConferenceById } from "../../services/ConferenceService";
import PDFBookViewer from "../../components/organizer/PDFBookViewer";

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

export default function PublishedPaperList() {
  const { conferenceId, id } = useParams();
  const confId = conferenceId || id;

  const [loading, setLoading] = useState(false);
  const [conference, setConference] = useState(null);
  const [proceeding, setProceeding] = useState(null);
  const [papers, setPapers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
const [currentPage, setCurrentPage] = useState(1);
const pageSize = 4;

  // Create / Edit state
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingProceeding, setEditingProceeding] = useState(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  useEffect(() => {
  if (!confId) return;
  setLoading(true);

  Promise.all([
    getProceedingsByConference(confId).catch((err) => {
      console.warn("No proceeding found:", err);
      return null; // trả về null nếu không có proceeding
    }),
    getPublishedPapersByConferenceId(confId).catch((err) => {
      console.error("Failed to load papers:", err);
      return [];
    }),
    getConferenceById(confId).catch((err) => {
      console.error("Failed to load conference:", err);
      return {};
    }),
  ])
    .then(([procRes, papersRes, confRes]) => {
      const procArray = procRes ? (Array.isArray(procRes) ? procRes : [procRes]) : [];
      setProceeding(procArray[0] || null);

      const accepted = (papersRes || []).filter(
        (p) =>
          p.paperRevisions?.some((rev) => rev.status === "Accepted") ||
          p.status === "Accepted"
      );
      setPapers(accepted);

      setConference(confRes || {});
    })
    .finally(() => setLoading(false));
}, [confId]);

// Hàm bỏ dấu tiếng Việt
const removeVietnameseTones = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // loại bỏ dấu
    .toLowerCase();
};

// filter papers theo search
const filteredPapers = papers.filter((p) => {
  const search = removeVietnameseTones(searchText);
  const title = removeVietnameseTones(p.title || "");
  const author = removeVietnameseTones(p.name || "");
  return title.includes(search) || author.includes(search);
});

// tính số trang
const totalPages = Math.ceil(filteredPapers.length / pageSize);

// lấy dữ liệu cho page hiện tại
const paginatedPapers = filteredPapers.slice(
  (currentPage - 1) * pageSize,
  currentPage * pageSize
);

  // Handle Create Proceeding
  const handleCreateProceeding = async (values) => {
    try {
      const formData = new FormData();
      formData.append("ConferenceId", confId);
      formData.append("Title", conference?.title || "");
      formData.append("Description", conference?.description || "");
      formData.append("PaperIds", values.paperIds.join(","));
      if (values.coverImage?.file) {
        formData.append("CoverImageFile", values.coverImage.file);
      }
      formData.append("PublishedBy", 1);
      formData.append("Doi", values.doi || "");

      await createProceeding(formData);
      message.success("Proceeding created successfully!");
      setCreateModalVisible(false);
      form.resetFields();

      const procRes = await getProceedingsByConference(confId);
      setProceeding(procRes ? (Array.isArray(procRes) ? procRes[0] : procRes) : null);
    } catch (err) {
      console.error("❌ Create proceeding error:", err);
      message.error("Failed to create proceeding");
    }
  };

  // Handle Edit Proceeding
  const handleEditProceeding = (proc) => {
    setEditingProceeding(proc);
    editForm.setFieldsValue({
      paperIds: proc.papers?.map((p) => p.paperId) || [],
      doi: proc.doi || "",
    });
    setEditModalVisible(true);
  };

  

  const handleUpdateProceeding = async (values) => {
    try {
      const formData = new FormData();
      formData.append("Title", conference?.title || "");
      formData.append("Description", conference?.description || "");
      formData.append("PaperIds", values.paperIds.join(","));
      if (values.coverImage?.file) {
        formData.append("CoverImageFile", values.coverImage.file);
      }
      formData.append("PublishedBy", 1);
      formData.append("Doi", values.doi || "");

      await updateProceeding(editingProceeding.proceedingId, formData);
      message.success("Proceeding updated successfully!");
      setEditModalVisible(false);
      editForm.resetFields();

      const procRes = await getProceedingsByConference(confId);
      setProceeding(procRes ? (Array.isArray(procRes) ? procRes[0] : procRes) : null);
    } catch (err) {
      console.error("❌ Update proceeding error:", err);
      message.error("Failed to update proceeding");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 80 }}>
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      {/* Banner */}
      {conference?.bannerUrl && (
        <div style={{ marginBottom: 24 }}>
          <img
            src={conference.bannerUrl}
            alt="Conference Banner"
            style={{
              width: "100%",
              height: 400, 
              objectFit: "cover", 
              borderRadius: 8,
            }}
          />
        </div>
      )}

      {/* Proceeding Info */}
      <Card style={{ marginBottom: 24 }}>
        <Title level={4}>📚 Proceeding</Title>
        {proceeding ? (
          <>
            <Paragraph>
              <strong>Conference:</strong> {proceeding.title}
            </Paragraph>
            <Paragraph>
              <strong>Description:</strong> {proceeding.description}
            </Paragraph>
            <Paragraph>
              <strong>DOI:</strong> {proceeding.doi || "N/A"}
            </Paragraph>
            <Paragraph>
              <strong>Published Date:</strong>{" "}
              {proceeding.publishedDate
                ? dayjs(proceeding.publishedDate).format("YYYY-MM-DD")
                : "N/A"}
            </Paragraph>
            <Paragraph>
              <strong>Published By:</strong> {proceeding.publishedBy?.fullName || "N/A"}
            </Paragraph>

            <Space style={{ marginTop: 16, gap: 12 }}>
  <Button
    style={{
      background: "#4facfe",
      color: "#fff",
      fontWeight: 500,
      padding: "0 20px",
      height: 42,
      fontSize: 14,
      borderRadius: 6,
      display: "flex",
      alignItems: "center",
      gap: 6,
      border: "none",
    }}
    onClick={() => setModalVisible(true)}
  >
    <BookOutlined style={{ fontSize: 18 }} />
    View Published Papers ({papers.length})
  </Button>

  <Button
    style={{
      background: "#43e97b",
      color: "#fff",
      fontWeight: 500,
      padding: "0 20px",
      height: 42,
      fontSize: 14,
      borderRadius: 6,
      display: "flex",
      alignItems: "center",
      gap: 6,
      border: "none",
    }}
    onClick={() => handleEditProceeding(proceeding)}
  >
    <EditOutlined style={{ fontSize: 18 }} />
    Edit Proceeding
  </Button>
</Space>



          </>
        ) : (
          <Button type="primary" onClick={() => setCreateModalVisible(true)}>
            + Create Proceeding
          </Button>
        )}
      </Card>

      {/* Flipbook */}
      {proceeding?.filePath ? (
        <Card style={{ marginBottom: 24 }}>
          <Title level={4}>📖 Flipbook</Title>
          <PDFBookViewer pdfUrl={proceeding.filePath} />
        </Card>
      ) : (
        <p>No PDF uploaded.</p>
      )}

      {/* Modal hiển thị Published Papers */}
<Modal
  title="📝 Published Papers"
  open={modalVisible}
  onCancel={() => {
    setModalVisible(false);
    setSearchText("");
    setCurrentPage(1);
  }}
  footer={null}
  width={720}
>
  <Input
    placeholder="Search by title or author..."
    value={searchText}
    onChange={(e) => {
      setSearchText(e.target.value);
      setCurrentPage(1);
    }}
    style={{ marginBottom: 16 }}
  />

  {filteredPapers.length === 0 ? (
    <Text>No papers found.</Text>
  ) : (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {paginatedPapers.map((paper) => (
          <Card
            key={paper.paperId}
            hoverable
            bordered={false}
            style={{
              borderRadius: 8,
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              marginBottom: 12,
            }}
          >
            <Title level={5} style={{ marginBottom: 4 }}>
              {paper.title}
            </Title>
            <Text style={{ fontSize: 14, color: "#555" }}>
              Authors: {paper.name || "N/A"}
            </Text>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div style={{ textAlign: "center", marginTop: 16 }}>
        <Space>
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </Button>
          <Text>
            Page {currentPage} / {totalPages}
          </Text>
          <Button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </Button>
        </Space>
      </div>
    </>
  )}
</Modal>



      {/* Create Proceeding Modal */}
      <Modal
        title="Create New Proceeding"
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onOk={() => form.submit()}
        okText="Create"
      >
        <Form form={form} layout="vertical" onFinish={handleCreateProceeding}>
          <Form.Item
            name="paperIds"
            label="Select Papers"
            rules={[{ required: true, message: "Please select at least one paper" }]}
          >
            <Select mode="multiple" placeholder="Select published papers" optionLabelProp="label">
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

      {/* Edit Proceeding Modal */}
      <Modal
        title="Edit Proceeding"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={() => editForm.submit()}
        okText="Update"
      >
        <Form form={editForm} layout="vertical" onFinish={handleUpdateProceeding}>
          <Form.Item
            name="paperIds"
            label="Select Papers"
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
