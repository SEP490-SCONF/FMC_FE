import React, { useEffect, useState } from "react";
import { Card, Modal, Spin, Typography, Button, Space } from "antd";
import dayjs from "dayjs";
import { getAllProceedings } from "../../services/ProceedingService";
import { getConferenceById } from "../../services/ConferenceService";
import { getFeesByConferenceId } from "../../services/ConferenceFeesService";
import PayService from "../../services/PayService";
import { useNavigate } from "react-router-dom";
import PDFBookViewer from "../../components/organizer/PDFBookViewer";
import * as pdfjsLib from "pdfjs-dist/build/pdf";

const { Title, Paragraph, Text } = Typography;

// PDF worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function ViewProceedings() {
  const [loading, setLoading] = useState(false);
  const [proceedings, setProceedings] = useState([]);
  const [conferenceMap, setConferenceMap] = useState({});
  const [selectedProceeding, setSelectedProceeding] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewMode, setViewMode] = useState("pdf");
  const [thumbnails, setThumbnails] = useState({});
  const [pendingPayment, setPendingPayment] = useState(null);


  const navigate = useNavigate();

  useEffect(() => {
    const fetchProceedings = async () => {
      setLoading(true);
      try {
        const data = (await getAllProceedings()) || [];
        const confs = {};

        const dataWithFees = await Promise.all(
          data.map(async (p) => {
            let feeDetailId = null;

            if (p.conferenceId) {
              // Lấy thông tin conference
              if (!confs[p.conferenceId]) {
                try {
                  const conf = await getConferenceById(p.conferenceId);
                  confs[p.conferenceId] = conf;
                } catch (err) {
                  console.warn("Cannot load conference for proceeding", p.proceedingId, err);
                }
              }

              // Lấy feeDetail cho "Proceedings Access"
              try {
                const fees = await getFeesByConferenceId(p.conferenceId);
                const proceedingFee = fees.find(f => f.feeTypeName === "Proceedings Access");
                if (proceedingFee) feeDetailId = proceedingFee.feeDetailId;
              } catch (err) {
                console.warn("Cannot fetch fee for proceeding", p.proceedingId, err);
              }
            }

            // Tạo thumbnail PDF nếu có coverPageUrl
            let thumbnail = null;
            if (p.coverPageUrl && p.coverPageUrl.endsWith(".pdf")) {
              try {
                const pdf = await pdfjsLib.getDocument(p.coverPageUrl).promise;
                const page = await pdf.getPage(1);
                const viewport = page.getViewport({ scale: 0.3 });
                const canvas = document.createElement("canvas");
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                const ctx = canvas.getContext("2d");
                await page.render({ canvasContext: ctx, viewport }).promise;
                thumbnail = canvas.toDataURL();
              } catch (err) {
                console.warn("Cannot generate thumbnail for", p.title, err);
              }
            }

            return { ...p, feeDetailId, coverPageUrl: thumbnail || p.coverPageUrl };
          })
        );

        setConferenceMap(confs);
        setProceedings(dataWithFees);
      } catch (err) {
        console.error("Error fetching proceedings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProceedings();
  }, []);

  const handleProceedingClick = async (proc) => {
  const conferenceId = proc.conferenceId;
  const feeDetailId = proc.feeDetailId;

  if (!conferenceId || !feeDetailId) {
    console.warn("Cannot check payment, missing conferenceId or feeDetailId", proc);
    return;
  }

  try {
    const res = await PayService.hasUserPaidFee(conferenceId, feeDetailId);
    const hasPaid = res?.HasPaid ?? res?.hasPaid ?? false;

    if (hasPaid) {
      setSelectedProceeding(proc);
      setViewMode("pdf");
      setModalVisible(true);
    } else {
      // thay vì navigate ngay -> mở popup confirm
      setPendingPayment({ conferenceId, feeDetailId });
    }
  } catch (err) {
    console.error("Error checking payment:", err);
  }
};



  if (loading) return <Spin size="large" style={{ marginTop: 80, display: "block" }} />;

  return (
  <div style={{ padding: 24 }}>
    <Title level={3}>📚 Proceedings</Title>

    <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
      {proceedings.map(proc => {
        const conf = conferenceMap[proc.conferenceId] || {};
        return (
          <Card
            key={proc.proceedingId}
            hoverable
            cover={
              <img
                src={proc.coverPageUrl || "/default-cover.png"}
                alt={conf.title || proc.title}
                style={{ height: 200, objectFit: "cover" }}
                onClick={() => handleProceedingClick(proc)}
              />
            }
            style={{ width: 180, cursor: "pointer" }}
          >
            <Card.Meta title={conf.title || proc.title} />
          </Card>
        );
      })}
    </div>

    {/* ✅ Modal confirm payment */}
    <Modal
      open={!!pendingPayment}
      onCancel={() => setPendingPayment(null)}
      footer={[
        <Button key="cancel" onClick={() => setPendingPayment(null)}>
          Cancel
        </Button>,
        <Button
          key="pay"
          type="primary"
          onClick={() => {
            if (pendingPayment) {
              navigate("/author/payment", {
                state: {
                  conferenceId: pendingPayment.conferenceId,
                  feeDetailId: pendingPayment.feeDetailId,
                  fees: [{ feeDetailId: pendingPayment.feeDetailId }],
                  includeAdditional: false,
                },
              });
            }
          }}
        >
          Payment
        </Button>,
      ]}
    >
      <Title level={4}>Proceedings Access Required</Title>
      <Paragraph>
        You need to complete the payment before accessing this proceedings.
      </Paragraph>
    </Modal>

    {/* ✅ Modal view proceedings */}
    {selectedProceeding && (
      <Modal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={900}
      >
        <Title level={4}>
          {conferenceMap[selectedProceeding.conferenceId]?.title || selectedProceeding.title}
        </Title>
        <Paragraph>
          {conferenceMap[selectedProceeding.conferenceId]?.description || selectedProceeding.description}
        </Paragraph>

        <Paragraph>
          <strong>DOI:</strong> {selectedProceeding.doi || "N/A"}
        </Paragraph>
        <Paragraph>
          <strong>Published Date:</strong>{" "}
          {selectedProceeding.publishedDate ? dayjs(selectedProceeding.publishedDate).format("YYYY-MM-DD") : "N/A"}
        </Paragraph>
        <Paragraph>
          <strong>Published By:</strong> {selectedProceeding.publishedBy?.fullName || "N/A"}
        </Paragraph>

        {selectedProceeding.filePath ? (
          <>
            <Space style={{ marginBottom: 16 }}>
              <Button
                type={viewMode === "pdf" ? "primary" : "default"}
                onClick={() => setViewMode("pdf")}
              >
                PDF View
              </Button>
              <Button
                type={viewMode === "book" ? "primary" : "default"}
                onClick={() => setViewMode("book")}
              >
                Book View
              </Button>
            </Space>

            {viewMode === "pdf" ? (
              <iframe
                src={selectedProceeding.filePath}
                title={selectedProceeding.title}
                width="100%"
                height={600}
              />
            ) : (
              <PDFBookViewer pdfUrl={selectedProceeding.filePath} />
            )}
          </>
        ) : (
          <Text>No PDF available</Text>
        )}
      </Modal>
    )}
  </div>
);

}
