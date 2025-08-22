import React, { useState } from "react";
import {
  Card,
  List,
  Typography,
  Input,
  Select,
  Row,
  Col,
  DatePicker,
} from "antd";
import { useNavigate } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

const { Title, Text } = Typography;
const { Option } = Select;

const AuthorListView = ({ conferences }) => {
  const navigate = useNavigate();

  // Filter states
  const [searchBy, setSearchBy] = useState("title");
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [callForPaperFilter, setCallForPaperFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [dateRange, setDateRange] = useState(null);

  // Extract unique locations
  const locations = Array.from(new Set(conferences.map((c) => c.location)));

  // Apply filters
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
    <div style={{ padding: 24 }}>
      <Title level={2}>Conferences You Have Submitted Papers To</Title>

      {/* Filter controls */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* Search field selector */}
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

        {/* Search text input */}
        <Col xs={24} sm={10}>
          <Input
            placeholder={`Search by ${searchBy}`}
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Col>

        {/* Status filter */}
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

        {/* Call for paper filter */}
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

        {/* Location filter */}
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

        {/* Date range filter */}
        <Col xs={24} sm={8}>
          <DatePicker.RangePicker
            style={{ width: "100%" }}
            onChange={(dates) => setDateRange(dates)}
            format="YYYY-MM-DD"
          />
        </Col>
      </Row>

      {/* List of conferences */}
      <List
        rowKey="conferenceId"
        grid={{ gutter: 16, column: 2 }}
        dataSource={filteredConferences}
        pagination={{ pageSize: 4 }}
        renderItem={(item) => (
          <List.Item>
            <Card
              hoverable
              title={item.title}
              extra={
                <Text type={item.status ? "success" : "danger"}>
                  {item.status ? "Open" : "Closed"}
                </Text>
              }
              onClick={() =>
                navigate(
                  `/author/conference/${item.conferenceId}/submittedPaper`
                )
              }
              style={{ cursor: "pointer" }}
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
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default AuthorListView;
