import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Card, Button, List, Modal, Spin, Space } from "antd";
import Banner from "../../components/conference/ConferenceBanner";
import Schedule from "../../components/conference/ConferenceSchedule";
import Service from "../../components/conference/ConferenceTopic";
import PDFBookViewer from "../../components/organizer/PDFBookViewer";
import { getProceedingsByConference } from "../../services/ProceedingService";
import { getPublishedPapersByConferenceId } from "../../services/PaperSerice";
import { getConferenceById } from "../../services/ConferenceService";
import { getConferenceTopicsByConferenceId } from "../../services/ConferenceTopicService";
import dayjs from "dayjs";
import * as pdfjsLib from "pdfjs-dist/build/pdf";

const { Title, Paragraph, Text } = Typography;

const Home = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedConference, setSelectedConference] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loadingTopics, setLoadingTopics] = useState(false);

  const [proceeding, setProceeding] = useState(null);
  const [papers, setPapers] = useState([]);
  const [loadingProceeding, setLoadingProceeding] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewMode, setViewMode] = useState("pdf");
  const [coverImage, setCoverImage] = useState(null);

  // Load conference
  useEffect(() => {
    if (id) {
      const fetchConference = async () => {
        try {
          const data = await getConferenceById(id);
          if (!data) {
            navigate("/not-found");
            return;
          }
          setSelectedConference(data);
        } catch (err) {
          navigate("/not-found");
        }
      };
      fetchConference();
    }
  }, [id, navigate]);

  // Load topics
  useEffect(() => {
    if (!selectedConference?.conferenceId) return;
    setLoadingTopics(true);
    const fetchTopics = async () => {
      try {
        const topicsData = await getConferenceTopicsByConferenceId(
          selectedConference.conferenceId
        );
        setTopics(topicsData);
      } finally {
        setLoadingTopics(false);
      }
    };
    fetchTopics();
  }, [selectedConference]);

  // Load proceeding + published papers
  useEffect(() => {
    if (!selectedConference?.conferenceId) return;
    setLoadingProceeding(true);

    Promise.all([
      getProceedingsByConference(selectedConference.conferenceId).catch(
        () => null
      ),
      getPublishedPapersByConferenceId(
        selectedConference.conferenceId
      ).catch(() => []),
    ])
      .then(([procRes, papersRes]) => {
        const procArray = procRes
          ? Array.isArray(procRes)
            ? procRes
            : [procRes]
          : [];
        setProceeding(procArray[0] || null);

        const accepted = (papersRes || []).filter(
          (p) =>
            p.paperRevisions?.some((rev) => rev.status === "Accepted") ||
            p.status === "Accepted"
        );
        setPapers(accepted);
      })
      .finally(() => setLoadingProceeding(false));
  }, [selectedConference]);

  // Render cover from PDF if no coverPageUrl
  useEffect(() => {
    if (proceeding?.filePath) {
      const renderCover = async () => {
        try {
          pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
          const pdf = await pdfjsLib.getDocument(proceeding.filePath).promise;
          const page = await pdf.getPage(1);

          const viewport = page.getViewport({ scale: 1 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({ canvasContext: context, viewport }).promise;
          setCoverImage(canvas.toDataURL());
        } catch (err) {
          console.error("Error rendering PDF cover:", err);
        }
      };

      renderCover();
    }
  }, [proceeding]);

  if (!selectedConference || loadingTopics) {
    return (
      <div style={{ textAlign: "center", marginTop: 80 }}>
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  return (
    <main style={{ padding: 24 }}>
      <Banner conference={selectedConference} />
      <Service conference={selectedConference} topics={topics} />

      {/* Proceeding */}
      {loadingProceeding ? (
        <Spin size="large" style={{ marginTop: 40, display: "block" }} />
      ) : (
        <Card style={{ marginBottom: 24 }}>
          <Title level={4}>📚 Proceeding</Title>

          {proceeding ? (
            <>
              {/* Thumbnail cover */}
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <img
                  src={
                    coverImage ||
                    proceeding.coverPageUrl ||
                    "/default-cover.png"
                  }
                  alt={proceeding.title}
                  style={{
                    height: 200,
                    objectFit: "cover",
                    cursor: "pointer",
                    borderRadius: 8,
                  }}
                  onClick={() => setModalVisible(true)}
                />
              </div>
              <Paragraph strong>{proceeding.title}</Paragraph>
            </>
          ) : (
            <p>No proceeding found.</p>
          )}
        </Card>
      )}

      {/* Proceeding Modal */}
      {proceeding && (
        <Modal
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={900}
        >
          <Title level={4}>{selectedConference.title}</Title>
          <Paragraph>{proceeding.description}</Paragraph>

          <Paragraph>
            <strong>DOI:</strong> {proceeding.doi || "N/A"}
          </Paragraph>
          <Paragraph>
            <strong>Published Date:</strong>{" "}
            {proceeding.publishedDate
              ? dayjs(proceeding.publishedDate).format("YYYY-MM-DD")
              : "N/A"}
          </Paragraph>
          <Paragraph>
            <strong>Published By:</strong>{" "}
            {proceeding.publishedBy?.fullName || "N/A"}
          </Paragraph>

          {proceeding.filePath ? (
            <>
              <Space style={{ marginBottom: 16 }}>
                <Button type="primary" onClick={() => setViewMode("pdf")}>
                  PDF View
                </Button>
                <Button type="default" onClick={() => setViewMode("book")}>
                  Book View
                </Button>
              </Space>

              {viewMode === "pdf" ? (
                <iframe
                  src={proceeding.filePath}
                  title={proceeding.title}
                  width="100%"
                  height={600}
                />
              ) : (
                <PDFBookViewer pdfUrl={proceeding.filePath} />
              )}
            </>
          ) : (
            <Text>No PDF available</Text>
          )}
        </Modal>
      )}

      {/* Schedule */}
      <Schedule conference={selectedConference} />
    </main>
  );
};

export default Home;
