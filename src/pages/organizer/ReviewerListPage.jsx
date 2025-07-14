import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  List,
  Avatar,
  Typography,
  Card,
  message,
  Button,
  Divider,
  Checkbox,
  Input,
  Pagination,
} from "antd";
import {
  getConferenceReviewers,
  createUserConferenceRole,
    getUserConferenceRolesByConferenceId, // 👈 Dùng cái này

} from "../../services/UserConferenceRoleService";
import { getUsersByRole } from "../../services/UserService";

const { Title, Text } = Typography;
const { Search } = Input;

const ReviewerListPage = () => {
  const { conferenceId } = useParams();
  const [reviewers, setReviewers] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [showAddReviewer, setShowAddReviewer] = useState(false);
  

  // Phân trang và tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [totalReviewers, setTotalReviewers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  const fetchReviewers = async (page = 1, search = "") => {
  try {
    const res = await getConferenceReviewers(conferenceId, {
      page,
      pageSize,
      search,
    });

    const data = res.data || res;
    console.log("📦 Full API response data:", data);

    const reviewersList = data.value || data;
    setReviewers(reviewersList);

    const total = 
  data["odata_count"] || 
  data["@odata.count"] ||
  data["@odata_count"] ||
  data.total ||
  reviewersList.length ||
  0;


    console.log("🔢 Total reviewers (for pagination):", total);
    setTotalReviewers(total);
  } catch (err) {
    console.error("❌ Failed to load reviewers:", err);
    message.error("Failed to load reviewers.");
  }
};




  const loadMembers = async () => {
  try {
    const res = await getUsersByRole(2); // Lấy tất cả member
    const allMembers = res.data || res;

    // Lấy tất cả UserConferenceRole trong hội thảo này
    const reviewerRes = await getUserConferenceRolesByConferenceId(conferenceId);
    const allRoles = reviewerRes.data || reviewerRes;

    // Lọc ra các userId đã có role reviewer (id = 3)
    const reviewerIds = new Set(
      allRoles
        .filter((ucr) => ucr.conferenceRoleId === 3)
        .map((ucr) => ucr.userId)
    );

    // Lọc những member chưa là reviewer
    const availableMembers = allMembers.filter(
      (user) => !reviewerIds.has(user.userId)
    );

    setMembers(availableMembers);
  } catch (err) {
    console.error("❌ Failed to load members:", err);
    message.error("Failed to load members.");
  }
};


  useEffect(() => {
  if (conferenceId) {
    fetchReviewers(currentPage, debouncedSearchTerm);
  }
}, [conferenceId, currentPage, debouncedSearchTerm]);

useEffect(() => {
  loadMembers();
}, [reviewers]);

useEffect(() => {
  const delayDebounce = setTimeout(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 300);

  return () => clearTimeout(delayDebounce);
}, [searchTerm]);

useEffect(() => {
  setCurrentPage(1);
}, [debouncedSearchTerm]);

  const handleCheckboxChange = (userId, checked) => {
    setSelectedUserIds((prev) =>
      checked ? [...prev, userId] : prev.filter((id) => id !== userId)
    );
  };

  const handleAddReviewers = async () => {
    if (selectedUserIds.length === 0) {
      return message.warning("Please select at least one member.");
    }

    try {
      await Promise.all(
        selectedUserIds.map((userId) =>
          createUserConferenceRole({
            userId,
            conferenceId: parseInt(conferenceId),
            conferenceRoleId: 3,
          })
        )
      );
      message.success("Reviewers assigned successfully.");
      setSelectedUserIds([]);
      setShowAddReviewer(false);
      fetchReviewers(currentPage, searchTerm);
    } catch (err) {
      console.error(err);
      message.error("Failed to assign reviewers.");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>List of Reviewers for Conference #{conferenceId}</Title>

      <Divider orientation="left">Manage Reviewers</Divider>

      <Button
        type={showAddReviewer ? "default" : "primary"}
        onClick={() => setShowAddReviewer(!showAddReviewer)}
        style={{ marginBottom: 16 }}
      >
        {showAddReviewer ? "Cancel" : "Assign Reviewer"}
      </Button>

      {showAddReviewer && (
        <Card
          title="Select Members to Assign"
          style={{ maxWidth: 400, marginBottom: 24 }}
          bodyStyle={{ padding: 12 }}
        >
          <div
            style={{
              maxHeight: 250,
              overflowY: "auto",
              paddingRight: 8,
            }}
          >
            <List
              dataSource={members}
              size="small"
              locale={{ emptyText: "No members available." }}
              renderItem={(user) => (
                <List.Item style={{ padding: "4px 0" }}>
                  <Checkbox
                    checked={selectedUserIds.includes(user.userId)}
                    onChange={(e) =>
                      handleCheckboxChange(user.userId, e.target.checked)
                    }
                    style={{ marginRight: 8 }}
                  />
                  <Text>
                    {user.name} ({user.email})
                  </Text>
                </List.Item>
              )}
            />
          </div>
          <Button
            type="primary"
            style={{ marginTop: 12 }}
            disabled={selectedUserIds.length === 0}
            onClick={handleAddReviewers}
            block
          >
            Assign Selected as Reviewers
          </Button>
        </Card>
      )}

      <Divider orientation="left" style={{ marginTop: 32 }}>
        Current Reviewers
      </Divider>

      <Search
  placeholder="Search by name or email"
  onChange={(e) => setSearchTerm(e.target.value)}
  allowClear
  value={searchTerm}
  style={{ maxWidth: 300, marginBottom: 16 }}
/>



      <List
        grid={{ gutter: 16, column: 2 }}
        dataSource={reviewers}
        locale={{ emptyText: "No reviewers found." }}
        renderItem={(user) => (
          <List.Item>
            <Card hoverable>
              <Card.Meta
                avatar={
                  user.avatarUrl ? (
                    <Avatar src={user.avatarUrl} />
                  ) : (
                    <Avatar>{user.userName?.[0]}</Avatar>
                  )
                }
                title={user.userName}
                description={
                  <>
                    <Text>Email: {user.userEmail}</Text> <br />
                    <Text>Role: {user.roleName}</Text> <br />
                    <Text>
                      Assigned At:{" "}
                      {user.assignedAt
                        ? new Date(user.assignedAt).toLocaleString()
                        : "N/A"}
                    </Text>
                  </>
                }
              />
            </Card>
          </List.Item>
        )}
      />

      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={totalReviewers}
        onChange={(page) => setCurrentPage(page)}
        style={{ marginTop: 24, textAlign: "center" }}
      />
    </div>
  );
};

export default ReviewerListPage;
