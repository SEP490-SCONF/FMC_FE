import React, { useState, useRef } from "react";
import { uploadRevision } from "../../services/PaperRevisionService";

const ITEMS_PER_PAGE = 3;

const Submited = ({ submissions = [] }) => {
  const [openIdx, setOpenIdx] = useState(null);
  const [message, setMessage] = useState("");
  const [uploadingIdx, setUploadingIdx] = useState(null);
  const fileInputRef = useRef();
  const [pendingPaperId, setPendingPaperId] = useState(null);

  // Pagination state
  const [page, setPage] = useState(1);

  // Sort submissions by latest submittedAt (descending)
  const sortedSubmissions = [...submissions].sort((a, b) => {
    const aTime =
      a.paperRevisions && a.paperRevisions.length > 0
        ? new Date(
            a.paperRevisions[a.paperRevisions.length - 1].submittedAt
          ).getTime()
        : 0;
    const bTime =
      b.paperRevisions && b.paperRevisions.length > 0
        ? new Date(
            b.paperRevisions[b.paperRevisions.length - 1].submittedAt
          ).getTime()
        : 0;
    return bTime - aTime;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedSubmissions.length / ITEMS_PER_PAGE);
  const pagedSubmissions = sortedSubmissions.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  // Xử lý khi bấm nút Resubmit
  const handleResubmit = (status, paperId) => {
    if (status === "Need Revision") {
      setMessage("");
      setPendingPaperId(paperId);
      // Mở file input để chọn file PDF
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    } else {
      switch (status) {
        case "Submitted":
          setMessage(
            "You cannot resubmit this paper because it has already been submitted."
          );
          break;
        case "Under Review":
          setMessage(
            "You cannot resubmit this paper while it is under review."
          );
          break;
        case "Rejected":
          setMessage("This paper was rejected. Please revise and resubmit.");
          break;
        case "Accepted":
          setMessage("This paper is accepted. No need to resubmit.");
          break;
        default:
          setMessage("Unknown status. You cannot resubmit this paper.");
      }
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // Xử lý khi chọn file xong
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setMessage("Only PDF files are allowed.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    if (!pendingPaperId) return;

    setUploadingIdx(pendingPaperId);
    const formData = new FormData();
    formData.append("PdfFile", file);
    formData.append("PaperId", pendingPaperId);

    try {
      await uploadRevision(formData);
      setMessage("Resubmission successful!");
    } catch (err) {
      setMessage(err.message || "Resubmission failed!");
    } finally {
      setUploadingIdx(null);
      setPendingPaperId(null);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="bg-white min-h-screen pb-10 flex flex-col">
      <input
        type="file"
        accept="application/pdf"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <div className="border-b border-gray-200 py-6 px-8">
        <h2 className="font-bold text-3xl text-center"> History Submission</h2>
      </div>
      <div className="w-full max-w-6xl mx-auto mt-8 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-base bg-white">
            <thead>
              <tr>
                <th className={thClass}>Title</th>
                <th className={thClass}>Topic</th>
                <th className={thClass}>Status</th>
                <th className={thClass}>Last Submitted</th>
                <th className={thClass}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagedSubmissions.map((s, idx) => {
                const lastRevision =
                  s.paperRevisions && s.paperRevisions.length > 0
                    ? s.paperRevisions[s.paperRevisions.length - 1]
                    : null;
                return (
                  <tr key={s.paperId || idx} className="hover:bg-gray-50">
                    <td className={tdClass}>{s.title}</td>
                    <td className={tdClass}>{s.topicName || "N/A"}</td>
                    <td className={tdClass}>
                      <span
                        className={
                          s.status === "Submitted"
                            ? "bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold text-xs inline-block"
                            : s.status === "Need Revision"
                              ? "bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-semibold text-xs inline-block"
                              : s.status === "Rejected"
                                ? "bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold text-xs inline-block"
                                : s.status === "Under Review"
                                  ? "bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold text-xs inline-block"
                                  : "bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-semibold text-xs inline-block"
                        }
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className={tdClass}>
                      {lastRevision && lastRevision.submittedAt
                        ? new Date(lastRevision.submittedAt).toLocaleString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : ""}
                    </td>
                    <td className={tdClass}>
                      <div className="flex flex-col gap-2 items-center">
                        <button
                          className="w-36 inline-flex items-center gap-1 px-3 py-1 border border-blue-500 text-blue-700 bg-blue-50 rounded-full hover:bg-blue-100 transition text-xs font-medium shadow-sm justify-center"
                          onClick={() =>
                            setOpenIdx((page - 1) * ITEMS_PER_PAGE + idx)
                          }
                        >
                          <span className="mr-1">🕑</span>
                          View Revisions
                        </button>
                        <button
                          className={`w-36 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium shadow-sm border transition justify-center
        ${
          s.status === "Need Revision"
            ? "border-yellow-500 text-yellow-700 bg-yellow-50 hover:bg-yellow-100"
            : "border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed"
        }
      `}
                          onClick={() => handleResubmit(s.status, s.paperId)}
                          disabled={
                            s.status !== "Need Revision" ||
                            uploadingIdx === s.paperId
                          }
                        >
                          <span className="mr-1">🔄</span>
                          {uploadingIdx === s.paperId
                            ? "Uploading..."
                            : "Resubmit"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Pagination controls */}
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`w-10 h-10 flex items-center justify-center rounded border text-base font-semibold transition
        ${
          page === i + 1
            ? "bg-blue-600 text-green border-blue-600"
            : "bg-white text-blue-600 border-gray-300 hover:bg-blue-50"
        }
      `}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Hiển thị thông báo nếu không thể nộp lại bài */}
      {message && (
        <div className="fixed bottom-4 right-4 bg-red-100 text-red-700 py-2 px-4 rounded-lg shadow-lg text-center max-w-xs z-50">
          {message}
        </div>
      )}
      {/* Popup hiển thị danh sách revision */}
      {openIdx !== null && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20">
          <div className="bg-white rounded-2xl shadow-2xl p-8 min-w-[350px] max-w-lg w-full relative border border-gray-200 animate-fadeIn">
            <button
              className="absolute top-3 right-5 text-2xl font-bold text-gray-400 hover:text-gray-700 transition"
              onClick={() => setOpenIdx(null)}
              aria-label="Close"
            >
              ×
            </button>
            <h3 className="text-2xl font-bold mb-6 text-center text-blue-900 tracking-wide">
              Paper Revisions
            </h3>
            <table className="w-full border-collapse text-base bg-white rounded-lg overflow-hidden shadow">
              <thead>
                <tr>
                  <th className="bg-blue-50 border-b px-4 py-2 font-semibold text-blue-900 text-center rounded-tl-lg">
                    #
                  </th>
                  <th className="bg-blue-50 border-b px-4 py-2 font-semibold text-blue-900 text-center">
                    Status
                  </th>
                  <th className="bg-blue-50 border-b px-4 py-2 font-semibold text-blue-900 text-center rounded-tr-lg">
                    Submitted At
                  </th>
                </tr>
              </thead>
              <tbody>
                {(sortedSubmissions[openIdx]?.paperRevisions || []).map(
                  (rev, i) => (
                    <tr
                      key={rev.revisionId || i}
                      className="hover:bg-blue-50 transition"
                    >
                      <td className="border-b px-4 py-2 text-center">
                        {i + 1}
                      </td>
                      <td className="border-b px-4 py-2 text-center">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            rev.status === "Submitted"
                              ? "bg-green-100 text-green-700"
                              : rev.status === "Need Revision"
                                ? "bg-yellow-100 text-yellow-700"
                                : rev.status === "Rejected"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {rev.status}
                        </span>
                      </td>
                      <td className="border-b px-4 py-2 text-center">
                        {rev.submittedAt
                          ? new Date(rev.submittedAt).toLocaleString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const thClass =
  "border border-gray-200 px-3 py-2 font-semibold bg-gray-50 text-xs";
const tdClass = "border border-gray-100 px-3 py-2 text-center";

export default Submited;
