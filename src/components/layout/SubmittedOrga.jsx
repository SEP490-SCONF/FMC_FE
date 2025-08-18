import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import { getSubmittedPapersByConferenceId } from "../../services/PaperSerice";
import { getConferenceReviewers } from "../../services/UserConferenceRoleService";
import { deleteReviewerAssignment } from "../../services/ReviewerAssignmentService";
import { generateCertificatesForPaper } from "../../services/CertificateService";

import {
  assignReviewerToPaper,
  updateReviewerAssignment,
} from "../../services/ReviewerAssignmentService";
import { useUser } from "../../context/UserContext";
import { useParams } from "react-router-dom";
import { Popconfirm } from "antd";

const SubmittedOrga = () => {
  const { id: conferenceId } = useParams();
  const { user } = useUser();
  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    assignmentId: null,
  });
  const [paperList, setPaperList] = useState([]);
  const [assignIdx, setAssignIdx] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedReviewers, setSelectedReviewers] = useState([]);
  const [reviewers, setReviewers] = useState([]);
  const [reviewerPage, setReviewerPage] = useState(1);
  const reviewersPerPage = 2;
  const [successPopup, setSuccessPopup] = useState(false); // Thêm state cho popup
  const [filterTopic, setFilterTopic] = useState("");
  const [filterAssigned, setFilterAssigned] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;
  function buildQuery() {
    const filters = [];

    if (filterTopic) filters.push(`TopicName eq '${filterTopic}'`);
    if (filterAssigned) filters.push(`IsAssigned eq ${filterAssigned}`);
    if (filterDate) filters.push(`SubmitDate eq ${filterDate}`);

    if (searchText) {
      // Dùng tolower cho cả trường và giá trị tìm kiếm
      const search = searchText.toLowerCase();
      filters.push(
        `(contains(tolower(Title),'${search}') or contains(tolower(Abstract),'${search}') or contains(tolower(Keywords),'${search}'))`
      );
    }
    

    const skip = (page - 1) * pageSize;
    const queryParams = [];

    if (filters.length > 0)
      queryParams.push(`$filter=${filters.join(" and ")}`);
    queryParams.push(`$top=${pageSize}`, `$skip=${skip}`);

    return "?" + queryParams.join("&");
  }

  // Fetch paper list
  useEffect(() => {
    if (conferenceId) {
      const query = buildQuery();
      getSubmittedPapersByConferenceId(conferenceId, query)
        .then((res) => {
          const mapped = (res || []).map((p) => ({
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
        })
        .catch(() => setPaperList([]));
    }
  }, [conferenceId, filterTopic, filterDate, filterAssigned, searchText, page]);

  // Fetch reviewers
  useEffect(() => {
    if (conferenceId) {
      getConferenceReviewers(conferenceId)
        .then((res) => {
          // Nếu API trả về { value: [...] }
          const reviewersArr = Array.isArray(res.value)
            ? res.value
            : Array.isArray(res)
              ? res
              : [];
          setReviewers(reviewersArr);
          console.log("Loaded reviewers:", reviewersArr);
        })
        .catch(() => setReviewers([]));
    }
  }, [conferenceId]);

  const openAssign = (idx) => {
    setAssignIdx(idx);
    setSelectedReviewers(paperList[idx].assigned);
    setSearch("");
  };

  const closeModal = () => {
    setAssignIdx(null);
    setSelectedReviewers([]);
    setSearch("");
  };

  const toggleReviewer = (id) => {
    setSelectedReviewers([id]);
  };

  const handleAssign = async () => {
    const paper = paperList[assignIdx];
    const reviewerId = selectedReviewers[0];
    if (paper.isAssigned && paper.assignmentId) {
      await updateReviewerAssignment(paper.assignmentId, paper.id, reviewerId);
    } else {
      await assignReviewerToPaper(paper.id, reviewerId);
    }
    getSubmittedPapersByConferenceId(conferenceId).then((res) => {
      const mapped = (res || []).map((p) => ({
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
    });
    closeModal();
    setSuccessPopup(true); // Hiện popup
    setTimeout(() => setSuccessPopup(false), 3000); // Ẩn sau 3s
  };

  useEffect(() => {
    setReviewerPage(1);
  }, [search, assignIdx]);

  // Filter reviewers by search
  const filteredReviewers = reviewers.filter(
    (r) =>
      (r.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalReviewerPages = Math.ceil(
    filteredReviewers.length / reviewersPerPage
  );
  const paginatedReviewers = filteredReviewers.slice(
    (reviewerPage - 1) * reviewersPerPage,
    reviewerPage * reviewersPerPage
  );

  const getReviewerIcons = (assigned) => {
    return assigned.map((rid, idx) => {
      const reviewer = reviewers.find((r) => r.userId === rid);
      return (
        <span key={idx} className="text-xl mr-1" title={reviewer?.name || ""}>
          👤
        </span>
      );
    });
  };

  return (
    <>
      <div className="bg-white min-h-screen pb-10 flex flex-col">
        <div className="border-b border-gray-200 py-6 px-8">
          <h2 className="font-bold text-3xl text-left">Paper Submissions</h2>
        </div>
        <div className="flex flex-1 items-start justify-start px-8 py-6">
          <div className="w-full max-w-6xl bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h5 className="font-semibold text-lg text-gray-700 mb-4">
                Submitted Papers List
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <input
                  className="border border-gray-300 rounded px-3 py-2 text-sm"
                  type="text"
                  placeholder="🔍 Search by title, abstract, or keywords"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />

                <select
                  className="border border-gray-300 rounded px-3 py-2 text-sm"
                  value={filterTopic}
                  onChange={(e) => setFilterTopic(e.target.value)}
                >
                  <option value="">All Topics</option>
                  {[...new Set(paperList.map((p) => p.topic))]
                    .filter(Boolean)
                    .map((topic, i) => (
                      <option key={i} value={topic}>
                        {topic}
                      </option>
                    ))}
                </select>

                <select
                  className="border border-gray-300 rounded px-3 py-2 text-sm"
                  value={filterAssigned}
                  onChange={(e) => setFilterAssigned(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="true">Assigned</option>
                  <option value="false">Unassigned</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-base bg-white">
                <thead>
                  <tr>
                    <th className={thClass}>#</th>
                    <th className={thClass}>Author</th>
                    <th className={thClass}>Title</th>
                    <th className={thClass}>Paper</th>
                    <th className={thClass}>Assigned To</th>
                    <th className={thClass}>Assign</th>
                    <th className={thClass}>Status</th>
                    <th className={thClass}>Topic</th>
                    <th className={thClass}>Last Submitted</th>
                    <th className={thClass}>Certificate</th>

                    
                  </tr>
                </thead>
                <tbody>
                  {paperList.map((p, idx) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className={tdClass}>{idx + 1}</td>
                      <td className={tdClass}>{p.author}</td>
                      <td className={tdClass}>{p.title}</td>
                      <td className={tdClass}>
                        
                        {p.filePath ? (
                          <a
                            href={p.filePath}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            View PDF
                          </a>
                        ) : (
                          "No file"
                        )}
                      </td>
                      <td className={tdClass}>
                        {p.isAssigned ? (
                          <span
                            className="text-sm text-green-600 font-medium"
                            title={p.assignedReviewerName}
                          >
                            👤 {p.assignedReviewerName || "Assigned"}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className={tdClass}>
                        {p.isAssigned ? (
                          <>
                            <Popconfirm
                              title="Remove this reviewer?"
                              onConfirm={async () => {
                                await deleteReviewerAssignment(p.assignmentId);
                                getSubmittedPapersByConferenceId(
                                  conferenceId
                                ).then((res) => {
                                  const mapped = (res || []).map((p) => ({
                                    id: p.paperId,
                                    title: p.title,
                                    abstract: p.abstract,
                                    keywords: p.keywords,
                                    topic: p.topicName,
                                    filePath: p.filePath,
                                    status: p.status,
                                    submitDate: p.submitDate,
                                    author: p.name,
                                    assignedReviewerName:
                                      p.assignedReviewerName,
                                    isAssigned: p.isAssigned,
                                    assigned: p.assignedReviewers || [],
                                    assignmentId: p.assignmentId,
                                    updated: false,
                                    resubmits: "",
                                  }));
                                  setPaperList(mapped);
                                });
                                setDeleteConfirm({
                                  open: false,
                                  assignmentId: null,
                                });
                              }}
                              okText="Yes"
                              cancelText="No"
                            >
                              <button
                                className="ml-2 text-2xl border border-red-400 text-red-600 rounded px-2"
                                title="Remove assignment"
                                onClick={() =>
                                  setDeleteConfirm({
                                    open: true,
                                    assignmentId: p.assignmentId,
                                  })
                                }
                              >
                                🗑
                              </button>
                            </Popconfirm>
                          </>
                        ) : p.status === "Accepted" ? (
                          <span
                            className="text-green-600 text-xl"
                            title="Accepted"
                          >
                            ✔️
                          </span>
                        ) : p.status === "Rejected" ? (
                          <span
                            className="text-red-500 text-xl"
                            title="Rejected"
                          >
                            ❌
                          </span>
                        ) : (
                          <button
                            className="text-2xl border border-gray-400 rounded px-2"
                            title="Assign reviewer"
                            onClick={() => openAssign(idx)}
                          >
                            +
                          </button>
                        )}
                      </td>
                      <td className={tdClass}>{p.status}</td>
                      <td className={tdClass}>{p.topic}</td>
                      <td className={tdClass}>
                        {p.submitDate
                          ? new Date(p.submitDate).toLocaleString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </td>

                      <td className={tdClass}>
          {p.status === "Accepted" ? (
            <button
              className="px-2 py-1 bg-green-100 border border-green-500 text-green-700 rounded hover:bg-green-200 text-xs"
              onClick={() => handleSendCertificate(p.id)}
            >
              Send Certificate
            </button>
          ) : (
            <span className="text-gray-400 italic text-xs">N/A</span>
          )}
        </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1 rounded border border-gray-400 bg-white hover:bg-gray-100 disabled:opacity-50"
              >
                Previous
              </button>
              <span>Page {page}</span>
              <button
                onClick={() => setPage((prev) => prev + 1)}
                className="px-3 py-1 rounded border border-gray-400 bg-white hover:bg-gray-100"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {assignIdx !== null && (
        <Modal onClose={closeModal}>
          <button
            className="absolute top-2 right-3 text-xl font-bold text-gray-500 hover:text-gray-700"
            onClick={closeModal}
          >
            ×
          </button>
          <div className="flex items-center mb-4">
            <input
              className="border border-gray-400 rounded px-3 py-1 flex-1"
              placeholder="🔍 Search reviewer"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="ml-3 px-4 py-1 bg-gray-200 border border-gray-400 rounded"
              onClick={handleAssign}
              disabled={selectedReviewers.length === 0}
            >
              Assign
            </button>
          </div>
          <div className="overflow-x-auto max-h-[300px]">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr>
                  <th className="border px-2 py-1 font-semibold text-center">
                    Select
                  </th>
                  <th className="border px-2 py-1 font-semibold text-left">
                    Avatar
                  </th>
                  <th className="border px-2 py-1 font-semibold text-left">
                    Name
                  </th>
                  <th className="border px-2 py-1 font-semibold">Email</th>
                </tr>
              </thead>
              <tbody>
                {paginatedReviewers.length > 0 ? (
                  paginatedReviewers.map((r) => (
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
                          <img
                            src={r.avatarUrl}
                            alt={r.username}
                            className="w-8 h-8 rounded-full mx-auto"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mx-auto text-gray-600">
                            {r.username?.charAt(0) || "?"}
                          </div>
                        )}
                      </td>
                      <td className="border px-2 py-1">{r.userName}</td>
                      <td className="border px-2 py-1">{r.userEmail}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-2 text-gray-400">
                      No reviewer found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setReviewerPage((prev) => Math.max(prev - 1, 1))}
              disabled={reviewerPage === 1}
              className="px-4 py-2 bg-gray-200 border border-gray-400 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">
              Page {reviewerPage} of {totalReviewerPages}
            </span>
            <button
              onClick={() =>
                setReviewerPage((prev) =>
                  Math.min(prev + 1, totalReviewerPages)
                )
              }
              disabled={reviewerPage === totalReviewerPages}
              className="px-4 py-2 bg-gray-200 border border-gray-400 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </Modal>
      )}

      {successPopup && (
        <div className="fixed bottom-4 right-4 bg-green-100 text-green-700 py-2 px-4 rounded-lg shadow-lg text-center max-w-xs z-50">
          Assign reviewer successfully!
        </div>
      )}
    </>
  );
};


const thClass =
  "border border-gray-200 px-3 py-2 font-semibold bg-gray-50 text-xs";
const tdClass = "border border-gray-100 px-3 py-2 text-center bg-white text-xs";

const handleSendCertificate = async (paperId) => {
  try {
    await generateCertificatesForPaper(paperId);
    alert("🎉 Certificate sent successfully!");
  } catch (error) {
    console.error("❌ Failed to send certificate", error);
    alert("❌ Failed to send certificate.");
  }
};

export default SubmittedOrga;
