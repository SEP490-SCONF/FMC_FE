import React, { useEffect, useState } from "react";
import { Table, Tag, Typography, Spin, Alert } from "antd";
import { useParams } from "react-router-dom";
import { getFeesByConferenceId } from "../../services/ConferenceFeesService";

const { Title } = Typography;

const ConferenceFee = () => {
  const { id: conferenceId } = useParams();
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!conferenceId) return;
    setLoading(true);
    getFeesByConferenceId(conferenceId)
      .then((res) => {
        // Lấy chỉ các fee visible
        const data = (res.data || res).filter((f) => f.isVisible);
        setFees(data);
        setError("");
      })
      .catch(() => {
        setFees([]);
        setError("Failed to load conference fees.");
      })
      .finally(() => setLoading(false));
  }, [conferenceId]);

  const columns = [
    {
      title: "Fee Type",
      dataIndex: "feeTypeName",
      key: "feeTypeName",
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Mode",
      dataIndex: "mode",
      key: "mode",
      render: (mode) => <Tag color="blue">{mode}</Tag>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (value, record) =>
        value === 0 ? (
          <Tag color="green">Free</Tag>
        ) : (
          <span>
            {value.toLocaleString()} {record.currency}
          </span>
        ),
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      render: (text) => text || <span className="text-gray-400">N/A</span>,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
      <Title level={2} style={{ marginBottom: 24 }}>
        💰 Conference Fees
      </Title>
      {error && <Alert type="error" message={error} className="mb-4" />}
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={fees}
          rowKey={(row) => row.feeDetailId}
          pagination={false}
          locale={{
            emptyText: "No visible fees for this conference.",
          }}
        />
      </Spin>
    </div>
  );
};

export default ConferenceFee;