import React, { useRef, useState, useEffect } from "react";
import {
  Button,
  Position,
  PrimaryButton,
  Tooltip,
  Viewer,
  Worker,
} from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { highlightPlugin, MessageIcon } from "@react-pdf-viewer/highlight";
import { getPdfUrlByReviewId } from "../../../services/PaperRevisionService";
import {
  addReviewWithHighlightAndComment,
  getReviewWithHighlightAndComment,
  updateReviewWithHighlightAndComment,
  deleteReviewWithHighlightAndComment, // Thêm dòng này
} from "../../../services/ReviewWithHighlightService";
import { useUser } from "../../../context/UserContext";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const ReviewContent = ({ review }) => {
  const { user } = useUser();

  const [fileUrl, setFileUrl] = useState("");
  const [message, setMessage] = useState("");
  const [notes, setNotes] = useState([]);
  const notesContainerRef = useRef(null);
  let noteId = notes.length;

  const [selectedHighlight, setSelectedHighlight] = useState(null);
  const [highlightEditContent, setHighlightEditContent] = useState("");

  const [popup, setPopup] = useState({ open: false, text: "", type: "error" }); // type: 'error' | 'success'

  const noteEles = useRef(new Map());
  const [currentDoc, setCurrentDoc] = useState(null);

  const handleDocumentLoad = (e) => {
    setCurrentDoc(e.doc);
    if (currentDoc && currentDoc !== e.doc) {
      setNotes([]);
    }
  };

  const renderHighlightTarget = (props) => (
    <div
      style={{
        background: "#eee",
        display: "flex",
        position: "absolute",
        left: `${props.selectionRegion.left}%`,
        top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
        transform: "translate(0, 8px)",
        zIndex: 1,
      }}
    >
      <Tooltip
        position={Position.TopCenter}
        target={
          <Button onClick={props.toggle}>
            <MessageIcon />
          </Button>
        }
        content={() => <div style={{ width: "100px" }}>Add a note</div>}
        offset={{ left: 0, top: -8 }}
      />
    </div>
  );

  // Call API when adding a new note
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
          console.log("API Response:", res);

          // ✅ Lấy highlightId đúng
          const highlightId = res?.highlight?.highlightId;

          if (!highlightId) {
            console.error("HighlightId not found in response:", res);
            setPopup({
              open: true,
              text: "Failed to save note (missing ID)",
              type: "error",
            });
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
          setPopup({
            open: true,
            text: "Note added successfully!",
            type: "success",
          });
        } catch (err) {
          console.error("Error adding note:", err);
          setPopup({ open: true, text: "Failed to save note!", type: "error" });
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
            className="bg-blue-600 text-green rounded-lg px-4 py-1 font-semibold hover:bg-blue-700 transition"
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

  const [activateTab, setActivateTab] = useState(() => () => {});

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
    renderHighlightTarget,
    renderHighlightContent,
    renderHighlights,
  });

  const { jumpToHighlightArea } = highlightPluginInstance;

  useEffect(() => {
    return () => {
      noteEles.current.clear();
    };
  }, []);

  // Call API when deleting a note
  const handleDeleteNote = async (highlightId) => {
  try {
    await deleteReviewWithHighlightAndComment(highlightId); // Gọi API xóa theo highlightId
    setNotes((notes) => notes.filter((note) => note.id !== highlightId)); // Xóa khỏi UI
    setPopup({
      open: true,
      text: "Note deleted successfully!",
      type: "success",
    });
  } catch (err) {
    setPopup({
      open: true,
      text: "Failed to delete note!",
      type: "error",
    });
  }
};

  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  const handleEditNote = (id) => {
    const note = notes.find((n) => n.id === id);
    setEditingNoteId(id);
    setEditingContent(note.content);
  };

  // Call API when updating a note
  const handleUpdateNote = async (note, newContent) => {
    if (!review || !review.reviewId) return;
    try {
      const formData = new FormData();
      formData.append("HighlightId", note.id);
      formData.append("ReviewId", review.reviewId);
      formData.append("RevisionId", review.revisionId);
      formData.append("TextHighlighted", note.quote);
      formData.append("CommentText", newContent);

      // Gửi tất cả highlightAreas
      note.highlightAreas.forEach((area, idx) => {
        formData.append(`HighlightAreas[${idx}][PageIndex]`, area.pageIndex);
        formData.append(`HighlightAreas[${idx}][Left]`, area.left || 0);
        formData.append(`HighlightAreas[${idx}][Top]`, area.top || 0);
        formData.append(`HighlightAreas[${idx}][Width]`, area.width || 0);
        formData.append(`HighlightAreas[${idx}][Height]`, area.height || 0);
      });

      await updateReviewWithHighlightAndComment(review.reviewId, formData);
      setPopup({
        open: true,
        text: "Note updated successfully!",
        type: "success",
      });
    } catch (err) {
      setPopup({ open: true, text: "Failed to update note!", type: "error" });
    }
  };

  // Sidebar notes đẹp với Tailwind
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
                  className="bg-blue-600 text-green rounded-lg px-4 py-1 font-semibold shadow hover:bg-blue-700 transition"
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
              <div className="flex flex-row gap-3 justify-end">
                <button
                  className="bg-yellow-100 text-yellow-700 rounded-lg px-4 py-1 font-semibold shadow hover:bg-yellow-200 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditNote(note.id);
                  }}
                >
                  Edit
                </button>
                <button
                  className="bg-red-100 text-red-600 rounded-lg px-4 py-1 font-semibold shadow hover:bg-red-200 transition"
                  onClick={async (e) => {
                    e.stopPropagation();
                    await handleDeleteNote(note.id);
                  }}
                >
                  Delete
                </button>
              </div>
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
        content: sidebarNotes,
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
          // res.Highlights: [{ HighlightId, TextHighlighted, Areas: [{...}] }]
          // res.Comments: [{ CommentId, UserId, CommentText, ... }]
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
    <div style={{ height: "100%" }}>
      {/* Popup Edit/Delete when selecting highlight */}
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
              <button
                className="bg-red-100 text-green-600 rounded-lg px-6 py-2 font-semibold shadow hover:bg-red-200 transition"
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
                className="bg-red-100 text-red-600 rounded-lg px-6 py-2 font-semibold shadow hover:bg-red-200 transition"
                onClick={async () => {
                  try {
                    await deleteReviewWithHighlightAndComment(
                      selectedHighlight.note.id
                    );
                    setNotes((notes) =>
                      notes.filter((n) => n.id !== selectedHighlight.note.id)
                    );
                    setSelectedHighlight(null);
                    setPopup({
                      open: true,
                      text: "Note deleted successfully!",
                      type: "success",
                    });
                  } catch (err) {
                    setPopup({
                      open: true,
                      text: "Failed to delete note!",
                      type: "error",
                    });
                  }
                }}
              >
                Delete
              </button>
              <button
                className="bg-gray-100 text-gray-700 rounded-lg px-6 py-2 font-semibold shadow hover:bg-gray-200 transition"
                onClick={() => setSelectedHighlight(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup message */}
      {popup.open && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-6 py-3 rounded-lg shadow-lg text-base font-semibold
                        ${
                          popup.type === "success"
                            ? "bg-green-100 text-green-700 border border-green-300"
                            : "bg-red-100 text-red-700 border border-red-300"
                        }`}
          style={{ minWidth: 220, maxWidth: 320 }}
        >
          <div className="flex items-center justify-between gap-4">
            <span>{popup.text}</span>
            <button
              className="ml-4 text-lg font-bold text-gray-400 hover:text-gray-700"
              onClick={() => setPopup({ ...popup, open: false })}
            >
              ×
            </button>
          </div>
        </div>
      )}

      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        {fileUrl ? (
          <Viewer
            fileUrl={fileUrl}
            plugins={[highlightPluginInstance, defaultLayoutPluginInstance]}
            onDocumentLoad={handleDocumentLoad}
          />
        ) : (
          <div style={{ textAlign: "center", marginTop: 40, color: "#888" }}>
            PDF not found or loading...
          </div>
        )}
      </Worker>
    </div>
  );
};

export default ReviewContent;
