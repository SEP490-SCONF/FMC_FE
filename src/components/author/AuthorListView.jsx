import React from "react";
import { Card, List, Avatar, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const AuthorListView = ({ conferences }) => {
    const navigate = useNavigate();

    return (
        <div style={{ padding: 24 }}>
            <Title level={2}>List of conference you organize</Title>
            <List
                rowKey="conferenceId"
                grid={{ gutter: 16, column: 2 }}
                dataSource={conferences}
                renderItem={(item) => (
                    <List.Item>
                        <Card
                            title={item.title}
                            extra={
                                <Text type={item.status ? "success" : "danger"}>
                                    {item.status ? "Đang mở" : "Đã đóng"}
                                </Text>
                            }
                            hoverable
                            onClick={() => navigate(`/author/conference/${item.conferenceId}/submittedPaper`)}
                            style={{ cursor: "pointer" }}
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
                                        <Text strong>Mô tả:</Text> {item.description} <br />
                                        <Text strong>Thời gian:</Text> {item.startDate} - {item.endDate} <br />
                                        <Text strong>Địa điểm:</Text> {item.location} <br />
                                        <Text strong>Call for Paper:</Text> {item.callForPaper ? "Có" : "Không"} <br />
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

export default AuthorListView;