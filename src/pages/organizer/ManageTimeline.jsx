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
  countSchedulesByTimeline,
} from "../../services/ScheduleService";
import { getPresentedPapersByConferenceId } from "../../services/PaperSerice";
import { Select } from "antd";
import { Eye } from "lucide-react";
import { CloseOutlined } from "@ant-design/icons";
import { timelineDateValidator } from "../../utils/validators";
import { getConferenceById } from "../../services/ConferenceService";

import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";




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
const [scheduleCounts, setScheduleCounts] = useState({});

  // Schedule states
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [selectedTimeline, setSelectedTimeline] = useState(null);
  const [scheduleForm] = Form.useForm();
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const { RangePicker } = DatePicker;
  const [dateRange, setDateRange] = useState([null, null]);
  const [conference, setConference] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc"); // "asc" hoặc "desc"



  const showDeleteScheduleConfirm = (scheduleId) => {
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
        <p>Are you sure you want to delete this schedule?</p>
      </div>
    ),
    okText: "Yes, delete it",
    cancelText: "Cancel",
    okType: "danger",
    centered: true,
    onOk: () => handleScheduleDelete(scheduleId),
  });
};

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

  <div className="mb-4 flex gap-2 items-center">
  <Input
  value={searchText}
  onChange={(e) => setSearchText(e.target.value)}
/>

<RangePicker
  value={dateRange}
  onChange={(dates) => setDateRange(dates)}
/>



</div>
const handleDateRangeFilter = (dates) => {
  if (!dates || dates.length !== 2) {
    setFilteredList(list); // reset filter nếu không chọn gì
    return;
  }

  const [start, end] = dates;

  const filtered = list.filter((item) => {
    const timelineDate = dayjs(item.date);
    return timelineDate.isAfter(start.startOf("day").subtract(1, "second")) &&
           timelineDate.isBefore(end.endOf("day").add(1, "second"));
  });

  setFilteredList(filtered);
};

