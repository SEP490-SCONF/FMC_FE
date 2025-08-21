import React, { useEffect, useState } from "react";
import {
  getTimelinesByConferenceId,
  createTimeline,
  updateTimeline,
  deleteTimeline,
} from "../../services/TimelineService";
import {
  getSchedulesByTimeline,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from "../../services/ScheduleService";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  message,
  Typography,
  List,
  Popconfirm,
  Pagination,
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

  // Schedule states
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [selectedTimeline, setSelectedTimeline] = useState(null);
  const [scheduleForm] = Form.useForm();
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 5;

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
          <p>
            This action <Text strong>cannot be undone</Text>.
          </p>
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

  const handleViewSchedules = (timeline) => {
    setSelectedTimeline(timeline);
    getSchedulesByTimeline(timeline.timeLineId)
      .then((res) => {
        setSchedules(res || []);
        setScheduleModalVisible(true);
      })
      .catch((err) => {
        console.error("❌ Failed to load schedules", err);
        message.error("Failed to load schedules");
        setSchedules([]);
        setScheduleModalVisible(true);
      });
  };

  // CRUD Schedule
  const handleScheduleSubmit = (values) => {
    const baseDate = dayjs(selectedTimeline.date).format("YYYY-MM-DD");
    const startTime = dayjs(
      `${baseDate} ${values.presentationStartTime.format("HH:mm")}`
    );
    const endTime = dayjs(
      `${baseDate} ${values.presentationEndTime.format("HH:mm")}`
    );

    const data = {
      timeLineId: selectedTimeline?.timeLineId,
      sessionTitle: values.sessionTitle,
      location: values.location || "",
      paperId: values.paperId || null,
      presenterId: values.presenterId || null,
      presentationStartTime: startTime ? startTime.toISOString() : null,
      presentationEndTime: endTime ? endTime.toISOString() : null,
    };

    const action = editingSchedule
      ? updateSchedule(editingSchedule.scheduleId, data)
      : createSchedule(data);

    action
      .then(() => {
        message.success(
          `Schedule ${editingSchedule ? "updated" : "created"} successfully`
        );
        scheduleForm.resetFields();
        setEditingSchedule(null);
        setShowScheduleForm(false);
        handleViewSchedules(selectedTimeline); // reload
      })
      .catch((err) => {
        console.error("❌ Schedule save failed", err);
        message.error("Failed to save schedule");
      });
  };

  const handleScheduleDelete = (id) => {
    deleteSchedule(id)
      .then(() => {
        message.success("Schedule deleted successfully");
        handleViewSchedules(selectedTimeline);
      })
      .catch((err) => {
        console.error("❌ Delete schedule failed", err);
        message.error("Failed to delete schedule");
      });
  };

  const groupBySession = (items) => {
    return {
      morning: items.filter(
        (i) => dayjs(i.presentationStartTime).hour() < 12
      ),
      afternoon: items.filter((i) => {
        const h = dayjs(i.presentationStartTime).hour();
        return h >= 12 && h < 18;
      }),
      evening: items.filter((i) => dayjs(i.presentationStartTime).hour() >= 18),
    };
  };

  const groupedSchedules = groupBySession(schedules);

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
      title: "Schedule",
      render: (_, record) => (
        <Button size="small" onClick={() => handleViewSchedules(record)}>
          View
        </Button>
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
            onClick={() =>
              showDeleteConfirm(record.timeLineId, handleDelete)
            }
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="p-6">
      {/* --- Timeline Management Table --- */}
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

      {/* --- Schedule Modal --- */}
      <Modal
        width={700}
        title={`📌 Schedules for "${selectedTimeline?.description || ""}"`}
        open={scheduleModalVisible}
        onCancel={() => {
          setScheduleModalVisible(false);
          setEditingSchedule(null);
          setShowScheduleForm(false);
          scheduleForm.resetFields();
        }}
        footer={null}
      >
        {/* Button Add Schedule */}
        <div className="flex justify-end mb-4">
          <Button
            type="primary"
            onClick={() => {
              setEditingSchedule(null);
              scheduleForm.resetFields();
              setShowScheduleForm(true);
            }}
          >
            + Add Schedule
          </Button>
        </div>

        {/* Form thêm/sửa schedule (ẩn/hiện khi bấm nút) */}
        {showScheduleForm && (
          <Form
            form={scheduleForm}
            layout="vertical"
            onFinish={handleScheduleSubmit}
            className="mb-6 p-4 border rounded-lg bg-gray-50"
          >
            <Form.Item
              name="sessionTitle"
              label="Session Title"
              rules={[{ required: true, message: "Please enter session title" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="location" label="Location">
              <Input />
            </Form.Item>
            <Form.Item
              name="presentationStartTime"
              label="Start Time"
              rules={[{ required: true, message: "Please select start time" }]}
            >
              <DatePicker
                picker="time"
                format="HH:mm"
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item
              name="presentationEndTime"
              label="End Time"
              rules={[{ required: true, message: "Please select end time" }]}
            >
              <DatePicker
                picker="time"
                format="HH:mm"
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item name="presenterId" label="Presenter Id">
              <Input />
            </Form.Item>
            <Form.Item name="paperId" label="Paper Id">
              <Input />
            </Form.Item>

            <div className="flex justify-end gap-2">
              <Button
                onClick={() => {
                  setShowScheduleForm(false);
                  setEditingSchedule(null);
                  scheduleForm.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {editingSchedule ? "Update" : "Save"}
              </Button>
            </div>
          </Form>
        )}

        {/* hiển thị grouped schedule */}
        <div className="mt-6">
          {["morning", "afternoon", "evening"].map((sessionKey) => {
            const label =
              sessionKey === "morning"
                ? "🌅 Morning"
                : sessionKey === "afternoon"
                ? "🌞 Afternoon"
                : "🌙 Evening";
            const data = groupedSchedules[sessionKey] || [];
            return (
              <div key={sessionKey} className="mb-4">
                <h4 className="font-semibold text-blue-600 mb-2">{label}</h4>
                {data.length === 0 ? (
                  <div className="text-gray-400">No schedule</div>
                ) : (
                 <List
  dataSource={data.slice((page - 1) * pageSize, page * pageSize)}
  renderItem={(item) => {
    console.log("Schedule item:", item); // 👈 thêm log ở đây
    return (
      <List.Item
        actions={[
          <Button
            size="small"
            onClick={() => {
              setEditingSchedule(item);
              scheduleForm.setFieldsValue({
                sessionTitle: item.sessionTitle,
                location: item.location,
                presenterId: item.presenterId,
                paperId: item.paperId,
                presentationStartTime: dayjs(item.presentationStartTime),
                presentationEndTime: dayjs(item.presentationEndTime),
              });
              setShowScheduleForm(true);
            }}
          >
            Edit
          </Button>,
          <Popconfirm
            title="Delete schedule?"
            onConfirm={() => handleScheduleDelete(item.scheduleId)}
          >
            <Button size="small" danger>
              Delete
            </Button>
          </Popconfirm>,
        ]}
      >
       <div>
  <p className="font-semibold">
    {dayjs(item.presentationStartTime).format("HH:mm")} -{" "}
    {dayjs(item.presentationEndTime).format("HH:mm")} :{" "}
    {item.sessionTitle}
  </p>

  {/* Paper chỉ hiển thị nếu có */}
  {item.paper?.title && <p>📝 Paper: {item.paper.title}</p>}

  {/* Presenter chỉ hiển thị nếu có */}
  {item.presenterName ? (
    <p>👤 Presenter: {item.presenterName}</p>
  ) : item.presenter?.name ? (
    <p>👤 Presenter: {item.presenter.name}</p>
  ) : null}

  {/* Location */}
  {item.location && <p>📍 Location: {item.location}</p>}
</div>

      </List.Item>
    );
  }}
/>

                )}
              </div>
            );
          })}
        </div>

        <Pagination
          className="mt-4 text-center"
          current={page}
          pageSize={pageSize}
          total={schedules.length}
          onChange={(p) => setPage(p)}
        />
      </Modal>

      {/* --- Modal add/edit timeline --- */}
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

      {/* --- Timeline Section --- */}
      <div className="pt-8">
        <h3 className="text-xl font-bold text-blue-700 mb-4 text-center">
          Timeline
        </h3>
        <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-center text-gray-700 relative">
          {list.length === 0 ? (
            <div className="text-gray-500 text-center">
              No timeline available
            </div>
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
                  <div
                    key={item.timeLineId}
                    className="relative flex items-center"
                  >
                    {index > 0 && (
                      <div className="w-6 h-1 bg-gray-300 mx-2 rounded"></div>
                    )}
                    <div className={`${bgColor} rounded-xl p-4 shadow w-40`}>
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
