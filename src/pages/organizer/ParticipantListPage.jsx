import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { List, Card, Avatar, Typography, Input, Divider, message, Pagination } from "antd";
import { getUserConferenceRolesByConferenceId } from "../../services/UserConferenceRoleService";

const { Title, Text } = Typography;
const { Search } = Input;

const ParticipantListPage = () => {
  const { conferenceId } = useParams();
  const [participants, setParticipants] = useState([]);
  const [filteredParticipants, setFilteredParticipants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const fetchParticipants = async () => {
    try {
      const res = await getUserConferenceRolesByConferenceId(conferenceId);
      const data = res.data || res;
      // Lọc chỉ lấy conferenceRoleId = 1 (Participate)
      const filtered = data.filter(ucr => ucr.conferenceRoleId === 1);
      setParticipants(filtered);
      setFilteredParticipants(filtered);
    } catch (err) {
      console.error("Failed to load participants:", err);
      message.error("Failed to load participants.");
    }
  };

  useEffect(() => {
    if (conferenceId) fetchParticipants();
  }, [conferenceId]);

  useEffect(() => {
    const lower = searchTerm.toLowerCase();
    const filtered = participants.filter(
      p =>
        p.userName?.toLowerCase().includes(lower) ||
        p.userEmail?.toLowerCase().includes(lower)
    );
    setFilteredParticipants(filtered);
    setCurrentPage(1);
  }, [searchTerm, participants]);

  const paginatedParticipants = filteredParticipants.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Participants of Conference #{conferenceId}</Title>
      <Text strong>Total participants: {participants.length}</Text>

      <Divider />

      <Search
        placeholder="Search by name or email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        allowClear
        style={{ maxWidth: 300, marginBottom: 24 }}
      />

      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={paginatedParticipants}
        locale={{ emptyText: "No participants found." }}
        renderItem={(user) => (
          <List.Item>
            <Card hoverable>
              <Card.Meta
                avatar={
                  user.avatarUrl ? (
                    <Avatar src={user.avatarUrl} size={64} />
                  ) : (
                    <Avatar size={64}>{user.userName?.[0]}</Avatar>
                  )
                }
                title={user.userName}
                description={<Text>{user.userEmail}</Text>}
              />
            </Card>
          </List.Item>
        )}
      />

      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={filteredParticipants.length}
        onChange={(page) => setCurrentPage(page)}
        style={{ marginTop: 24, textAlign: "center" }}
      />
    </div>
  );
};

export default ParticipantListPage;