// --- Filter Timelines (Search + Date + Schedule) ---
const handleFilter = (searchValue, dates) => {
  if (!list || list.length === 0) return setFilteredList([]);

  let filtered = [...list];

  // 1️⃣ Filter by description
  if (searchValue && searchValue.trim() !== "") {
    filtered = filtered.filter(item =>
      item.description?.toLowerCase().includes(searchValue.toLowerCase())
    );
  }

  // 2️⃣ Filter by date range
  if (dates && dates.length === 2 && dates[0] && dates[1]) {
    const [start, end] = dates;
    filtered = filtered.filter(item => {
      if (!item.date) return false;
      const timelineDate = dayjs(item.date);
      return (
        timelineDate.isSame(start, "day") ||
        timelineDate.isSame(end, "day") ||
        (timelineDate.isAfter(start.startOf("day")) &&
          timelineDate.isBefore(end.endOf("day")))
      );
    });
  }

  setFilteredList(filtered);
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
    .then(async (res) => {
      const timelines = res || [];
      setList(timelines);
      setFilteredList(timelines);

      // Lấy count cho từng timeline
      const counts = {};
      await Promise.all(
  timelines.map(async (tl) => {
    try {
      const res = await countSchedulesByTimeline(tl.timeLineId);
      counts[tl.timeLineId] = res?.scheduleCount ?? 0;

    } catch (err) {
      counts[tl.timeLineId] = 0;
    }
  })
);
setScheduleCounts(counts);

    })
    .catch((err) => {
      console.warn("No timelines found or failed to load:", err);
      setList([]);
      setFilteredList([]);
      setScheduleCounts({});
    });
};



  useEffect(() => {
    if (conferenceId) {
      fetchData();
    }
  }, [conferenceId]);

  useEffect(() => {
  // fetch conference info
  getConferenceById(conferenceId)
    .then((data) => setConference(data))
    .catch((err) => console.error("Failed to fetch conference", err));
}, [conferenceId]);

  useEffect(() => {
  if (selectedPaperForSchedule) {
    scheduleForm.setFieldsValue({
      paperId: selectedPaperForSchedule.paperId || null,
      presenterId: selectedPaperForSchedule.presenter?.authorId || null,
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
formData.append(
  "date",
  values.date ? values.date.format("YYYY-MM-DDTHH:mm:ss") : ""
);


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

  const isOverlapping = (startA, endA, startB, endB) => {
  return startA.isBefore(endB) && endA.isAfter(startB);
};

  const handleEdit = (item) => {
  setEditing(item);
  form.setFieldsValue({
    description: item.description,
    date: item.date ? dayjs(item.date) : null,  // ✅ fix Invalid Date
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

  const handleViewSchedules = async (timeline) => {
  setSelectedTimeline(timeline);
  setPage(1);

  try {
    // 1️⃣ Lấy danh sách schedules
    const schedulesRes = await getSchedulesByTimeline(timeline.timeLineId);
    setSchedules(schedulesRes || []);

    // 2️⃣ Lấy tổng số schedule từ API Count
    const countRes = await countSchedulesByTimeline(timeline.timeLineId);
    setScheduleCounts(prev => ({
      ...prev,
    [timeline.timeLineId]: countRes.scheduleCount || 0, // 
    }));
    handleFilter(searchText, dateRange); // filter lại ngay


    setScheduleModalVisible(true);
  } catch (err) {
    console.error("❌ Failed to load schedules or count", err);
    setSchedules([]);
    setScheduleCounts(prev => ({
      ...prev,
      [timeline.timeLineId]: 0,
    }));
    setScheduleModalVisible(true);
  }

  // 3️⃣ load presented papers
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
          : null,
      };
    });
    setPresentedPapers(papersWithPresenter);
  });
};

// ⏰ Disable cho START
const getDisabledStartTime = (schedules, editingId = null) => {
  return () => {
    const disabledMinutes = {};

    schedules.forEach((sch) => {
      if (editingId && sch.scheduleId === editingId) return;

      const start = dayjs(sch.presentationStartTime);
      const end = dayjs(sch.presentationEndTime);

      let current = start.clone();
      while (current.isBefore(end) || current.isSame(end)) {
        const h = current.hour();
        const m = current.minute();
        if (!disabledMinutes[h]) disabledMinutes[h] = [];
        disabledMinutes[h].push(m);
        current = current.add(1, "minute");
      }
    });

    return {
      disabledHours: () => [],
      disabledMinutes: (hour) => disabledMinutes[hour] || [],
    };
  };
};

// ⏰ Disable cho END
const getDisabledEndTime = (schedules, startTime, editingId = null) => {
  return () => {
    const disabledMinutes = {};
    if (!startTime) return { disabledHours: () => [], disabledMinutes: () => [] };

    schedules.forEach((sch) => {
      if (editingId && sch.scheduleId === editingId) return;

      const start = dayjs(sch.presentationStartTime);
      const end = dayjs(sch.presentationEndTime);

      let current = start.clone();
      while (current.isBefore(end) || current.isSame(end)) {
        const h = current.hour();
        const m = current.minute();
        if (!disabledMinutes[h]) disabledMinutes[h] = [];
        disabledMinutes[h].push(m);
        current = current.add(1, "minute");
      }
    });

    return {
      disabledHours: () => [],
      disabledMinutes: (hour) => {
        const minutes = disabledMinutes[hour] || [];
        // ❌ Quan trọng: cấm chọn end < start
        if (hour === startTime.hour()) {
          const invalid = [];
          for (let m = 0; m <= startTime.minute(); m++) invalid.push(m);
          return [...new Set([...minutes, ...invalid])];
        }
        return minutes;
      },
    };
  };
}



  // CRUD Schedule
  const handleScheduleSubmit = (values) => {
  const baseDate = dayjs(selectedTimeline.date).format("YYYY-MM-DD");
  const startTime = dayjs(`${baseDate} ${values.presentationStartTime.format("HH:mm")}`);
  const endTime = dayjs(`${baseDate} ${values.presentationEndTime.format("HH:mm")}`);

  // 🚨 Kiểm tra overlap với các schedule khác
  const hasConflict = schedules.some((sch) => {
    if (editingSchedule && sch.scheduleId === editingSchedule.scheduleId) return false; // bỏ qua chính nó khi edit
    const schStart = dayjs(sch.presentationStartTime);
    const schEnd = dayjs(sch.presentationEndTime);
    return isOverlapping(startTime, endTime, schStart, schEnd);
  });

  if (hasConflict) {
    message.error("❌ Time range overlaps with an existing schedule!");
    return; // ❌ Không cho tạo
  }

  const data = {
    timeLineId: selectedTimeline?.timeLineId,
    sessionTitle: values.sessionTitle,
    location: values.location || "",
    paperId: values.paperId ?? null,
    presenterId: values.presenterId ?? null,
    presentationStartTime: startTime.toISOString(),
    presentationEndTime: endTime.toISOString(),
  };

  const action = editingSchedule
    ? updateSchedule(editingSchedule.scheduleId, data)
    : createSchedule(data);

  action
    .then(() => {
      message.success(`Schedule ${editingSchedule ? "updated" : "created"} successfully`);
      scheduleForm.resetFields();
      setEditingSchedule(null);
      setScheduleFormModalVisible(false);
      return getSchedulesByTimeline(selectedTimeline.timeLineId);
    })
    .then((res) => {
      setSchedules(res || []);
      setScheduleModalVisible(true);
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
    title: (
      <div className="flex items-center gap-2">
        Date
        <div className="flex flex-col">
          <ArrowUpOutlined
            onClick={() => setSortOrder("asc")}
            style={{
              fontSize: 10,
              color: sortOrder === "asc" ? "#1677ff" : "#999",
              cursor: "pointer",
            }}
          />
          <ArrowDownOutlined
            onClick={() => setSortOrder("desc")}
            style={{
              fontSize: 10,
              color: sortOrder === "desc" ? "#1677ff" : "#999",
              cursor: "pointer",
            }}
          />

        </div>
      </div>
    ),
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

      {/* --- Filter Section --- */}
<div className="mb-4 flex flex-wrap gap-4 items-center">
  {/* Search by description */}
  <Input
  placeholder="Search description..."
  prefix={<SearchOutlined />}
  value={searchText}
  onChange={(e) => {
    const value = e.target.value;
    setSearchText(value);
    handleFilter(value, dateRange);
  }}
  style={{ width: 250 }}
/>

<RangePicker
  value={dateRange}
  onChange={(dates) => {
    setDateRange(dates);
    handleFilter(searchText, dates);
  }}
  format="YYYY-MM-DD"
  allowClear
/>




</div>


{/* --- Timeline Table --- */}
<Table
  columns={columns}
  dataSource={[...filteredList].sort((a, b) =>
    sortOrder === "asc"
      ? new Date(a.date) - new Date(b.date)
      : new Date(b.date) - new Date(a.date)
  )}
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
  open={scheduleModalVisible}
  onCancel={() => {
    setScheduleModalVisible(false);
    setEditingSchedule(null);
    scheduleForm.resetFields();
  }}
  footer={null}
  title={
    <div>
      <div>📌 Schedules for "{selectedTimeline?.description || ""}"</div>
      <div style={{ fontSize: 12, color: "#120f0fff" }}>
  Total schedules: {scheduleCounts[selectedTimeline?.timeLineId] ?? 0}
      </div>
    </div>
  }
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

    // Sử dụng trực tiếp thông tin paper + score từ item
    const paperToUse = {
  paperId: item.paper?.paperId || item.paperId || undefined,
  title: item.paper?.title || "N/A",
  presenter: {
    authorId: item.presenterId || item.presenter?.authorId,
    name: item.presenterName || item.presenter?.name,
  },
};


    setSelectedPaperForSchedule(paperToUse);

    // Điền dữ liệu vào form
    scheduleForm.setFieldsValue({
      sessionTitle: item.sessionTitle,
      location: item.location,
      paperId: item.paperId,
      presenterId: item.presenterId,
      presentationStartTime: dayjs(item.presentationStartTime),
      presentationEndTime: dayjs(item.presentationEndTime),
    });

    setScheduleFormModalVisible(true);
  }}
>
  Edit
</Button>
,
    <Button
      size="small"
      danger
      onClick={() => showDeleteScheduleConfirm(item.scheduleId)}
    >
      Delete
    </Button>,
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
  <DatePicker
    picker="time"
    format="HH:mm"
    style={{ width: "100%" }}
    disabledTime={getDisabledStartTime(schedules, editingSchedule?.scheduleId)}
  />
</Form.Item>

<Form.Item
  name="presentationEndTime"
  label="End Time"
  dependencies={["presentationStartTime"]}
  rules={[
    { required: true, message: "Please select end time" },
    ({ getFieldValue }) => ({
      validator(_, value) {
        const start = getFieldValue("presentationStartTime");
        if (!start || !value) return Promise.resolve();
        if (value.isAfter(start)) return Promise.resolve();
        return Promise.reject(new Error("End time must be after start time"));
      },
    }),
  ]}
>
  <DatePicker
    picker="time"
    format="HH:mm"
    style={{ width: "100%" }}
    disabledTime={() =>
      getDisabledEndTime(
        schedules,
        scheduleForm.getFieldValue("presentationStartTime"),
        editingSchedule?.scheduleId
      )()
    }
  />
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
  <div className="mt-2 flex items-center">
    <span>
      📝 {selectedPaperForSchedule.title} 
    </span>
    <CloseOutlined
  onClick={() => {
    setSelectedPaperForSchedule(null);
    scheduleForm.setFieldsValue({
      paperId: undefined,
      presenterId: undefined,
    });
  }}
  style={{ color: "red", marginLeft: 8, cursor: "pointer" }}
/>

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
  label="Timeline Date"
  rules={[
    {
      required: true,
      message: "Please select timeline date",
    },
    {
      validator: async (_, value) => {
        if (!value) return Promise.resolve();

        const start = dayjs(conference?.startDate);
        const end = dayjs(conference?.endDate);

        if (!start || !end) return Promise.resolve(); // nếu chưa load conference

        if (value.isBefore(start) || value.isAfter(end)) {
          return Promise.reject(
            new Error(
              `Timeline must be within conference date range (${start.format(
                "YYYY-MM-DD"
              )} → ${end.format("YYYY-MM-DD")})`
            )
          );
        }

        return Promise.resolve();
      },
    },
    {
      validator: timelineDateValidator(list, editing?.timeLineId),
    },
  ]}
>
  <DatePicker
    showTime={{ format: "HH:mm" }}
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
      <div className="text-gray-500 text-center">No timeline available</div>
    ) : (
      list
        .filter((item) => dayjs(item.date).isValid()) // ✅ chỉ giữ timeline có ngày hợp lệ
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
              {index > 0 && (
                <div className="w-6 h-1 bg-gray-300 mx-2 rounded"></div>
              )}
              <div className={`${bgColor} rounded-xl p-4 shadow w-40 relative`}>
                <p className={`font-bold ${textColor}`}>
                  {dayjs(item.date).format("MMM D, HH:mm")}
                </p>
                <p>{item.description}</p>

                {/* --- Eye Icon for View Schedule --- */}
               {(scheduleCounts[item.timeLineId] ?? 0) > 0 && (
  <button
    onClick={() => handleViewSchedules(item)}
    className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
    title="View Schedule"
  >
    <Eye size={18} />
  </button>
)}



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