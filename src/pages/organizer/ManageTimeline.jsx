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
import { getPresentedPapersByConferenceId } from "../../services/PaperSerice";
import { Select } from "antd";

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
  const [presentedPapers, setPresentedPapers] = useState([]);
  const [scheduleFormModalVisible, setScheduleFormModalVisible] = useState(false);
  const [paperSelectModalVisible, setPaperSelectModalVisible] = useState(false);
const [selectedPaperForSchedule, setSelectedPaperForSchedule] = useState(null);
const [expandedScheduleId, setExpandedScheduleId] = useState(null);
const [isExpanded, setIsExpanded] = useState({});






  // Schedule states
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [selectedTimeline, setSelectedTimeline] = useState(null);
  const [scheduleForm] = Form.useForm();
  const [editingSchedule, setEditingSchedule] = useState(null);
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

  // 1️⃣ Sắp xếp schedules
const sortedSchedules = schedules.sort(
  (a, b) => new Date(a.presentationStartTime) - new Date(b.presentationStartTime)
);

// 2️⃣ Tạo groupedSchedules (theo buổi) nếu cần hiển thị toàn bộ
const groupedSchedules = {
  morning: sortedSchedules.filter(s => dayjs(s.presentationStartTime).hour() < 12),
  afternoon: sortedSchedules.filter(s => {
    const h = dayjs(s.presentationStartTime).hour();
    return h >= 12 && h < 18;
  }),
  evening: sortedSchedules.filter(s => dayjs(s.presentationStartTime).hour() >= 18),
};

const allSchedules = [...groupedSchedules.morning, ...groupedSchedules.afternoon, ...groupedSchedules.evening];

// 3️⃣ Slice theo page
const pagedSchedules = allSchedules.slice((page - 1) * pageSize, page * pageSize);

