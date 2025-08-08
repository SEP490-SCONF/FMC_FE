import React, { useEffect, useState } from "react";
import {
  getCallForPapersByConferenceId,
  createCallForPaper,
  updateCallForPaper,
  deleteCallForPaper,
} from "../../services/CallForPaperService";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Upload,
  message,
  Popconfirm,
  Select,
  Typography,
} from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

// Khởi tạo plugin (BẮT BUỘC phải sau import plugin)
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { Option } = Select;
const { Text } = Typography;

export default function ManageCallForPaper() {
  const { conferenceId } = useParams();
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDeadline, setFilterDeadline] = useState([]);


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
          <p>Are you sure you want to delete this Call for Paper?</p>
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

    getCallForPapersByConferenceId(conferenceId)
      .then((res) => {
        setList(res);
        setFilteredList(res);
      })
      .catch((err) => {
        console.error("❌ Failed to load Call For Papers", err);
        message.error("Failed to load Call For Papers");
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
  applyFilters(filterStatus, filterDeadline, value);
};

  const handleFilterStatus = (status) => {
  setFilterStatus(status);
  applyFilters(status, filterDeadline, searchText);
};

const handleFilterDeadline = (range) => {
  const validRange = Array.isArray(range) && range[0] && range[1] ? range : [];
  setFilterDeadline(validRange);
  applyFilters(filterStatus, validRange, searchText);
};






const applyFilters = (status, deadlineRange, searchValue) => {
  const filtered = list.filter((item) => {
    const matchesStatus = status === "" || item.status === status;
    const matchesSearch = item.description
      .toLowerCase()
      .includes(searchValue.toLowerCase());
    const matchesDeadline =
  !Array.isArray(deadlineRange) || deadlineRange.length !== 2 || !deadlineRange[0] || !deadlineRange[1]
    ? true
    : dayjs(item.deadline).isSameOrAfter(dayjs(deadlineRange[0]), "day") &&
      dayjs(item.deadline).isSameOrBefore(dayjs(deadlineRange[1]), "day");


    return matchesStatus && matchesSearch && matchesDeadline;
  });

  setFilteredList(filtered);
};


  const handleSubmit = async (values) => {
  const formData = new FormData();
  formData.append("conferenceId", conferenceId);
  formData.append("description", values.description);
  formData.append("deadline", values.deadline.format("YYYY-MM-DD"));

  if (values.templateFile?.file) {
    formData.append("templateFile", values.templateFile.file);
  }

  // Bắt đầu loading
  setLoading(true);

  try {
    // Nếu đang Edit và muốn đặt status = true (Active)
    if (editing && values.status === true) {
  const existingActive = list.find(
    (item) => item.cfpid !== editing.cfpid && item.status === true
  );

  if (existingActive) {
    message.error(
      `❌ Only one Call For Paper can be Active at a time.\n CPF"${existingActive.cfpid}" is already active.`
    );
    setLoading(false);
    return; // ⚠️ Dừng lại, không update
  }
}


    // Nếu đang edit và có status thì gửi lên
    if (editing && values.status !== undefined) {
      formData.append("status", values.status);
    }

    // Tạo hoặc cập nhật
    const action = editing
      ? updateCallForPaper(editing.cfpid, formData)
      : createCallForPaper(formData);

    await action;

    message.success(`${editing ? "Updated" : "Created"} successfully`);
    setOpen(false);
    form.resetFields();
    setEditing(null);
    fetchData();
  } catch (error) {
    console.error("Error:", error);
    message.error("Something went wrong");
  } finally {
    setLoading(false);
  }
};


  const handleEdit = (item) => {
    setEditing(item);
    form.setFieldsValue({
      description: item.description,
      deadline: dayjs(item.deadline),
      status: item.status,
    });
    setOpen(true);
  };

  const handleDelete = (id) => {
    deleteCallForPaper(id)
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
    title: "ID",
    dataIndex: "cfpid",
    key: "cfpid",
    width: 70,
    sorter: (a, b) => a.cfpid - b.cfpid,
  },

    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      render: (value) => dayjs(value).format("YYYY-MM-DD"),
    },
    {
  title: "Status",
  dataIndex: "status",
  render: (value) => (value ? "Active" : "Inactive"),
},
    {
      title: "Template",
      dataIndex: "templatePath",
      render: (value) =>
        value ? (
          <a href={value} target="_blank" rel="noreferrer">
            View Template
          </a>
        ) : (
          "N/A"
        ),
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
            onClick={() => showDeleteConfirm(record.cfpid, handleDelete)}
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
          📢 Call For Papers
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
          Add New
        </Button>
      </div>

      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Search description..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: "300px" }}
        />
        <Select
      
      placeholder="Filter by status"
      value={filterStatus}
      onChange={(value) => handleFilterStatus(value)}
      style={{ width: "200px" }}
      allowClear
        >
          
        <Option value="">All</Option>
        <Option value={true}>Active</Option>
        <Option value={false}>Inactive</Option>
      </Select>

      <DatePicker.RangePicker
  allowEmpty={[true, true]}
  onChange={(dates) => handleFilterDeadline(dates || [])}
  style={{ width: "300px" }}
/>

      </div>

      <Table
        columns={columns}
        dataSource={filteredList}
        rowKey="cfpid"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editing ? "Update Call For Paper" : "Create Call For Paper"}
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
            name="deadline"
            label="Deadline"
            rules={[{ required: true, message: "Please select deadline" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          
          <Form.Item name="templateFile" label="Upload Template">
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Choose File</Button>
            </Upload>
          </Form.Item>
          {editing && (
    <Form.Item
      name="status"
      label="Status"
      rules={[{ required: true, message: "Please select status" }]}
    >
      <Select>
        <Option value={true}>Active</Option>
        <Option value={false}>Inactive</Option>
      </Select>
    </Form.Item>
    )}
        </Form>
      </Modal>
    </div>
  );
}
