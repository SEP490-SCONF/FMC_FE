import React, { useState } from "react";
import {
  Card,
  List,
  Typography,
  Button,
  Input,
  Select,
  Row,
  Col,
  DatePicker,
} from "antd";
import { useNavigate } from "react-router-dom";
import { EditOutlined, SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

const { Title, Text } = Typography;
const { Option } = Select;

const OrganizerListView = ({ conferences }) => {
  const navigate = useNavigate();

  const [searchBy, setSearchBy] = useState("title");
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [callForPaperFilter, setCallForPaperFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [dateRange, setDateRange] = useState(null); // [dayjs, dayjs]

  const locations = Array.from(new Set(conferences.map((c) => c.location)));

  const filteredConferences = conferences.filter((c) => {
    const fieldValue = c[searchBy] || "";
    const matchesSearch = fieldValue
      .toString()
      .toLowerCase()
      .includes(searchText.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Open" && c.status) ||
      (statusFilter === "Closed" && !c.status);

    const matchesCallForPaper =
      callForPaperFilter === "All" ||
      (callForPaperFilter === "Yes" && c.callForPaper) ||
      (callForPaperFilter === "No" && !c.callForPaper);

    const matchesLocation =
      locationFilter === "All" || c.location === locationFilter;

    const matchesDate =
  !dateRange ||
  (dayjs(c.startDate).isBefore(dateRange[1], "day") &&
    dayjs(c.endDate).isAfter(dateRange[0], "day"));


    return (
      matchesSearch &&
      matchesStatus &&
      matchesCallForPaper &&
      matchesLocation &&
      matchesDate
    );
  });

  return (
    <div style={{ paddingTop: 0, paddingRight: 24, paddingBottom: 24, paddingLeft: 24 }}>
      <Title level={2}>List of Conferences You Organize</Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Select
            value={searchBy}
            onChange={setSearchBy}
            style={{ width: "100%" }}
          >
            <Option value="title">Title</Option>
            <Option value="description">Description</Option>
            <Option value="location">Location</Option>
          </Select>
        </Col>
        <Col xs={24} sm={10}>
          <Input
            placeholder={`Search by ${searchBy}`}
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Col>

        <Col xs={24} sm={4}>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: "100%" }}
          >
            <Option value="All">All Status</Option>
            <Option value="Open">Open</Option>
            <Option value="Closed">Closed</Option>
          </Select>
        </Col>

        <Col xs={24} sm={4}>
          <Select
            value={callForPaperFilter}
            onChange={setCallForPaperFilter}
            style={{ width: "100%" }}
          >
            <Option value="All">All CFP</Option>
            <Option value="Yes">Call For Paper</Option>
            <Option value="No">No Call For Paper</Option>
          </Select>
        </Col>

        <Col xs={24} sm={6}>
          <Select
            value={locationFilter}
            onChange={setLocationFilter}
            style={{ width: "100%" }}
            placeholder="Filter by Location"
          >
            <Option value="All">All Locations</Option>
            {locations.map((loc) => (
              <Option key={loc} value={loc}>
                {loc}
              </Option>
            ))}
          </Select>
        </Col>

        <Col xs={24} sm={8}>
          <DatePicker.RangePicker
            style={{ width: "100%" }}
            onChange={(dates) => setDateRange(dates)}
            format="YYYY-MM-DD"
          />
        </Col>
      </Row>

      <List
        rowKey="conferenceId"
        grid={{ gutter: 16, column: 2 }}
        dataSource={filteredConferences}
        pagination={{ pageSize: 2 }}
        renderItem={(item) => (
          <List.Item>
            <Card
              hoverable
              title={item.title}
              extra={
                <div style={{ display: "flex", gap: 16 }}>
                  <Text type={item.status ? "success" : "danger"}>
                    {item.status ? "Open" : "Closed"}
                  </Text>
                  <EditOutlined
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(
                        `/manage-conference/${item.conferenceId}/edit`
                      );
                    }}
                    style={{ fontSize: 18, cursor: "pointer" }}
                    title="Edit Conference"
                  />
                </div>
              }
              style={{ cursor: "pointer" }}
              onClick={() =>
                navigate(`/manage-conference/${item.conferenceId}/edit`)
              }
            >
              {item.bannerImage && (
                <img
                  src={item.bannerImage}
                  alt="Conference Banner"
                  style={{
                    width: "100%",
                    height: "140px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginBottom: "16px",
                  }}
                />
              )}

              <Text strong>Description:</Text> {item.description} <br />
              <Text strong>Time:</Text> {item.startDate} - {item.endDate} <br />
              <Text strong>Location:</Text> {item.location} <br />
              <Text strong>Call for Paper:</Text>{" "}
              {item.callForPaper ? "Yes" : "No"} <br />

              <Button
                type="primary"
                style={{ marginTop: "12px" }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(
                    `/manage-conference/${item.conferenceId}/reviewers`
                  );
                }}
              >
                View Reviewers
              </Button>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default OrganizerListView;