// 4️⃣ Sau đó mới group theo buổi
const groupedPagedSchedules = {
  morning: pagedSchedules.filter(s => dayjs(s.presentationStartTime).hour() < 12),
  afternoon: pagedSchedules.filter(s => {
    const h = dayjs(s.presentationStartTime).hour();
    return h >= 12 && h < 18;
  }),
  evening: pagedSchedules.filter(s => dayjs(s.presentationStartTime).hour() >= 18),
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

  useEffect(() => {
      console.log("🔹 selectedPaperForSchedule updated:", selectedPaperForSchedule); // <- kiểm tra

  if (selectedPaperForSchedule) {
    scheduleForm.setFieldsValue({
      paperId: selectedPaperForSchedule.paperId,
      presenterId: selectedPaperForSchedule.paperAuthors?.[0]?.author?.authorId || null,
    });
  } else {
    scheduleForm.setFieldsValue({
      paperId: null,
      presenterId: null,
    });
  }
}, [selectedPaperForSchedule, scheduleForm]);



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
        setSchedules([]);
        setScheduleModalVisible(true);
      });

  // load presented papers
   getPresentedPapersByConferenceId(conferenceId).then(res => {
  const papersWithPresenter = res.map(paper => {
    const presenterAuthor = paper.paperAuthors?.[0]?.author;
    return {
      ...paper,
      presenter: presenterAuthor
        ? {
            userId: presenterAuthor.authorId,
            name: presenterAuthor.name,
            email: presenterAuthor.email,
            avatarUrl: presenterAuthor.avatarUrl,
          }
        : null, // Nếu không có author thì null
    };
  });

      console.log("✅ Presented papers loaded:", papersWithPresenter); // <- kiểm tra

  setPresentedPapers(papersWithPresenter);
});



  };

  // CRUD Schedule
  const handleScheduleSubmit = (values) => {
  const baseDate = dayjs(selectedTimeline.date).format("YYYY-MM-DD");
  const startTime = dayjs(`${baseDate} ${values.presentationStartTime.format("HH:mm")}`);
  const endTime = dayjs(`${baseDate} ${values.presentationEndTime.format("HH:mm")}`);

  const data = {
    timeLineId: selectedTimeline?.timeLineId,
    sessionTitle: values.sessionTitle,
    location: values.location || "",
    paperId: values.paperId ?? null,
  presenterId: values.presenterId ?? null, // sẽ có id từ step 2

    presentationStartTime: startTime ? startTime.toISOString() : null,
    presentationEndTime: endTime ? endTime.toISOString() : null,
  };

  const action = editingSchedule
    ? updateSchedule(editingSchedule.scheduleId, data)
    : createSchedule(data);

  action
    .then(() => {
      message.success(`Schedule ${editingSchedule ? "updated" : "created"} successfully`);
      scheduleForm.resetFields();
      setEditingSchedule(null);
      setScheduleFormModalVisible(false); // tắt form

      // 🔄 reload lại danh sách theo timeline hiện tại
      getSchedulesByTimeline(selectedTimeline.timeLineId)
        .then((res) => {
          setSchedules(res || []);
          setScheduleModalVisible(true); // đảm bảo modal danh sách mở
        })
        .catch((err) => {
          console.error("❌ Failed to load schedules", err);
          setSchedules([]);
          setScheduleModalVisible(true); // vẫn mở modal danh sách
        });
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
    scheduleForm.resetFields();
  }}
  footer={null} // Footer ẩn, nút Save/Cancel trong form
>
 {/* Button Add Schedule */}
<div className="flex justify-end mb-4">
  <Button
    type="primary"
    onClick={() => {
            setSelectedPaperForSchedule(null);
                  scheduleForm.resetFields();


      setEditingSchedule(null);

      setScheduleFormModalVisible(true); // mở modal riêng
    }}
  >
    + Add Schedule
  </Button>
</div>

 
{/* Danh sách grouped schedules */}
<div className="mt-6">
  {allSchedules.length === 0 ? (
    <p className="text-center text-gray-500">No schedule</p>
  ) : (
    ["morning", "afternoon", "evening"].map((sessionKey) => {
      const data = groupedPagedSchedules[sessionKey] || [];
      if (data.length === 0) return null; // bỏ qua buổi trống

      const label =
        sessionKey === "morning"
          ? "🌅 Morning"
          : sessionKey === "afternoon"
          ? "🌞 Afternoon"
          : "🌙 Evening";

      return (
        <div key={sessionKey} className="mb-4">
          <h4 className="font-semibold text-blue-600 mb-2">{label}</h4>
          <List
            dataSource={data}
            renderItem={(item) => {
              // tìm paper trong danh sách presentedPapers
              const paper =
  item.paper || presentedPapers.find((p) => p.paperId === item.paperId) || null;

              // tìm presenter ưu tiên từ item, nếu null thì từ paperAuthors
              const presenter =
  item.presenter?.name
    ? item.presenter
    : paper?.paperAuthors?.[0]?.author
    ? paper.paperAuthors[0].author
    : item.presenterName
    ? { name: item.presenterName }
    : null;

              return (
                <List.Item
                  key={item.scheduleId}
                  actions={[
                    <Button
                      size="small"
                      onClick={() => {
                        setEditingSchedule(item);

                        setSelectedPaperForSchedule(paper);
                        scheduleForm.setFieldsValue({
                          sessionTitle: item.sessionTitle,
                          location: item.location,
                          paperId: paper?.paperId || null,
                          presenterId: presenter?.authorId || null,
                          presentationStartTime: dayjs(item.presentationStartTime),
                          presentationEndTime: dayjs(item.presentationEndTime),
                        });

                        setScheduleFormModalVisible(true);
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
                    {/* Title có thể click để toggle chi tiết */}
                    <p
                      className="font-semibold cursor-pointer"
                      onClick={() =>
                        setIsExpanded((prev) => ({
                          ...prev,
                          [item.scheduleId]: !prev[item.scheduleId],
                        }))
                      }
                    >
                      {dayjs(item.presentationStartTime).format("HH:mm")} -{" "}
                      {dayjs(item.presentationEndTime).format("HH:mm")} :{" "}
                      {item.sessionTitle}
                    </p>

                    {/* Chi tiết chỉ hiển thị khi expanded */}
                    {isExpanded[item.scheduleId] && (
  <div className="mt-1 ml-4 space-y-1">
    {paper?.title && <p>📝 Paper: {paper.title}</p>}
    {presenter?.name && <p>👤 Presenter: {presenter.name}</p>}
    {item.location && <p>📍 Location: {item.location}</p>}
  </div>
)}

                  </div>
                </List.Item>
              );
            }}
          />
        </div>
      );
    })
  )}
</div>




  <Pagination
    className="mt-4 text-center"
    current={page}
    pageSize={pageSize}
    total={schedules.length}
    onChange={(p) => setPage(p)}
  />
</Modal>

<Modal
  title={editingSchedule ? "Update Schedule" : "Add Schedule"}
  open={scheduleFormModalVisible}
  onCancel={() => {
    setScheduleFormModalVisible(false);
    setEditingSchedule(null);
    scheduleForm.resetFields();
  }}
  onOk={() => scheduleForm.submit()}
  okText={editingSchedule ? "Update" : "Save"}
>
  <Form
    form={scheduleForm}
    layout="vertical"
    onFinish={handleScheduleSubmit}
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
      <DatePicker picker="time" format="HH:mm" style={{ width: "100%" }} />
    </Form.Item>
    <Form.Item
      name="presentationEndTime"
      label="End Time"
      rules={[{ required: true, message: "Please select end time" }]}
    >
      <DatePicker picker="time" format="HH:mm" style={{ width: "100%" }} />
    </Form.Item>

    {/* ← Thêm nút Choose Paper ở đây */}
    <Form.Item label="Select Paper">
      <Button
        icon={<PlusOutlined />}
        onClick={() => setPaperSelectModalVisible(true)}
      >
        Choose Paper
      </Button>
      {selectedPaperForSchedule && (
        <div className="mt-2">
          📝 {selectedPaperForSchedule.title} | Score: {selectedPaperForSchedule.paperScore ?? "N/A"}
        </div>
      )}
    </Form.Item>

    {/* Hidden fields */}
    <Form.Item name="paperId" hidden>
      <Input type="hidden" />
    </Form.Item>
    <Form.Item name="presenterId" hidden>
      <Input type="hidden" />
    </Form.Item>
  </Form>

  {/* Modal Paper Select riêng bên ngoài form */}
  <Modal
    title="Select Paper"
    open={paperSelectModalVisible}
    onCancel={() => setPaperSelectModalVisible(false)}
    footer={null}
    width={600}
  >
    <List
      dataSource={presentedPapers}
      renderItem={(paper) => (
        <List.Item
          actions={[
            <Button
  type="primary"
  size="small"
  onClick={() => {
        console.log("📝 Paper selected:", paper); // <- kiểm tra

    setSelectedPaperForSchedule(paper);
    scheduleForm.setFieldsValue({
      paperId: paper.paperId,
  presenterId: paper?.paperAuthors?.[0]?.author?.authorId || null, // ✅ safe now
    });
    setPaperSelectModalVisible(false);
  }}
>
  Select
</Button>
,
          ]}
        >
          <List.Item.Meta
            title={paper.title}
            description={`Score: ${paper.paperScore ?? "N/A"}`}
          />
        </List.Item>
      )}
    />
  </Modal>
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
