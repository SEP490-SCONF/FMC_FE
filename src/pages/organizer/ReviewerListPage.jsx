import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";

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
  Modal,
} from "antd";
import {
  getConferenceReviewers,
  createUserConferenceRole,
  deleteUserConferenceRole,
  getUserConferenceRolesByConferenceId,
} from "../../services/UserConferenceRoleService";
import { getUsersByRole } from "../../services/UserService";
import { DeleteOutlined } from "@ant-design/icons";



const { Title, Text } = Typography;
const { Search } = Input;

const ReviewerListPage = () => {
  const { conferenceId } = useParams();
  const [reviewers, setReviewers] = useState([]);
  const [totalReviewers, setTotalReviewers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [memberSearch, setMemberSearch] = useState("");
  const [memberPage, setMemberPage] = useState(1);
  const memberPageSize = 5;

  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [showAddReviewer, setShowAddReviewer] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const fetchReviewers = async (page = 1, search = "") => {
    try {
      const res = await getConferenceReviewers(conferenceId, {
        page,
        pageSize,
        search,
      });
      const data = res.data || res;
      const reviewersList = data.value || data;


      setReviewers(reviewersList);
      const total =
        data["odata_count"] ||
        data["@odata.count"] ||
        data["@odata_count"] ||
        data.total ||
        reviewersList.length ||
        0;
      setTotalReviewers(total);
    } catch (err) {
      console.error("❌ Failed to load reviewers:", err);
      message.error("Failed to load reviewers.");
    }
  };

  const loadMembers = async () => {
    try {
      const res = await getUsersByRole(2);
      const allMembers = res.data || res;

      const reviewerRes = await getUserConferenceRolesByConferenceId(conferenceId);
      const allRoles = reviewerRes.data || reviewerRes;

      const reviewerIds = new Set(
        allRoles.filter((ucr) => ucr.conferenceRoleId === 3).map((ucr) => ucr.userId)
      );

      const availableMembers = allMembers.filter((user) => !reviewerIds.has(user.userId));

      setMembers(availableMembers);
      setFilteredMembers(availableMembers);
    } catch (err) {
      console.error("❌ Failed to load members:", err);
      message.error("Failed to load members.");
    }
  };

  const showDeleteConfirm = (id) => {
    Modal.confirm({
      title: (
        <Text strong type="danger" style={{ fontSize: 18 }}>
          ⚠️ Confirm Removal
        </Text>
      ),
      icon: <ExclamationCircleOutlined style={{ color: "#faad14" }} />,
      content: (
        <div>
          <p>This action <Text strong>cannot be undone</Text>.</p>
          <p>Are you sure you want to remove this reviewer?</p>
        </div>
      ),
      okText: "Yes, remove",
      cancelText: "Cancel",
      okType: "danger",
      centered: true,
      onOk: () => handleRemoveReviewer(id),
    });
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

  const handleRemoveReviewer = async (id) => {
    // console.log("🔧 Start removing reviewer:", id);

    try {
      await deleteUserConferenceRole(id);
      // console.log("✅ Successfully removed reviewer:", id);

      message.success("Reviewer removed successfully.");
      fetchReviewers(currentPage, debouncedSearchTerm);
      loadMembers();
    } catch (err) {
      console.error("❌ Failed to remove reviewer:", err);
      message.error("Failed to remove reviewer.");
    }
  };

  const handleMemberSearch = (value) => {
    setMemberSearch(value);
    const lower = value.toLowerCase();
    const filtered = members.filter(
      (user) =>
        user.name.toLowerCase().includes(lower) ||
        user.email.toLowerCase().includes(lower)
    );
    setFilteredMembers(filtered);
    setMemberPage(1);
  };

  const paginatedMembers = filteredMembers.slice(
    (memberPage - 1) * memberPageSize,
    memberPage * memberPageSize
  );

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>List of Reviewers for Conference #{conferenceId}</Title>

      <Text strong>Total assigned reviewers: {totalReviewers}</Text>

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
        >
          <Search
            placeholder="Search members..."
            onChange={(e) => handleMemberSearch(e.target.value)}
            allowClear
            value={memberSearch}
            style={{ marginBottom: 12 }}
          />
          <div style={{ maxHeight: 250, overflowY: "auto", paddingRight: 8 }}>
            <List
              dataSource={paginatedMembers}
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
          <Pagination
            current={memberPage}
            pageSize={memberPageSize}
            total={filteredMembers.length}
            onChange={(page) => setMemberPage(page)}
            size="small"
            style={{ marginTop: 12, textAlign: "center" }}
          />
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
        renderItem={(user) => {
          return (
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
                  title={
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span>{user.userName}</span>
                      <Button
                        type="text"
                        danger
                        size="small"
                        icon={<DeleteOutlined style={{ fontSize: 25, color: "red" }} />}
                        onClick={() => showDeleteConfirm(user.id)}
                      />

                    </div>
                  }
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
          );
        }}

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
