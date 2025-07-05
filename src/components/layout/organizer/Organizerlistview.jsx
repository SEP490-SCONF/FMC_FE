import React from "react";
import { Card, List, Avatar, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons"; 


const { Title, Text } = Typography;

const OrganizerListView = ({ conferences }) => {
    const navigate = useNavigate();

    return (
        <div style={{ padding: 24 }}>
            <Title level={2}>List of Conferences You Organize</Title>
            <List
                rowKey="conferenceId"
                grid={{ gutter: 16, column: 2 }}
                dataSource={conferences}
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
              e.stopPropagation(); // Ngăn không cho card click xử lý
              navigate(`/manage-conference/${item.conferenceId}/edit`);
            }}
            style={{ fontSize: 18, cursor: "pointer" }}
            title="Edit Conference"
          />
        </div>
      }
      style={{ cursor: "pointer" }}
      onClick={() => navigate(`/manage-conference/${item.conferenceId}`)}
    >
      <Card.Meta
        avatar={
          item.bannerImage ? (
            <Avatar shape="square" size={64} src={item.bannerImage} />
          ) : (
            <Avatar shape="square" size={64}>
              {item.title[0]}
            </Avatar>
          )
        }
        title={item.title}
        description={
          <>
            <Text strong>Description:</Text> {item.description} <br />
            <Text strong>Time:</Text> {item.startDate} - {item.endDate} <br />
            <Text strong>Location:</Text> {item.location} <br />
            <Text strong>Call for Paper:</Text> {item.callForPaper ? "Yes" : "No"} <br />
          </>
        }
      />
    </Card>
  </List.Item>
)}
            />
        </div>
    );
};

export default OrganizerListView;