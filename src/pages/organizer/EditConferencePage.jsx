import React, { useEffect, useState } from "react";
import { useParams ,useNavigate} from "react-router-dom";
import ConferenceOrganizer from "../../components/layout/organizer/ConferenceOrganizer";
import {
  getConferenceById,
  updateConference,
} from "../../services/ConferenceService";

import {
  Card,
  Button,
  Spin,
  Descriptions,
  Tag,
  Form,
  Input,
  DatePicker,
  Switch,
  Upload,
  Select,
  message,
} from "antd";
import dayjs from "dayjs";
import { UploadOutlined } from "@ant-design/icons";
import { getAllTopics } from "../../services/TopicService"; // thêm nếu cần lấy topic list

const { TextArea } = Input;
const { RangePicker } = DatePicker;

const EditConferencePage = () => {
  const { conferenceId } = useParams();
  const [conference, setConference] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();
  const [topics, setTopics] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    fetchConference();
    fetchTopics();
  }, [conferenceId]);

  const fetchConference = async () => {
    try {
      const data = await getConferenceById(conferenceId);

      if (!data) {
        navigate("/not-found");
        return;
      }

      setConference(data);
    } catch {
      navigate("/not-found");
    } finally {
      setLoading(false);
    }
  };

  const fetchTopics = async () => {
    try {
      const data = await getAllTopics();
      setTopics(data);
    } catch (error) {
      console.error("Failed to fetch topics", error);
    }
  };

  const handleEditClick = () => {
    form.setFieldsValue({
      title: conference.title,
      description: conference.description,
      location: conference.location,
      status: conference.status,
      dateRange: [dayjs(conference.startDate), dayjs(conference.endDate)],
      topicIds: conference.topics?.map((t) => t.topicId) || [],
    });
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleUpdate = async (values) => {
    const formData = new FormData();
    formData.append("Title", values.title);
    formData.append("Description", values.description || "");
    formData.append("Location", values.location || "");
    formData.append("StartDate", values.dateRange?.[0]?.toISOString() || "");
    formData.append("EndDate", values.dateRange?.[1]?.toISOString() || "");
    formData.append("Status", values.status ? "true" : "false");

    if (values.topicIds?.length > 0) {
      values.topicIds.forEach((id) => formData.append("TopicIds", id));
    }

    if (values.bannerImage?.file instanceof File) {
      formData.append("BannerImage", values.bannerImage.file);
    }

    try {
      await updateConference(conferenceId, formData);
      message.success("✅ Conference updated successfully");
      setEditing(false);
      fetchConference(); // Reload updated data
    } catch (error) {
      console.error("❌ Update failed:", error);
      message.error("Update failed");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!conference) {
    return (
      <p style={{ textAlign: "center", color: "red" }}>Conference not found.</p>
    );
  }

  return (
    <Card
      title="📘 Conference Information"
      extra={editing ? null : <Button onClick={handleEditClick}>Edit</Button>}
      style={{ maxWidth: 900, margin: "auto", marginTop: 40 }}
    >
      {!editing ? (
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Title">
            {conference.title}
          </Descriptions.Item>
          <Descriptions.Item label="Description">
            {conference.description}
          </Descriptions.Item>
          <Descriptions.Item label="Location">
            {conference.location}
          </Descriptions.Item>
          <Descriptions.Item label="Start Date">
            {dayjs(conference.startDate).format("YYYY-MM-DD")}
          </Descriptions.Item>
          <Descriptions.Item label="End Date">
            {dayjs(conference.endDate).format("YYYY-MM-DD")}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={conference.status ? "green" : "red"}>
              {conference.status ? "Active" : "Inactive"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Topics">
            {conference.topics?.length > 0
              ? conference.topics.map((t) => (
                  <Tag key={t.topicId}>{t.topicName}</Tag>
                ))
              : "No topics"}
          </Descriptions.Item>
          <Descriptions.Item label="Banner">
            {conference.bannerUrl ? (
              <img
                src={conference.bannerUrl}
                alt="Banner"
                style={{ maxWidth: "100%", maxHeight: 200 }}
              />
            ) : (
              "No banner uploaded"
            )}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <Form layout="vertical" form={form} onFinish={handleUpdate}>
          <Form.Item label="Title" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item label="Location" name="location">
            <Input />
          </Form.Item>
          <Form.Item
            label="Date Range"
            name="dateRange"
            rules={[{ required: true }]}
          >
            <RangePicker />
          </Form.Item>
          <Form.Item label="Status" name="status" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item label="Topics" name="topicIds">
            <Select mode="multiple" allowClear>
              {topics.map((topic) => (
                <Select.Option key={topic.topicId} value={topic.topicId}>
                  {topic.topicName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Upload New Banner" name="bannerImage">
            <Upload
              listType="picture"
              accept="image/*"
              showUploadList={false}
              beforeUpload={(file) => {
                const reader = new FileReader();
                reader.onload = () => {
                  setPreviewImage({
                    url: reader.result,
                    name: file.name,
                    file: file,
                  });
                  form.setFieldsValue({ bannerImage: { file } });
                };
                reader.readAsDataURL(file);
                return false; // Prevent upload
              }}
            >
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>

            {previewImage && (
              <div style={{ marginTop: 10 }}>
                <img
                  src={previewImage.url}
                  alt="Preview"
                  style={{ maxWidth: "100%", maxHeight: 300, borderRadius: 8 }}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: 5,
                  }}
                >
                  <span style={{ marginRight: 8 }}>{previewImage.name}</span>
                  <Button
                    type="text"
                    danger
                    size="small"
                    onClick={() => {
                      setPreviewImage(null);
                      form.setFieldsValue({ bannerImage: null });
                    }}
                  >
                    🗑️
                  </Button>
                </div>
              </div>
            )}
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
              Save
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </Form.Item>
        </Form>
      )}
    </Card>
  );
};

export default EditConferencePage;
