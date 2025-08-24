import React, { useEffect, useState, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/web/pdf_viewer.css";
import { Button, InputNumber, Space, Typography, Spin, message } from "antd";

const { Text } = Typography;

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

export default function PDFBookViewer({ pdfUrl }) {
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState({ width: 550, height: 750 });

  const flipBook = useRef();

  useEffect(() => {
    const loadPdf = async () => {
      try {
        setLoading(true);
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        const imgs = [];
        let firstViewport = null;

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
const viewport = page.getViewport({ scale: 1.5 }); // tăng scale cho rõ chữ

          if (!firstViewport) {
            setPageSize({
              width: Math.min(Math.round(viewport.width), 800), // giới hạn max
              height: Math.min(Math.round(viewport.height), 650),
            });
            firstViewport = viewport;
          }

          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({ canvasContext: ctx, viewport }).promise;
          imgs.push(canvas.toDataURL());
        }

        setPages(imgs);
      } catch (err) {
        console.error("❌ Failed to load PDF", err);
        message.error("Unable to download PDF file.");
      } finally {
        setLoading(false);
      }
    };
    loadPdf();
  }, [pdfUrl]);

  const handlePrev = () => flipBook.current.pageFlip().flipPrev();
  const handleNext = () => flipBook.current.pageFlip().flipNext();
  const handleJump = (pageNum) => {
    if (!pageNum) return;
    if (pageNum < 1 || pageNum > pages.length) {
      message.warning("Invalid page number!");
      return;
    }
    flipBook.current.pageFlip().flip(pageNum - 1);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <Spin size="large" tip="Loading PDF..." />
      </div>
    );
  }

  if (pages.length === 0) {
    return <p style={{ textAlign: "center" }}>No PDF data to display.</p>;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "10px",
      }}
    >
      {/* Flipbook */}
      <HTMLFlipBook
        width={pageSize.width}
        height={pageSize.height}
        showCover={false}
        startPage={0}
        ref={flipBook}
        onFlip={(e) => setCurrentPage(e.data)}
        style={{
          boxShadow: "0 6px 25px rgba(0,0,0,0.2)",
          borderRadius: 8,
          background: "#f8f8f8",
        }}
      >
        {pages.map((src, idx) => (
          <div
            key={idx}
            className="page"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "#fff",
              position: "relative",
              padding: "20px", // 🔽 thêm padding để giống sách
            }}
          >
            <img
              src={src}
              alt={`page-${idx + 1}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain", // giữ tỉ lệ chuẩn
                borderRadius: "4px",
                maxWidth: "100%",
                maxHeight: "100%",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "10px",
                right: "10px",
                fontSize: "12px",
                color: "#333",
                background: "rgba(255,255,255,0.85)",
                padding: "2px 6px",
                borderRadius: "4px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
              }}
            >
              Page {idx + 1} / {pages.length}
            </div>
          </div>
        ))}
      </HTMLFlipBook>

      {/* Navigation */}
      <Space style={{ marginTop: "8px" }}>
        <Button onClick={handlePrev} disabled={currentPage === 0}>
          ⬅ Prev
        </Button>

        <Text>
          Page <strong>{currentPage + 1}</strong> / {pages.length}
        </Text>

        <Button onClick={handleNext} disabled={currentPage === pages.length - 1}>
          Next ➡
        </Button>

        <InputNumber
          min={1}
          max={pages.length}
          placeholder="Go to page..."
          onPressEnter={(e) => handleJump(Number(e.target.value))}
          style={{ width: 120 }}
        />
      </Space>
    </div>
  );
}
