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

    const matchesLocation =
      locationFilter === "All" || c.location === locationFilter;

    const matchesDate =
      !dateRange ||
      (dayjs(c.startDate).isBefore(dateRange[1], "day") &&
        dayjs(c.endDate).isAfter(dateRange[0], "day"));

    return matchesSearch && matchesStatus && matchesLocation && matchesDate;
  });

  return (
    <div style={{ padding: 24 }}>
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
  grid={{ gutter: 24, column: 2 }}
  dataSource={filteredConferences}
  pagination={{ pageSize: 2 }}
  renderItem={(item) => (
    <List.Item>
      <Card
        hoverable
        style={{
          borderRadius: 10,
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          cursor: "pointer",
          height: "100%", // ensure cards fill row height
          display: "flex",
          flexDirection: "column",
        }}
        bodyStyle={{ flex: 1, display: "flex", flexDirection: "column" }}
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
              height: "250px",
              objectFit: "cover",
              borderRadius: "8px",
              marginBottom: 16,
              flexShrink: 0,
            }}
          />
        )}
        <Title
          level={5}
          style={{
            marginBottom: 8,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {item.title}
        </Title>

        <Text strong>Description:</Text>
        <p
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            marginBottom: 8,
            flexGrow: 1, // push time/location to bottom
          }}
        >
          {item.description}
        </p>

        <Text
          style={{
            display: "block",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            marginBottom: 4,
          }}
        >
          <Text strong>Time: </Text>
          {dayjs(item.startDate).format("YYYY-MM-DD HH:mm")} -{" "}
          {dayjs(item.endDate).format("YYYY-MM-DD HH:mm")}
        </Text>

        <Text
          style={{
            display: "block",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          <Text strong>Location: </Text>
          {item.location}
        </Text>
        <Text
          type={item.status ? "success" : "danger"}
          style={{ float: "right", marginBottom: 8 }}
        >
          {item.status ? "Open" : "Closed"}
        </Text>
      </Card>
    </List.Item>
  )}
/>


    </div>
  );
};

export default OrganizerListView;
