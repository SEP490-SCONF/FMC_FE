import React, { useState } from "react";
import { Table, Input } from "antd";
import { FiEye, FiDownload } from "react-icons/fi";

const { Search } = Input;

const papers = [
    {
        key: "1",
        name: "Bài báo 1",
        pdfUrl: "https://example.com/paper1.pdf",
        topic: "AI",
        assignedDate: "2025-06-20",
    },
    {
        key: "2",
        name: "Bài báo 2",
        pdfUrl: "https://example.com/paper2.pdf",
        topic: "Machine Learning",
        assignedDate: "2025-06-22",
    },
    // ... thêm dữ liệu nếu cần
];

const PaperAssign = () => {
    const [searchText, setSearchText] = useState("");
    const [filteredData, setFilteredData] = useState(papers);

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

    const columns = [
        {
            title: "Tên bài báo",
            dataIndex: "name",
            key: "name",
            render: (text) => <span className="font-medium text-gray-800">{text}</span>,
        },
        {
            title: "File PDF",
            dataIndex: "pdfUrl",
            key: "pdfUrl",
            render: (url) => (
                <div className="flex gap-3">
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
                    >
                        <FiEye className="text-lg" />
                        <span className="hidden sm:inline">Đọc</span>
                    </a>
                    <a
                        href={url}
                        download
                        className="flex items-center gap-1 text-green-600 hover:text-green-800 transition"
                    >
                        <FiDownload className="text-lg" />
                        <span className="hidden sm:inline">Tải</span>
                    </a>
                </div>
            ),
        },
        {
            title: "Chủ đề",
            dataIndex: "topic",
            key: "topic",
            render: (text) => <span className="text-gray-700">{text}</span>,
        },
        {
            title: "Ngày được giao",
            dataIndex: "assignedDate",
            key: "assignedDate",
            render: (text) => <span className="text-gray-500">{text}</span>,
        },
    ];

    return (
        <div className="p-6 bg-white rounded-xl shadow-md max-w-5xl mx-auto mt-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                📄 Danh sách bài báo được giao
            </h2>
            <Search
                placeholder="🔍 Tìm kiếm theo tên bài báo hoặc chủ đề"
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
