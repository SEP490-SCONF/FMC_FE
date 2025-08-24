import React, { useEffect, useState } from "react";
import { Card, Modal, Spin, Typography, Button, Space } from "antd";
import dayjs from "dayjs";
import { getAllProceedings } from "../../services/ProceedingService";
import { getConferenceById } from "../../services/ConferenceService";
import PDFBookViewer from "../../components/organizer/PDFBookViewer";
import * as pdfjsLib from "pdfjs-dist/build/pdf";

const { Title, Paragraph, Text } = Typography;

// PDF worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function ViewProceedings() {
  const [loading, setLoading] = useState(false);
  const [proceedings, setProceedings] = useState([]);
  const [selectedProceeding, setSelectedProceeding] = useState(null);
  const [conferenceMap, setConferenceMap] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [viewMode, setViewMode] = useState("pdf");
  const [thumbnails, setThumbnails] = useState({});

  useEffect(() => {
    setLoading(true);
    getAllProceedings()
      .then(async (res) => {
        const data = res || [];
        setProceedings(data);

        // Lấy thông tin conference theo conferenceId
        const confs = {};
        for (const p of data) {
          if (p.conferenceId && !confs[p.conferenceId]) {
            try {
              const conf = await getConferenceById(p.conferenceId);
              confs[p.conferenceId] = conf;
            } catch (err) {
              console.warn("Cannot load conference for proceeding", p.proceedingId, err);
            }
          }
        }
        setConferenceMap(confs);

        // Tạo thumbnail PDF
        const thumbs = {};
        for (const p of data) {
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
              thumbs[p.proceedingId] = canvas.toDataURL();
            } catch (err) {
              console.warn("Cannot generate thumbnail for", p.title, err);
            }
          }
        }
        setThumbnails(thumbs);
      })
      .finally(() => setLoading(false));
  }, []);

  const openModal = (proc) => {
    setSelectedProceeding(proc);
    setViewMode("pdf");
    setModalVisible(true);
  };

  if (loading) return <Spin size="large" style={{ marginTop: 80, display: "block" }} />;

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>📚 Proceedings</Title>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        {proceedings.map((proc) => {
          const conf = conferenceMap[proc.conferenceId] || {};
          return (
            <Card
              key={proc.proceedingId}
              hoverable
              cover={
                <img
                  src={thumbnails[proc.proceedingId] || "/default-cover.png"}
                  alt={conf.title || proc.title}
                  style={{ height: 200, objectFit: "cover" }}
                  onClick={() => openModal(proc)}
                />
              }
              style={{ width: 180, cursor: "pointer" }}
            >
              <Card.Meta title={conf.title || proc.title} />
            </Card>
          );
        })}
      </div>

      {selectedProceeding && (
        <Modal
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={900}
        >
          {/* Lấy title/description từ Conference */}
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
            {selectedProceeding.publishedDate
              ? dayjs(selectedProceeding.publishedDate).format("YYYY-MM-DD")
              : "N/A"}
          </Paragraph>
          <Paragraph>
            <strong>Published By:</strong>{" "}
            {selectedProceeding.publishedBy?.fullName || "N/A"}
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
