import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import { getSubmittedPapersByConferenceId } from "../../Service/PaperSerice";
import { useParams } from "react-router-dom";

const reviewerDB = [
    { id: 1, name: "Giacomo Guilizzoni", email: "giacomo@gmail.com", job: "Founder & CEO", age: 40, nickname: "Peldi", employee: true },
    { id: 2, name: "Marco Botton", email: "marco@gmail.com", job: "Tuttofare", age: 38, nickname: "", employee: true },
    { id: 3, name: "Mariah Maclachlan", email: "mariah@gmail.com", job: "Better Half", age: 41, nickname: "Potato", employee: false },
    { id: 4, name: "Valerie Liberty", email: "valerie@gmail.com", job: "Head Chef", age: "", nickname: "Val", employee: false }
];

const SubmittedOrga = () => {
    const { id: conferenceId } = useParams();

    const [paperList, setPaperList] = useState([]);
    const [assignIdx, setAssignIdx] = useState(null);
    const [search, setSearch] = useState("");
    const [selectedReviewers, setSelectedReviewers] = useState([]);

    useEffect(() => {
        if (conferenceId) {
            getSubmittedPapersByConferenceId(conferenceId)
                .then(res => {
                    console.log("Submitted papers:", res);
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

    const filteredReviewers = reviewerDB.filter((r) =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.job.toLowerCase().includes(search.toLowerCase()) ||
        r.nickname.toLowerCase().includes(search.toLowerCase())
    );

    const getReviewerIcons = (assigned) => {
        return assigned.map((rid, idx) => (
            <span key={idx} className="text-xl mr-1" title={reviewerDB.find(r => r.id === rid)?.name || ""}>👤</span>
        ));
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
                                    <th className="border px-2 py-1 font-semibold text-left">Name<br /><span className="font-normal">(job title)</span></th>
                                    <th className="border px-2 py-1 font-semibold">Email</th>
                                    <th className="border px-2 py-1 font-semibold">Age</th>
                                    <th className="border px-2 py-1 font-semibold">Nickname</th>
                                    <th className="border px-2 py-1 font-semibold">Employee</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReviewers.length > 0 ? filteredReviewers.map((r) => (
                                    <tr key={r.id} className="hover:bg-gray-100">
                                        <td className="border px-2 py-1">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedReviewers.includes(r.id)}
                                                    onChange={() => toggleReviewer(r.id)}
                                                    className="accent-blue-500"
                                                />
                                                <span>
                                                    {r.name}<br />
                                                    <span className="text-gray-500 text-xs">{r.job}</span>
                                                </span>
                                            </label>
                                        </td>
                                        <td className="border px-2 py-1">{r.email}</td>
                                        <td className="border px-2 py-1">{r.age}</td>
                                        <td className="border px-2 py-1">{r.nickname}</td>
                                        <td className="border px-2 py-1 text-center">
                                            <input type="checkbox" checked={r.employee} readOnly />
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={5} className="text-center py-2 text-gray-400">No reviewer found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Modal>
            )}
        </>
    );
};

const thClass = "border border-gray-200 px-3 py-2 font-semibold bg-gray-50 text-xs";
const tdClass = "border border-gray-100 px-3 py-2 text-center bg-white text-xs";

export default SubmittedOrga;
