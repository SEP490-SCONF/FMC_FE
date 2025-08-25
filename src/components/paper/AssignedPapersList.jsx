import React, { useState, useEffect } from "react";
import { Table, Input, Button } from "antd";
import { FiEye, FiDownload, FiEdit } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getReviewerAssignments } from "../../services/ReviewerAssignmentService";
import { useUser } from "../../context/UserContext";
import { addReview } from "../../services/ReviewService";

const { Search } = Input;

const PaperAssign = () => {
    const { user } = useUser();
    const [papers, setPapers] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.userId) {
            getReviewerAssignments(user.userId)
                .then(res => {
                    // Map lại: mỗi revision là một dòng
                    const mapped = (res.data || res).flatMap(item =>
                        (item.revisions || []).map(rev => ({
                            key: `${item.assignmentId}_${rev.revisionId}`,
                            assignmentId: item.assignmentId,
                            name: item.title,
                            pdfUrl: rev.filePath || "",
                            topic: item.topicName,
                            assignedDate: item.assignedAt ? new Date(item.assignedAt).toLocaleDateString("en-GB") : "",
                            revisionId: rev.revisionId,
                            paperId: item.paperId,
                            reviewerId: item.reviewerId,
                            revisionStatus: rev.status,
                        }))
                    );
                    setPapers(mapped);
                    setFilteredData(mapped);
                })
                .catch((err) => {
                    console.error(err);
                    setPapers([]);
                    setFilteredData([]);
                });
        }
    }, [user]);

    const onSearch = (value) => {
        setSearchText(value);
        setFilteredData(
            papers.filter(
                (paper) =>
                    paper.name.toLowerCase().includes(value.toLowerCase()) ||
                    paper.topic.toLowerCase().includes(value.toLowerCase())
            )
        );
    };

    const handleReview = (record) => {
        const formData = new FormData();
        formData.append("PaperId", record.paperId);
        formData.append("ReviewerId", record.reviewerId);
        formData.append("RevisionId", record.revisionId);
        formData.append("Score", 0);
        formData.append("Comments", "");

        addReview(formData)
            .then(() => {
                navigate(`/review/paper/${record.assignmentId}`);
            })
            .catch((error) => {
                console.error("Error adding review:", error);
            });
    };

    const columns = [
        {
            title: "Paper Title",
            dataIndex: "name",
            key: "name",
            render: (text) => <span className="font-medium text-gray-800">{text}</span>,
        },
        {
            title: "File PDF",
            dataIndex: "pdfUrl",
            key: "pdfUrl",
            render: (url) => url ? (
                <div className="flex gap-3">
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
                    >
                        <FiEye className="text-lg" />
                        <span className="hidden sm:inline">View</span>
                    </a>
                    <a
                        href={url}
                        download
                        className="flex items-center gap-1 text-green-600 hover:text-green-800 transition"
                    >
                        <FiDownload className="text-lg" />
                        <span className="hidden sm:inline">Download</span>
                    </a>
                </div>
            ) : <span className="text-gray-400">No file</span>,
        },
        {
            title: "Topic",
            dataIndex: "topic",
            key: "topic",
            render: (text) => <span className="text-gray-700">{text}</span>,
        },
        {
            title: "Assigned Date",
            dataIndex: "assignedDate",
            key: "assignedDate",
            render: (text) => <span className="text-gray-500">{text}</span>,
        },
        {
            title: "Revision Status",
            dataIndex: "revisionStatus",
            key: "revisionStatus",
            render: (status) => (
                <span className={
                    status === "Under Review"
                        ? "text-blue-600 font-semibold"
                        : "text-gray-500"
                }>
                    {status}
                </span>
            ),
        },
        {
            title: "Review",
            key: "review",
            render: (_, record) => (
                <Button
                    type="primary"
                    icon={<FiEdit />}
                    onClick={() => handleReview(record)}
                    disabled={record.revisionStatus !== "Under Review"}
                >
                    Review
                </Button>
            ),
        },
    ];

    return (
        <div className="p-6 bg-white rounded-xl shadow-md max-w-5xl mx-auto mt-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                📄 Assigned Papers List
            </h2>
            <Search
                placeholder="🔍 Search by paper title or topic"
                onSearch={onSearch}
                onChange={(e) => onSearch(e.target.value)}
                value={searchText}
                className="mb-4 w-full sm:w-96"
                allowClear
            />
            <div className="overflow-x-auto">
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    pagination={{ pageSize: 5 }}
                    className="custom-ant-table"
                />
            </div>
        </div>
    );
};

export default PaperAssign;
