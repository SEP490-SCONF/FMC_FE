import React, { useEffect, useState } from "react";
import {
  getFeesByConferenceId,
  createFeeDetail,
  updateFeeDetail,
  getAllFeeTypes,
} from "../../services/ConferenceFeesService";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  message,
  Typography,
} from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
const MODE_OPTIONS = {
  1: [ // Registration Fee
    { value: "Regular", label: "Regular (Phí chuẩn)" },
    { value: "EarlyBird", label: "EarlyBird (Đăng ký sớm)" },
    { value: "Late", label: "Late (Đăng ký trễ)" },
    { value: "Student", label: "Student (Sinh viên)" },
  ],
  2: [ // Participation Fee / Listener Fee
    { value: "Regular", label: "Regular (Tham dự thường)" },
    { value: "VIP", label: "VIP (Vé VIP)" },
    { value: "Student", label: "Student (Sinh viên)" },
  ],
  3: [ // Additional Page Fee
    { value: "PerPage", label: "PerPage (Tính theo trang)" },
  ],
  4: [ // Proceedings Fee
    { value: "Regular", label: "Regular (Mua kỷ yếu in)" },
    { value: "Free", label: "Free (Miễn phí cho tác giả)" },
  ],
  5: [ // Presentation Fee
    { value: "Regular", label: "Regular (Present)" },
    { value: "Student", label: "Student (Sinh viên)" },
  ],
};
const { Option } = Select;
const { Text } = Typography;

export default function ManageConferenceFee() {
  const { conferenceId } = useParams();
  const [feeList, setFeeList] = useState([]);
  const [feeTypes, setFeeTypes] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Load fee types and fee list
  useEffect(() => {
    if (!conferenceId) return;
    getAllFeeTypes()
      .then((res) => setFeeTypes(res.data || res))
      .catch(() => setFeeTypes([]));
    fetchFees();
    // eslint-disable-next-line
  }, [conferenceId]);

  const fetchFees = () => {
    if (!conferenceId) return;
    getFeesByConferenceId(conferenceId)
      .then((res) => setFeeList(res.data || res))
      .catch(() => setFeeList([]));
  };

  // Open modal for add/edit
  const handleEdit = (item) => {
    setEditing(item);
    form.setFieldsValue({
      feeTypeId: item.feeTypeId,
      amount: item.amount,
      currency: item.currency,
      mode: item.mode,
      note: item.note,
      isVisible: item.isVisible,
    });
    setOpen(true);
  };

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ currency: "VND", mode: "Regular", isVisible: true });
    setOpen(true);
  };

  // Submit add/edit
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (editing) {
        // Update
        await updateFeeDetail(editing.feeDetailId, {
          amount: values.amount,
          mode: values.mode,
          note: values.note,
          isVisible: values.isVisible,
        });
        message.success("Fee updated successfully");
      } else {
        // Create
        await createFeeDetail(conferenceId, {
          feeTypeId: values.feeTypeId,
          amount: values.amount,
          currency: values.currency,
          mode: values.mode,
          note: values.note,
        });
        message.success("Fee created successfully");
      }
      setOpen(false);
      setEditing(null);
      form.resetFields();
      fetchFees();
    } catch (err) {
      message.error("Error saving fee");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Type",
      dataIndex: "feeTypeName",
      key: "feeTypeName",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (value, record) => (
        <span>
          {value} {record.currency}
        </span>
      ),
    },
    {
      title: "Mode",
      dataIndex: "mode",
      key: "mode",
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      render: (text) => <span>{text || <span className="text-gray-400">N/A</span>}</span>,
    },
    {
      title: "Visible",
      dataIndex: "isVisible",
      key: "isVisible",
      render: (value) =>
        value ? (
          <span style={{ color: "#52c41a" }}>Yes</span>
        ) : (
          <span style={{ color: "#aaa" }}>No</span>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          icon={<EditOutlined />}
          size="small"
          onClick={() => handleEdit(record)}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4 items-center">
        <h2 className="text-2xl font-semibold text-blue-600">
          💰 Conference Fees
        </h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Add Fee
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={feeList}
        rowKey="feeDetailId"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editing ? "Edit Fee" : "Add Fee"}
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
          {!editing && (
            <Form.Item
              name="feeTypeId"
              label="Fee Type"
              rules={[{ required: true, message: "Please select fee type" }]}
            >
              <Select
                placeholder="Select fee type"
                onChange={() => {
                  // Reset mode khi đổi feeType
                  form.setFieldsValue({ mode: undefined });
                }}
              >
                {feeTypes.map((ft) => (
                  <Option key={ft.feeTypeId} value={ft.feeTypeId}>
                    {ft.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}
          <Form.Item
            name="amount"
            label="Amount"
            rules={[{ required: true, message: "Please enter amount" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="currency"
            label="Currency"
            rules={[{ required: true, message: "Please enter currency" }]}
          >
            <Input disabled value="VND" />
          </Form.Item>
          <Form.Item
            name="mode"
            label="Mode"
            rules={[{ required: true, message: "Please select mode" }]}
          >
            <Select placeholder="Select mode">
              {(MODE_OPTIONS[form.getFieldValue("feeTypeId")] || []).map((m) => (
                <Option key={m.value} value={m.value}>
                  {m.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="note" label="Note">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item
            name="isVisible"
            label="Visible"
            valuePropName="checked"
          >
            <Switch checkedChildren="Visible" unCheckedChildren="Hidden" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}