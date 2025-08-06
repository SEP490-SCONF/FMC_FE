import React, { useEffect, useState } from "react";
import {
  getTimelinesByConferenceId,
  createTimeline,
  updateTimeline,
  deleteTimeline,
} from "../../services/TimelineService";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  message,
  Popconfirm,
  Typography,
} from "antd";
import {
  PlusOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";

const { Text } = Typography;

export default function ManageTimeline() {
  const { conferenceId } = useParams();
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const bgColors = [
  "bg-blue-100",
  "bg-green-100",
  "bg-yellow-100",
  "bg-purple-100",
  "bg-pink-100",
  "bg-orange-100",
  "bg-teal-100",
  "bg-red-100",
];

  const showDeleteConfirm = (id, onDelete) => {
    Modal.confirm({
      title: (
        <Text strong type="danger" style={{ fontSize: "18px" }}>
          ⚠️ Confirm Deletion
        </Text>
      ),
      icon: <ExclamationCircleOutlined style={{ color: "#faad14" }} />,
      content: (
        <div>
          <p>This action <Text strong>cannot be undone</Text>.</p>
          <p>Are you sure you want to delete this timeline?</p>
        </div>
      ),
      okText: "Yes, delete it",
      cancelText: "Cancel",
      okType: "danger",
      centered: true,
      onOk: () => onDelete(id),
    });
  };

  const fetchData = () => {
    if (!conferenceId) {
      message.error("Missing conferenceId");
      return;
    }

    getTimelinesByConferenceId(conferenceId)
      .then((res) => {
        setList(res);
        setFilteredList(res);
      })
      .catch((err) => {
        console.error("❌ Failed to load timelines", err);
        message.error("Failed to load timelines");
        setList([]);
        setFilteredList([]);
      });
  };

  useEffect(() => {
    if (conferenceId) {
      fetchData();
    }
  }, [conferenceId]);

  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = list.filter((item) =>
      item.description.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredList(filtered);
  };

  const handleSubmit = (values) => {
    const formData = new FormData();
    formData.append("conferenceId", conferenceId);
    formData.append("description", values.description);
    formData.append("date", values.date.format("YYYY-MM-DDTHH:mm:ss"));


    setLoading(true);

    const action = editing
      ? updateTimeline(editing.timeLineId, formData)
      : createTimeline(formData);

    action
      .then(() => {
        message.success(`${editing ? "Updated" : "Created"} successfully`);
        setOpen(false);
        form.resetFields();
        setEditing(null);
        fetchData();
      })
      .catch((error) => {
        console.error("Error:", error);
        message.error("Something went wrong");
      })
      .finally(() => setLoading(false));
  };

  const handleEdit = (item) => {
    setEditing(item);
    form.setFieldsValue({
      description: item.description,
      date: dayjs(item.date),
    });
    setOpen(true);
  };

  const handleDelete = (id) => {
    deleteTimeline(id)
      .then(() => {
        message.success("Deleted successfully");
        fetchData();
      })
      .catch((error) => {
        console.error("Delete failed", error);
        message.error("Failed to delete");
      });
  };

  const columns = [
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (value) => dayjs(value).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <>
          <Button onClick={() => handleEdit(record)} size="small">
            Edit
          </Button>{" "}
          <Button
            danger
            size="small"
            onClick={() => showDeleteConfirm(record.timeLineId, handleDelete)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4 items-center">
        <h2 className="text-2xl font-semibold text-blue-600">
          🗓️ Timeline Management
        </h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            form.resetFields();
            setEditing(null);
            setOpen(true);
          }}
        >
          Add Timeline
        </Button>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Search description..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: "300px" }}
        />
      </div>

      <Table
  columns={columns}
  dataSource={filteredList}
  rowKey="timeLineId"
  pagination={{ pageSize: 5 }}
  locale={{
    emptyText: (
      <div className="text-center text-gray-500">
       No timeline has been created for this conference.
      </div>
    ),
  }}
/>


      <Modal
        title={editing ? "Update Timeline" : "Create Timeline"}
        open={open}
        onCancel={() => {
          setOpen(false);
          setEditing(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        confirmLoading={loading}
        okText={editing ? "Update" : "Create"}
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
            <Form.Item
            name="date"
            label="Timeline Date & Time"
            rules={[{ required: true, message: "Please select date and time" }]}
            >
            <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm"
                style={{ width: "100%" }}
            />
            </Form.Item>
        </Form>
      </Modal>

      {/* Timeline Section */}

<div className="pt-8">
  <h3 className="text-xl font-bold text-blue-700 mb-4 text-center">
    Timeline
  </h3>

  <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-center text-gray-700 relative">
    {list.length === 0 ? (
      <div className="text-gray-500 text-center">No timeline available</div>
    ) : (
      list
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map((item, index) => {
          const bgColors = [
            "bg-blue-100",
            "bg-green-100",
            "bg-yellow-100",
            "bg-purple-100",
            "bg-pink-100",
            "bg-orange-100",
            "bg-red-100",
            "bg-teal-100",
          ];
          const textColors = [
            "text-blue-800",
            "text-green-800",
            "text-yellow-800",
            "text-purple-800",
            "text-pink-800",
            "text-orange-800",
            "text-red-800",
            "text-teal-800",
          ];
          const bgColor = bgColors[index % bgColors.length];
          const textColor = textColors[index % textColors.length];

          return (
            <div key={item.timeLineId} className="relative flex items-center">
              {/* Đường nối giữa các ô - không hiển thị ở ô đầu tiên */}
              {index > 0 && (
                <div className="w-6 h-1 bg-gray-300 mx-2 rounded"></div>
              )}

              {/* Ô timeline */}
              <div
                className={`${bgColor} rounded-xl p-4 shadow w-40`}
              >
                <p className={`font-bold ${textColor}`}>
                  {dayjs(item.date).format("MMM D, HH:mm")}
                </p>
                <p>{item.description}</p>
              </div>
            </div>
          );
        })
    )}
  </div>
</div>



    </div>
  );
}
