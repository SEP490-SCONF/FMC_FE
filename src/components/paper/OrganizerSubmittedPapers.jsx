import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import { getSubmittedPapersByConferenceId } from "../../services/PaperSerice";
import { getConferenceReviewers, getReviewerAssignedPaperCount } from "../../services/UserConferenceRoleService";
import { deleteReviewerAssignment } from "../../services/ReviewerAssignmentService";
import { generateCertificatesForPaper } from "../../services/CertificateService";
import { toast } from "react-toastify";
import {
  assignReviewerToPaper,
  updateReviewerAssignment,
} from "../../services/ReviewerAssignmentService";
import { useUser } from "../../context/UserContext";
import { useParams } from "react-router-dom";
import { Table, Input, Button, Popconfirm, Pagination } from "antd";

const { Search } = Input;

const SubmittedOrga = () => {
  const { id: conferenceId } = useParams();
  const { user } = useUser();
  const [paperList, setPaperList] = useState([]);
  const [assignPaperId, setAssignPaperId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedReviewers, setSelectedReviewers] = useState([]);
  const [reviewers, setReviewers] = useState([]);
  const [reviewerPage, setReviewerPage] = useState(1);
  const reviewersPerPage = 5;

  // Fetch paper list
  const fetchPapers = async () => {
    try {
      const res = await getSubmittedPapersByConferenceId(conferenceId);
      const mapped = (res || []).map((p, index) => ({
        key: p.paperId,
        index: index + 1,
        id: p.paperId,
        title: p.title,
        abstract: p.abstract,
        keywords: p.keywords,
        topic: p.topicName,
        filePath: p.filePath,
        status: p.status,
        submitDate: p.submitDate,
        author: p.name,
        assignedReviewerName: p.assignedReviewerName,
        isAssigned: p.isAssigned,
        assigned: p.assignedReviewers || [],
        assignmentId: p.assignmentId,
        updated: false,
        resubmits: "",
      }));
      setPaperList(mapped);
    } catch {
      setPaperList([]);
      toast.error("Failed to fetch papers.");
    }
  };

  useEffect(() => {
    if (conferenceId) fetchPapers();
    else toast.error("Invalid conference ID.");
  }, [conferenceId]);

  // Fetch reviewers
  const fetchReviewers = async () => {
    try {
      const res = await getConferenceReviewers(conferenceId);
      const reviewersArr = Array.isArray(res.value)
        ? res.value
        : Array.isArray(res)
        ? res
        : [];

      const reviewersWithCount = await Promise.all(
        reviewersArr.map(async (r) => {
          try {
            const countRes = await getReviewerAssignedPaperCount(conferenceId, r.userId);
            return { ...r, assignedPaperCount: countRes.assignedPaperCount };
          } catch {
            return { ...r, assignedPaperCount: 0 };
          }
        })
      );

      setReviewers(reviewersWithCount);
    } catch {
      setReviewers([]);
      toast.error("Failed to fetch reviewers.");
    }
  };

  useEffect(() => {
    if (conferenceId) fetchReviewers();
    else toast.error("Invalid conference ID.");
  }, [conferenceId]);

  const openAssign = (paperId) => {
    const paper = paperList.find((p) => p.id === paperId);
    setAssignPaperId(paperId);
    setSelectedReviewers(paper.assigned);
    setSearchText("");
    setReviewerPage(1);
  };

  const closeModal = () => {
    setAssignPaperId(null);
    setSelectedReviewers([]);
    setSearchText("");
  };

  const toggleReviewer = (id) => {
    setSelectedReviewers([id]);
  };

  const handleAssign = async () => {
    const paper = paperList.find((p) => p.id === assignPaperId);
    const reviewerId = selectedReviewers[0];

    try {
      if (paper.isAssigned && paper.assignmentId) {
        await updateReviewerAssignment(paper.assignmentId, paper.id, reviewerId);
      } else {
        await assignReviewerToPaper(paper.id, reviewerId);
      }
      await Promise.all([fetchPapers(), fetchReviewers()]); // Fetch cả papers và reviewers
      closeModal();
      toast.success("Assign reviewer successfully!");
    } catch {
      toast.error("Failed to assign reviewer.");
    }
  };

  const handleSendCertificate = async (paperId) => {
    try {
      await generateCertificatesForPaper(paperId);
      toast.success("🎉 Certificate sent successfully!");
    } catch (error) {
      console.error("❌ Failed to send certificate", error);
      toast.error("❌ Failed to send certificate.");
    }
  };

  // Filter reviewers based on search
  const filteredReviewers = reviewers.filter(
    (r) =>
      (r.name || "").toLowerCase().includes(searchText.toLowerCase()) ||
      (r.email || "").toLowerCase().includes(searchText.toLowerCase())
  );

  // Ant Design Table Columns
  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      width: 50,
    },
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
      sorter: (a, b) => a.author.localeCompare(b.author),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search author"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: "block" }}
          />
          <div>
            <Button
              type="primary"
              onClick={() => confirm()}
              size="small"
              style={{ width: 90, marginRight: 8 }}
            >
              Search
            </Button>
            <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </div>
        </div>
      ),
      onFilter: (value, record) => record.author.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search title"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: "block" }}
          />
          <div>
            <Button
              type="primary"
              onClick={() => confirm()}
              size="small"
              style={{ width: 90, marginRight: 8 }}
            >
              Search
            </Button>
            <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </div>
        </div>
      ),
      onFilter: (value, record) => record.title.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Paper",
      dataIndex: "filePath",
      key: "filePath",
      render: (filePath) =>
        filePath ? (
          <a href={filePath} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            View PDF
          </a>
        ) : (
          "No file"
        ),
    },
    {
      title: "Assigned To",
      dataIndex: "assignedReviewerName",
      key: "assignedReviewerName",
      render: (text, record) =>
        record.isAssigned ? (
          <span className="text-sm text-green-600 font-medium" title={record.assignedReviewerName}>
            👤 {record.assignedReviewerName || "Assigned"}
          </span>
        ) : (
          <span className="text-gray-400 italic">Unassigned</span>
        ),
    },
    {
      title: "Assign",
      key: "assign",
      render: (text, record) =>
        !record.isAssigned ? (
          <Button
            type="primary"
            shape="circle"
            icon={<span>+</span>}
            onClick={() => openAssign(record.id)}
            title="Assign reviewer"
          />
        ) : (
          <Popconfirm
            title="Remove this reviewer?"
            onConfirm={async () => {
              try {
                await deleteReviewerAssignment(record.assignmentId);
                await Promise.all([fetchPapers(), fetchReviewers()]); // Fetch cả papers và reviewers
                toast.success("Reviewer removed successfully!");
              } catch {
                toast.error("Failed to remove reviewer.");
              }
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="danger"
              shape="circle"
              icon={<span>🗑</span>}
              title="Remove assignment"
            />
          </Popconfirm>
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Accepted", value: "Accepted" },
        { text: "Rejected", value: "Rejected" },
        { text: "Submitted", value: "Submitted" },
        { text: "Under Review", value: "Under Review" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Topic",
      dataIndex: "topic",
      key: "topic",
      filters: [...new Set(paperList.map((p) => p.topic))].map((topic) => ({
        text: topic,
        value: topic,
      })),
      onFilter: (value, record) => record.topic === value,
    },
    {
      title: "Last Submitted",
      dataIndex: "submitDate",
      key: "submitDate",
      sorter: (a, b) => new Date(a.submitDate) - new Date(b.submitDate),
      render: (submitDate) =>
        submitDate
          ? new Date(submitDate).toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
    },
    {
      title: "Certificate",
      key: "certificate",
      render: (text, record) =>
        record.status === "Accepted" ? (
          <Button
            type="primary"
            size="small"
            onClick={() => handleSendCertificate(record.id)}
            className="bg-green-500 hover:bg-green-600 border-none"
          >
            Send Certificate
          </Button>
        ) : (
          <span className="text-gray-400 italic text-xs">N/A</span>
        ),
    },
  ];

  return (
    <div className="bg-white min-h-screen pb-10 flex flex-col">
      <div className="border-b border-gray-200 py-6 px-8">
        <h2 className="font-bold text-3xl text-left">Paper Submissions</h2>
      </div>
      <div className="flex flex-1 items-start justify-start px-8 py-6">
        <div className="w-full max-w-6xl bg-white rounded-lg shadow-md p-6">
          <Search
            placeholder="Search papers by title or author"
            onChange={(e) => setSearchText(e.target.value)}
            style={{ marginBottom: 16, width: 300 }}
            allowClear
          />
          <Table
            columns={columns}
            dataSource={paperList.filter(
              (paper) =>
                paper.title.toLowerCase().includes(searchText.toLowerCase()) ||
                paper.author.toLowerCase().includes(searchText.toLowerCase())
            )}
            pagination={{ pageSize: 5 }}
            scroll={{ x: true }}
          />
        </div>
      </div>

      {assignPaperId !== null && (
        <Modal onClose={closeModal}>
          <Button
            className="absolute top-2 right-3"
            type="text"
            onClick={closeModal}
            icon={<span className="text-xl font-bold text-gray-500 hover:text-gray-700">×</span>}
          />
          <Search
            placeholder="🔍 Search reviewer"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ marginBottom: 16 }}
            allowClear
          />
          <div className="overflow-x-auto max-h-[300px] mb-4">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr>
                  <th className="border px-2 py-1 text-center">Select</th>
                  <th className="border px-2 py-1 text-left">Avatar</th>
                  <th className="border px-2 py-1 text-left">Name</th>
                  <th className="border px-2 py-1">Email</th>
                  <th className="border px-2 py-1 text-center">Assigned Papers</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviewers
                  .slice((reviewerPage - 1) * reviewersPerPage, reviewerPage * reviewersPerPage)
                  .map((r) => (
                    <tr key={r.userId} className="hover:bg-gray-100">
                      <td className="border px-2 py-1 text-center">
                        <input
                          type="radio"
                          name="reviewer"
                          checked={selectedReviewers.includes(r.userId)}
                          onChange={() => toggleReviewer(r.userId)}
                          className="accent-blue-500"
                        />
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {r.avatarUrl ? (
                          <img src={r.avatarUrl} alt={r.username} className="w-8 h-8 rounded-full mx-auto" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mx-auto text-gray-600">
                            {r.username?.charAt(0) || "?"}
                          </div>
                        )}
                      </td>
                      <td className="border px-2 py-1">{r.userName}</td>
                      <td className="border px-2 py-1">{r.userEmail}</td>
                      <td className="border px-2 py-1 text-center">{r.assignedPaperCount ?? 0}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <Pagination
            current={reviewerPage}
            pageSize={reviewersPerPage}
            total={filteredReviewers.length}
            onChange={(page) => setReviewerPage(page)}
            size="small"
          />
          <Button
            type="primary"
            className="mt-4 w-full"
            onClick={handleAssign}
            disabled={selectedReviewers.length === 0}
          >
            Assign
          </Button>
        </Modal>
      )}
    </div>
  );
};

export default SubmittedOrga;