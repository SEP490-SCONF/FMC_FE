import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import { getSubmittedPapersByConferenceId } from "../../service/PaperSerice";
import { getConferenceReviewers } from "../../service/UserConferenceRoleService"; // import hàm mới
import { useParams } from "react-router-dom";

const SubmittedOrga = () => {
    const { id: conferenceId } = useParams();

    const [paperList, setPaperList] = useState([]);
    const [assignIdx, setAssignIdx] = useState(null);
    const [search, setSearch] = useState("");
    const [selectedReviewers, setSelectedReviewers] = useState([]);
    const [reviewers, setReviewers] = useState([]);
    const [reviewerPage, setReviewerPage] = useState(1);
    const reviewersPerPage = 2;

    // Lấy danh sách paper
    useEffect(() => {
        if (conferenceId) {
            getSubmittedPapersByConferenceId(conferenceId)
                .then(res => {
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
                        assigned: [],
                        updated: false,
                        resubmits: "",
                    }));
                    setPaperList(mapped);
                })
                .catch(() => setPaperList([]));
        }
    }, [conferenceId]);

    // Lấy danh sách reviewer
    useEffect(() => {
        if (conferenceId) {
            getConferenceReviewers(conferenceId)
                .then(res => setReviewers(res || []))
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
        setSelectedReviewers((prev) =>
            prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id]
        );
    };

    const handleAssign = () => {
        setPaperList((list) =>
            list.map((p, i) =>
                i === assignIdx ? { ...p, assigned: selectedReviewers } : p
            )
        );
        closeModal();
    };

    useEffect(() => {
        setReviewerPage(1); // Reset về trang 1 khi search thay đổi
    }, [search, assignIdx]);

    // Lọc reviewer theo search
    const filteredReviewers = reviewers.filter((r) =>
        (r.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (r.email || "").toLowerCase().includes(search.toLowerCase())
    );

    const totalReviewerPages = Math.ceil(filteredReviewers.length / reviewersPerPage);
    const paginatedReviewers = filteredReviewers.slice(
        (reviewerPage - 1) * reviewersPerPage,
        reviewerPage * reviewersPerPage
    );

    const getReviewerIcons = (assigned) => {
        return assigned.map((rid, idx) => {
            const reviewer = reviewers.find(r => r.userId === rid);
            return (
                <span key={idx} className="text-xl mr-1" title={reviewer?.name || ""}>👤</span>
            );
        });
    };

    return (
        <>
            <div className="bg-white min-h-screen pb-10 flex flex-col">
                <div className="border-b border-gray-200 py-6 px-8">
                    <h2 className="font-bold text-3xl text-left">Paper Submission</h2>
                </div>
                <div className="flex flex-1 items-start justify-start px-8 py-6">
                    <div className="w-full max-w-6xl bg-white rounded-lg shadow-md p-6">
                        <div className="mb-6">
                            <h5 className="font-semibold text-lg text-gray-700">Danh sách bài nộp</h5>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-base bg-white">
                                <thead>
                                    <tr>
                                        <th className={thClass}>#</th>
                                        <th className={thClass}>Author</th>
                                        <th className={thClass}>Title</th>
                                        <th className={thClass}>Paper</th>
                                        <th className={thClass}>Assignment</th>
                                        <th className={thClass}>Update</th>
                                        <th className={thClass}>Topic</th>

                                        <th className={thClass}>Last Submitted</th>
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
                                                ) : "No file"}
                                            </td>
                                            <td className={tdClass}>
                                                {p.assigned.length > 0 ? (
                                                    <>
                                                        {getReviewerIcons(p.assigned)}
                                                        <button className="ml-2 text-2xl border border-gray-400 rounded px-2" title="Edit assignment" onClick={() => openAssign(idx)}>+</button>
                                                    </>
                                                ) : (
                                                    <button className="text-2xl border border-gray-400 rounded px-2" title="Assign reviewer" onClick={() => openAssign(idx)}>+</button>
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
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {assignIdx !== null && (
                <Modal onClose={closeModal}>
                    <button className="absolute top-2 right-3 text-xl font-bold text-gray-500 hover:text-gray-700" onClick={closeModal}>×</button>
                    <div className="flex items-center mb-4">
                        <input
                            className="border border-gray-400 rounded px-3 py-1 flex-1"
                            placeholder="🔍 search"
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
                                    <th className="border px-2 py-1 font-semibold text-center">Chọn</th>
                                    <th className="border px-2 py-1 font-semibold text-left">Avatar</th>
                                    <th className="border px-2 py-1 font-semibold text-left">Name</th>
                                    <th className="border px-2 py-1 font-semibold">Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedReviewers.length > 0 ? paginatedReviewers.map((r) => (
                                    <tr key={r.userId} className="hover:bg-gray-100">
                                        <td className="border px-2 py-1 text-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedReviewers.includes(r.userId)}
                                                onChange={() => toggleReviewer(r.userId)}
                                                className="accent-blue-500"
                                            />
                                        </td>
                                        <td className="border px-2 py-1 text-center">
                                            {r.avatarUrl ? (
                                                <img src={r.avatarUrl} alt={r.name} className="w-8 h-8 rounded-full mx-auto" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mx-auto text-gray-600">
                                                    {r.name?.charAt(0) || "?"}
                                                </div>
                                            )}
                                        </td>
                                        <td className="border px-2 py-1">{r.name}</td>
                                        <td className="border px-2 py-1">{r.email}</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={4} className="text-center py-2 text-gray-400">No reviewer found</td></tr>
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
                            onClick={() => setReviewerPage((prev) => Math.min(prev + 1, totalReviewerPages))}
                            disabled={reviewerPage === totalReviewerPages}
                            className="px-4 py-2 bg-gray-200 border border-gray-400 rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </Modal>
            )}
        </>
    );
};

const thClass = "border border-gray-200 px-3 py-2 font-semibold bg-gray-50 text-xs";
const tdClass = "border border-gray-100 px-3 py-2 text-center bg-white text-xs";

export default SubmittedOrga;
