import React, { useEffect, useState } from "react";
import { Table, Button, message, Tag } from "antd";
import { getPapers } from "../../services/PaperSerice";
import { generateCertificatesForPaper } from "../../services/CertificateService";

const ManageAllPaperPage = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sendingId, setSendingId] = useState(null);

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
  setLoading(true);
  try {
    const res = await getPapers();
    console.log("📦 Papers fetched:", res); // Thử log trực tiếp `res`
    const data = res?.data || res || []; // fallback nếu không có .data
    setPapers(data);
  } catch (err) {
    console.error("❌ Error fetching papers:", err);
    message.error("Failed to load papers.");
  } finally {
    setLoading(false);
  }
};


  const handleSendCertificate = async (paperId) => {
    console.log("📤 Sending certificate for paperId:", paperId); // ✅ log khi nhấn nút
    setSendingId(paperId);
    try {
      const res = await generateCertificatesForPaper(paperId);
      console.log("✅ Certificate sent response:", res); // ✅ log phản hồi từ backend
      message.success("Certificate sent successfully!");
    } catch (err) {
      console.error("❌ Error sending certificate:", err); // ✅ log lỗi
      message.error("Failed to send certificate.");
    } finally {
      setSendingId(null);
    }
  };

  const columns = [
  {
    title: "ID",
    dataIndex: "paperId",
    key: "paperId",
  },
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
    render: (text) => text || "N/A",
  },
  {
    title: "Author(s)",
    key: "authors",
    render: (_, record) => {
      if (!record.authors || record.authors.length === 0) return "N/A";
      return record.authors.map((a) => a.fullName).join(", ");
    },
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (text) => text || "N/A",
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) =>
      record.status === "Accepted" ? (
        <Button
          type="primary"
          onClick={() => handleSendCertificate(record.paperId)}
        >
          Send Certificate
        </Button>
      ) : (
        <span style={{ color: "#999" }}>Not accepted</span>
      ),
  },
];


  return (
    <div style={{ padding: 24 }}>
      <h2>Manage All Papers</h2>
      <Table
        dataSource={papers.map((p) => ({ ...p, key: p.paperId }))}
        columns={columns}
        loading={loading}
        bordered
      />
    </div>
  );
};

export default ManageAllPaperPage;
