import React, { useRef, useState, useEffect } from "react";
import {
  Button,
  Position,
  Tooltip,
  Viewer,
  Worker,
} from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { highlightPlugin, MessageIcon } from "@react-pdf-viewer/highlight";
import { getPdfUrlByReviewId } from "../../../services/PaperRevisionService";
import { translatePaperPdf } from "../../../services/PaperSerice";
import { translateHighlightedText } from "../../../services/TranslateService";

import {
  addReviewWithHighlightAndComment,
  getReviewWithHighlightAndComment,
  updateReviewWithHighlightAndComment,
  deleteReviewWithHighlightAndComment,
} from "../../../services/ReviewWithHighlightService";
import { useUser } from "../../../context/UserContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AnalyzeAiService from "../../../services/AnalyzeAiService";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const ReviewContent = ({ review, onChunksGenerated, readOnly = false }) => {
  const { user } = useUser();

  const [fileUrl, setFileUrl] = useState("");
  const [message, setMessage] = useState("");
  const [notes, setNotes] = useState([]);
  const notesContainerRef = useRef(null);

  const [selectedHighlight, setSelectedHighlight] = useState(null);
  const [highlightEditContent, setHighlightEditContent] = useState("");

  const [popup, setPopup] = useState({ open: false, text: "", type: "error" });

  const noteEles = useRef(new Map());
  const [currentDoc, setCurrentDoc] = useState(null);
  const [aiAnalysisResult, setAiAnalysisResult] = useState(null);
  const [highlightTranslation, setHighlightTranslation] = useState(null);
  const [popupPosition, setPopupPosition] = useState(null);
  const [highlightTranslations, setHighlightTranslations] = useState(new Map());


  

  // Hàm đếm số từ trong text
  const countWords = (text) => {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  const handleHighlight = async () => {
  const selection = window.getSelection();
  if (!selection || selection.toString().trim() === "") return;

  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  const containerRect = document
    .querySelector(".rpv-core__viewer") // container Viewer
    .getBoundingClientRect();

  const translated = await translateHighlightedText(selection.toString(), "en");
  setHighlightTranslation(translated);

  setPopupPosition({
    show: true,
    top: rect.bottom - containerRect.top, // vị trí relative so với container
    left: rect.left - containerRect.left,
  });
};

const handleTranslateHighlight = async (selectedText, highlightId) => {
  try {
    const res = await translateHighlightedText(selectedText, highlightLang);
    setHighlightTranslations((prev) => new Map(prev).set(highlightId, res || ""));
    setPopupPosition({ top: rect.bottom + 5, left: rect.left });
  } catch (err) {
    setPopup({ open: true, text: "Failed to translate selected text", type: "error" });
  }
};

  // Hàm chia nhỏ text dựa trên số từ (proxy cho token)
  const splitTextWithOverlap = (text, maxWords, overlapWords) => {
    const chunks = [];
    if (!text) return chunks;

    const words = text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    for (
      let start = 0;
      start < words.length;
      start += maxWords - overlapWords
    ) {
      const remainingWords = words.length - start;
      const length = Math.min(maxWords, remainingWords);
      if (length <= 0) break;

      const chunkWords = words.slice(start, start + length);
      const chunk = chunkWords.join(" ").trim();
      if (chunk) {
        chunks.push({ RawText: chunk });
      }

      if (start + length >= words.length) break;
    }

    return chunks.length > 0 ? chunks : [{ RawText: text }];
  };
  // --- Trạng thái dịch ---
  const [targetLang, setTargetLang] = useState("en-US"); // mặc định English
  const [translating, setTranslating] = useState(false);
  const [translatedText, setTranslatedText] = useState("");
  const [highlightLang, setHighlightLang] = useState(targetLang);

  // --- Modal xem bản dịch ---
  const [showTranslatedModal, setShowTranslatedModal] = useState(false);

  const handleDocumentLoad = async (e) => {
    setCurrentDoc(e.doc);
    if (currentDoc && currentDoc !== e.doc) {
      setNotes([]);
    }

    // Trích xuất text từ PDF, giữ nguyên định dạng
    const numPages = e.doc.numPages;
    let fullText = "";
    for (let i = 1; i <= numPages; i++) {
      const page = await e.doc.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item) => item.str)
        .join("\n") // Giữ xuống dòng từ PDF
        .trim();
      fullText += pageText + "\n"; // Giữ xuống dòng giữa các trang
    }

    // Chia nhỏ text tại FE dựa trên số từ
    const maxWords = 384;
    const overlapWords = 96;
    const chunks = splitTextWithOverlap(fullText, maxWords, overlapWords);

    // Gửi mảng chunk về BE thông qua prop onChunksGenerated
    if (onChunksGenerated) {
      onChunksGenerated(chunks); // Gửi mảng các chunk
      console.log(
        "Generated chunks:",
        chunks.map((c) => ({
          wordCount: countWords(c.RawText),
          content: c.RawText.substring(0, 50) + "...",
        }))
      );
    }

    // Gọi API phân tích AI với mảng chunks
    try {
      if (review?.reviewId) {
        const response = await AnalyzeAiService.analyzeDocument(review.reviewId, chunks); // Gửi mảng chunks
        setAiAnalysisResult(response);
      }
    } catch (error) {
      console.error("AI analysis failed:", error);
      toast.error("Failed to analyze AI content!");
    }
  };

  const prepareTextForApi = (text) => {
    // Chuẩn hóa mọi CRLF và CR thành LF
    return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  };
  // Chia text thành các dòng dựa trên text gốc
  const formatTranslatedTextByOriginal = (translated, original) => {
    if (!translated || !original) return translated || "";

    const originalLines = original.split("\n"); // tách theo dòng gốc
    let words = translated.split(/\s+/); // tách tất cả từ
    let pointer = 0;

    const resultLines = originalLines.map((line) => {
      const wordCount = line.trim().split(/\s+/).length; // số từ dòng gốc
      const portion = words.slice(pointer, pointer + wordCount).join(" ");
      pointer += wordCount;
      return portion;
    });

    return resultLines.join("\n"); // nối lại theo dòng gốc
  };

  const unescapeNewlines = (text) => {
    if (!text) return "";
    return text.replace(/\\n/g, "\n");
  };

  const addLineBreaksBySentence = (text) => {
    if (!text) return "";

    // Regex: kết thúc câu bằng dấu chấm, chấm than, chấm hỏi, hoặc xuống dòng, không tách số thập phân
    const sentences = text.match(/[^.!?\n]+[.!?\n]+|.+$/g);

    if (!sentences) return text;

    return sentences.map((s) => s.trim()).join("\n");
  };

  // Dịch toàn bộ notes
  const handleTranslateNotes = async () => {
    if (!review || !review.paperId) return;
    setTranslating(true);

    try {
      let res = await translatePaperPdf(review.paperId, targetLang);
      let translated = res?.data?.translatedText || "";
      translated = unescapeNewlines(translated)
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n");
      setTranslatedText(translated);
    } catch (err) {
      setPopup({
        open: true,
        text: "Failed to translate notes.",
        type: "error",
      });
    }

    setTranslating(false);
  };

  const renderHighlightTarget = (props) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        position: "absolute",
        left: `${props.selectionRegion.left}%`,
        top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
        transform: "translate(0, 8px)",
        zIndex: 10,
        gap: "8px",
        background: "white",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "6px 10px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
      }}
    >
      {/* Nút Add a Note */}
      <Tooltip
        position={Position.TopCenter}
        target={<Button onClick={props.toggle}><MessageIcon /></Button>}
        content={() => (
          <div
            style={{
              backgroundColor: "rgba(0,0,0,0.85)",
              color: "white",
              padding: "6px 10px",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: 500,
              zIndex: 9999,
              whiteSpace: "nowrap",
              pointerEvents: "none",
            }}
          >
            Add a Note
          </div>
        )}
        offset={{ left: 0, top: -8 }}
      />

      {/* Dropdown chọn ngôn ngữ */}
      <select
        value={highlightLang}
        onChange={(e) => setHighlightLang(e.target.value)}
        style={{
          padding: "4px 6px",
          borderRadius: 6,
          border: "1px solid #ccc",
          fontSize: "13px",
          background: "#f9f9f9",
        }}
      >
        <option value="en-US">Eng</option>
        <option value="vi">VN</option>
        <option value="fr">Fre</option>
        <option value="ja">Jpn</option>
        <option value="zh">CN</option>
      </select>

      {/* Nút Translate + Popup dịch ngay dưới nút */}
      <div style={{ position: "relative", display: "inline-block" }}>
        <Button
          onClick={async () => {
            if (!props.selectedText) return;
            try {
              const res = await translateHighlightedText(props.selectedText, highlightLang);
              setHighlightTranslation(res || "");
              setPopupPosition({ show: true }); // Hiển thị popup
            } catch (err) {
              setPopup({ open: true, text: "Failed to translate selected text", type: "error" });
            }
          }}
        >
          T
        </Button>

        {popupPosition?.show && highlightTranslation && (
  <div
    style={{
      position: "absolute", // sửa từ fixed → absolute
      top: popupPosition.top || 0,
      left: popupPosition.left || 0,
      transform: "translateY(8px)", // 1 chút khoảng cách dưới highlight
      background: "white",
      border: "1px solid #ddd",
      borderRadius: 8,
      padding: "6px 10px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
      zIndex: 9999,
      maxWidth: 1000,
      minWidth: 400,
      padding: "12px 16px", // padding lớn hơn
fontSize: 16,     // chữ lớn hơn
      wordBreak: "break-word",
      overflowWrap: "break-word",
    }}
  >
    {highlightTranslation}
    <button
      style={{
        marginLeft: 8,
        cursor: "pointer",
        border: "none",
        background: "transparent",
      }}
      onClick={() => setPopupPosition(null)}
    >
      ✕
    </button>
  </div>
)}
      </div>
    </div>
  );
};


  const renderHighlightContent = (props) => {
    const addNote = async () => {
      if (message !== "") {
        try {
          const formData = new FormData();
          formData.append("ReviewId", review.reviewId);
          formData.append("RevisionId", review.revisionId);
          formData.append("ReviewerId", user.userId);
          formData.append("TextHighlighted", props.selectedText);
          formData.append("UserId", user.userId);
          formData.append("CommentText", message);
          formData.append("Status", "Draft");

          props.highlightAreas.forEach((area, idx) => {
            formData.append(
              `HighlightAreas[${idx}][PageIndex]`,
              area.pageIndex
            );
            formData.append(`HighlightAreas[${idx}][Left]`, area.left || 0);
            formData.append(`HighlightAreas[${idx}][Top]`, area.top || 0);
            formData.append(`HighlightAreas[${idx}][Width]`, area.width || 0);
            formData.append(`HighlightAreas[${idx}][Height]`, area.height || 0);
          });

          const res = await addReviewWithHighlightAndComment(formData);
          const highlightId = res?.highlight?.highlightId;

          if (!highlightId) {
            toast.error("Failed to save note (missing ID)");
            return;
          }

          const note = {
            id: highlightId,
            content: message,
            highlightAreas: props.highlightAreas,
            quote: props.selectedText,
          };

          setNotes((prev) => [...prev, note]);
          setMessage("");
          props.cancel();
          toast.success("Note added successfully!");
        } catch (err) {
          toast.error("Failed to save note!");
        }
      }
    };

    return (
      <div
        className="bg-white border border-gray-300 rounded-lg p-4 absolute z-10"
        style={{
          left: `${props.selectionRegion.left}%`,
          top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
        }}
      >
        <textarea
          rows={3}
          className="w-full border border-gray-300 rounded p-2 mb-3"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <div className="flex flex-row gap-3 justify-end">
          <button
            className="bg-green-600 text-green rounded-lg px-4 py-1 font-semibold hover:bg-blue-700 transition"
            onClick={addNote}
          >
            Add
          </button>
          <button
            className="bg-gray-100 text-gray-700 rounded-lg px-4 py-1 font-semibold hover:bg-gray-200 transition"
            onClick={props.cancel}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  const [activateTab, setActivateTab] = useState(() => () => { });

  const jumpToNote = (note) => {
    activateTab(3);
    const notesContainer = notesContainerRef.current;
    if (noteEles.current.has(note.id) && notesContainer) {
      notesContainer.scrollTop = noteEles.current
        .get(note.id)
        .getBoundingClientRect().top;
    }
  };

  const renderHighlights = (props) => (
    <div>
      {notes.map((note) => (
        <React.Fragment key={note.id}>
          {note.highlightAreas
            .filter((area) => area.pageIndex === props.pageIndex)
            .map((area, idx) => (
              <div
                key={idx}
                style={{
                  position: "absolute",
                  background: "rgba(255, 255, 0, 0.4)",
                  left: `${area.left}%`,
                  top: `${area.top}%`,
                  width: `${area.width}%`,
                  height: `${area.height}%`,
                  pointerEvents: "auto",
                  zIndex: 2,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedHighlight({
                    note,
                    area,
                    pageIndex: props.pageIndex,
                  });
                  setHighlightEditContent(note.content);
                }}
              />
            ))}
        </React.Fragment>
      ))}
    </div>
  );

  const highlightPluginInstance = highlightPlugin({
    renderHighlightTarget: readOnly ? undefined : renderHighlightTarget,
    renderHighlightContent: readOnly ? undefined : renderHighlightContent,
    renderHighlights,
  });

  const { jumpToHighlightArea } = highlightPluginInstance;

  useEffect(() => {
    return () => {
      noteEles.current.clear();
    };
  }, []);

  const handleDeleteNote = async (highlightId) => {
    try {
      await deleteReviewWithHighlightAndComment(highlightId);
      setNotes((notes) => notes.filter((note) => note.id !== highlightId));
      toast.success("Note deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete note!");
    }
  };

  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  const handleEditNote = (id) => {
    const note = notes.find((n) => n.id === id);
    setEditingNoteId(id);
    setEditingContent(note.content);
  };

  const handleUpdateNote = async (note, newContent) => {
    if (!review || !review.reviewId) return;
    try {
      const formData = new FormData();
      formData.append("HighlightId", note.id);
      formData.append("ReviewId", review.reviewId);
      formData.append("RevisionId", review.revisionId);
      formData.append("TextHighlighted", note.quote);
      formData.append("CommentText", newContent);

      note.highlightAreas.forEach((area, idx) => {
        formData.append(`HighlightAreas[${idx}][PageIndex]`, area.pageIndex);
        formData.append(`HighlightAreas[${idx}][Left]`, area.left || 0);
        formData.append(`HighlightAreas[${idx}][Top]`, area.top || 0);
        formData.append(`HighlightAreas[${idx}][Width]`, area.width || 0);
        formData.append(`HighlightAreas[${idx}][Height]`, area.height || 0);
      });

      await updateReviewWithHighlightAndComment(review.reviewId, formData);
      toast.success("Note updated successfully!");
    } catch (err) {
      toast.error("Failed to delete note!");
    }
  };

  const sidebarNotes = (
    <div ref={notesContainerRef} className="overflow-auto w-full space-y-4">
      {notes.length === 0 && (
        <div className="text-center text-gray-400 py-8">There is no note</div>
      )}
      {notes.map((note) => (
        <div
          key={note.id}
          className="bg-white rounded-xl shadow border border-gray-200 p-4 transition hover:shadow-lg"
          onClick={() => jumpToHighlightArea(note.highlightAreas[0])}
          ref={(ref) => {
            noteEles.current.set(note.id, ref);
          }}
        >
          <blockquote className="border-l-4 border-blue-200 pl-3 mb-2 text-sm text-gray-700 italic bg-blue-50 rounded">
            {note.quote}
          </blockquote>
          {editingNoteId === note.id ? (
            <div className="flex flex-col gap-3 mt-2">
              <textarea
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                rows={3}
              />
              <div className="flex flex-row gap-3 justify-end">
                <button
                  className="bg-white-600 text-green rounded-lg px-4 py-1 font-semibold shadow hover:bg-blue-700 transition"
                  onClick={async (e) => {
                    e.stopPropagation();
                    setNotes((notes) =>
                      notes.map((n) =>
                        n.id === note.id ? { ...n, content: editingContent } : n
                      )
                    );
                    setEditingNoteId(null);
                    await handleUpdateNote(note, editingContent);
                  }}
                >
                  Save
                </button>
                <button
                  className="bg-gray-100 text-gray-700 rounded-lg px-4 py-1 font-semibold shadow hover:bg-gray-200 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingNoteId(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="text-base text-gray-800 mb-2">{note.content}</div>
              {!readOnly && (
                <div className="flex flex-row gap-3 justify-end">
                  <button
                    className="bg-white-100 text-yellow-700 rounded-lg px-4 py-1 font-semibold shadow hover:bg-yellow-200 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditNote(note.id);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-white-100 text-red-600 rounded-lg px-4 py-1 font-semibold shadow hover:bg-red-200 transition"
                    onClick={async (e) => {
                      e.stopPropagation();
                      await handleDeleteNote(note.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    transformToolbarSlot: (slot) => ({
      ...slot,
      Download: () => <></>,
      DownloadMenuItem: () => <></>,
      Print: () => <></>,
      PrintMenuItem: () => <></>,
      Open: () => <></>,
      OpenMenuItem: () => <></>,
      EnterFullScreen: () => <></>,
      EnterFullScreenMenuItem: () => <></>,
    }),
    sidebarTabs: (defaultTabs) =>
      defaultTabs.concat({
        content: (
          <div className="flex flex-col h-full">
            {/* Chọn ngôn ngữ + nút dịch */}
            <div className="px-4 py-2 border-b border-gray-300 flex items-center gap-3">
              <select
                className="border border-gray-300 rounded px-2 py-1"
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
              >
                <option value="en-US">English</option>
                <option value="vi">Vietnamese</option>
                <option value="fr">French</option>
                <option value="ja">Japanese</option>
                <option value="zh">Chinese</option>
              </select>
              <button
                style={{
                  padding: "10px 20px",
                  backgroundColor: translating ? "#4d7c0f" : "#22c55e", // xanh lá đậm khi hover: #4d7c0f, bình thường: #22c55e
                  color: "white",
                  borderRadius: 8,
                  fontWeight: 600,
                  cursor: translating ? "not-allowed" : "pointer",
                  border: "none",
                  transition: "background-color 0.3s ease",
                  userSelect: "none",
                  opacity: translating ? 0.6 : 1,
                }}
                onClick={handleTranslateNotes}
                disabled={translating}
                onMouseEnter={(e) => {
                  if (!translating)
                    e.currentTarget.style.backgroundColor = "#4d7c0f";
                }}
                onMouseLeave={(e) => {
                  if (!translating)
                    e.currentTarget.style.backgroundColor = "#22c55e";
                }}
              >
                {translating ? "Translating..." : "Translate Notes"}
              </button>
            </div>

            {/* Nội dung notes */}
            <div className="overflow-auto w-full flex-grow">{sidebarNotes}</div>
          </div>
        ),
        icon: <MessageIcon />,
        title: "Notes",
      }),
  });

  useEffect(() => {
    if (review && review.reviewId) {
      getPdfUrlByReviewId(review.reviewId)
        .then((res) => {
          if (res && res.pdfUrl) {
            setFileUrl(res.pdfUrl);
          } else {
            setFileUrl("");
          }
        })
        .catch(() => setFileUrl(""));

      getReviewWithHighlightAndComment(review.reviewId)
        .then((res) => {
          if (res && res.highlights && res.comments) {
            const notes = res.highlights.map((h) => {
              const relatedComments = res.comments.filter(
                (c) => c.highlightId === h.highlightId
              );
              return {
                id: h.highlightId,
                content:
                  relatedComments.length > 0
                    ? relatedComments[0].commentText
                    : "",
                highlightAreas: h.areas.map((a) => ({
                  pageIndex: a.pageIndex,
                  left: a.left,
                  top: a.top,
                  width: a.width,
                  height: a.height,
                })),
                quote: h.textHighlighted,
                comments: relatedComments,
              };
            });
            setNotes(notes);
          } else {
            setNotes([]);
          }
        })
        .catch(() => setNotes([]));
    }
  }, [review]);

  useEffect(() => {
    if (popup.open) {
      const timer = setTimeout(
        () => setPopup((p) => ({ ...p, open: false })),
        3000
      );
      return () => clearTimeout(timer);
    }
  }, [popup.open]);

  return (
    <div style={{ height: "100%", position: "relative" }}>
      {/* Popup Edit/Delete khi chọn highlight */}
      {selectedHighlight && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-6 min-w-[300px] max-w-md w-full">
            <textarea
              value={highlightEditContent}
              onChange={(e) => setHighlightEditContent(e.target.value)}
              className="w-full mb-6 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
              rows={4}
            />
            <div className="flex flex-row gap-4 justify-end">
              {!readOnly && (
                <div className="flex flex-row gap-4 justify-end">
                  <button
                    className="bg-white-100 text-green-600 rounded-lg px-6 py-2 font-semibold shadow hover:bg-red-200 transition"
                    onClick={async () => {
                      setNotes((notes) =>
                        notes.map((n) =>
                          n.id === selectedHighlight.note.id
                            ? { ...n, content: highlightEditContent }
                            : n
                        )
                      );
                      await handleUpdateNote(
                        selectedHighlight.note,
                        highlightEditContent
                      );
                      setSelectedHighlight(null);
                    }}
                  >
                    Save
                  </button>
                  <button
                    className="bg-white-100 text-red-600 rounded-lg px-6 py-2 font-semibold shadow hover:bg-red-200 transition"
                    onClick={async () => {
                      try {
                        await deleteReviewWithHighlightAndComment(
                          selectedHighlight.note.id
                        );
                        setNotes((notes) =>
                          notes.filter(
                            (n) => n.id !== selectedHighlight.note.id
                          )
                        );
                        setSelectedHighlight(null);
                        toast.success("Note deleted successfully!");
                      } catch (err) {
                        toast.error("Failed to delete note!");
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}

              <button
                className="bg-white-100 text-gray-700 rounded-lg px-6 py-2 font-semibold shadow hover:bg-gray-200 transition"
                onClick={() => setSelectedHighlight(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {popup.open && (
        <div
          className={`fixed bottom-6 right-6 px-4 py-3 rounded-md font-semibold shadow-md text-white ${popup.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          role="alert"
          style={{
            zIndex: 9999,
            userSelect: "none",
            pointerEvents: "auto",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            maxWidth: "300px",
            wordWrap: "break-word",
          }}
        >
          {popup.text}
        </div>
      )}

      {/* Hiển thị file PDF */}
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        {fileUrl ? (
          <Viewer
            fileUrl={fileUrl}
            plugins={[defaultLayoutPluginInstance, highlightPluginInstance]}
            onDocumentLoad={handleDocumentLoad}
            ini
            tialPage={0}
          />
        ) : (
          <p className="text-center py-20 text-gray-500">
            No PDF file available
          </p>
        )}
      </Worker>

      {/* Nút View Translated Paper nằm dưới PDF */}
      <div style={{ textAlign: "center", marginTop: 16 }}>
        <button
          style={{
            padding: "10px 20px",
            backgroundColor: translatedText ? "#dc2626" : "#aaa",
            color: "white",
            borderRadius: 8,
            fontWeight: 600,
            cursor: translatedText ? "pointer" : "not-allowed",
            border: "none",
            transition: "background-color 0.3s ease",
            userSelect: "none",
            opacity: translatedText ? 1 : 0.6,
          }}
          onClick={() => setShowTranslatedModal(true)}
          disabled={!translatedText}
          onMouseEnter={(e) => {
            if (translatedText)
              e.currentTarget.style.backgroundColor = "#b91c1c";
          }}
          onMouseLeave={(e) => {
            if (translatedText)
              e.currentTarget.style.backgroundColor = "#dc2626";
          }}
        >
          View Translated Paper
        </button>
      </div>

      {/* Hiển thị nội dung dịch dưới cùng (không tiêu đề) */}
      <div
  style={{
    whiteSpace: "pre-wrap",
    lineHeight: 1.6,
    fontFamily: "Times New Roman", // ← thêm font
    fontSize: 14, // có thể chỉnh kích thước
  }}
>
  {translatedText}
</div>


      


      {/* Modal hiện bản dịch */}
      {showTranslatedModal && (
                <div
          className="fixed inset-0 flex justify-center items-center z-50"
          onClick={() => setShowTranslatedModal(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg max-w-3xl max-h-[80vh] overflow-auto p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4"></h2>
            <div style={{ fontSize: 14, lineHeight: 1.6, fontFamily: "Times New Roman" }}>
              {translatedText.split("\n").map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </div>


            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 font-bold"
              onClick={() => setShowTranslatedModal(false)}
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewContent;
