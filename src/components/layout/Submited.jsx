import React, { useState } from "react";

const Submited = ({ submissions = [] }) => {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <div className="bg-white min-h-screen pb-10 flex flex-col">
      <div className="border-b border-gray-200 py-6 px-8">
        <h2 className="font-bold text-3xl text-center">AI Conference</h2>
      </div>
      <div className="w-full max-w-6xl mx-auto mt-8 bg-white">
        <h5 className="my-6 font-semibold text-lg text-gray-700">
          History Submission
        </h5>
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
              {submissions.map((s, idx) => {
                const lastRevision =
                  s.paperRevisions && s.paperRevisions.length > 0
                    ? s.paperRevisions[s.paperRevisions.length - 1]
                    : null;
                return (
                  <tr key={s.paperId || idx} className="hover:bg-gray-50">
                    <td className={tdClass}>{s.title}</td>
                    <td className={tdClass}>{s.topicName || "N/A"}</td>
                    <td className={tdClass}>{s.status}</td>
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
                          className="inline-flex items-center gap-1 px-3 py-1 border border-blue-500 text-blue-700 bg-blue-50 rounded-full hover:bg-blue-100 transition text-xs font-medium shadow-sm"
                          onClick={() => setOpenIdx(idx)}
                        >
                          <span className="mr-1">🕑</span>
                          View Revisions
                        </button>
                        <button
                          className="inline-flex items-center gap-1 px-3 py-1 border border-yellow-500 text-yellow-700 bg-yellow-50 rounded-full hover:bg-yellow-100 transition text-xs font-medium"
                          onClick={() => {
                            // TODO: Xử lý nộp lại bài tại đây
                          }}
                        >
                          <span className="mr-1">🔄</span>
                          Resubmit
                        </button>
                        <button
                          className="inline-flex items-center gap-1 px-3 py-1 border border-green-500 text-green-700 bg-green-50 rounded-full hover:bg-green-100 transition text-xs font-medium"
                          onClick={() => {
                            // TODO: Xử lý xem review tại đây
                          }}
                        >
                          <span className="mr-1">📝</span>
                          View Review
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popup hiển thị danh sách revision */}
      {openIdx !== null && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-10 min-w-[500px] max-w-2xl relative border border-gray-200">
            <button
              className="absolute top-3 right-5 text-2xl font-bold text-gray-500 hover:text-gray-700"
              onClick={() => setOpenIdx(null)}
            >
              ×
            </button>
            <h3 className="text-2xl font-semibold mb-6">Paper Revisions</h3>
            <table className="w-full border-collapse text-base bg-white">
              <thead>
                <tr>
                  <th className="border px-3 py-2 font-semibold">#</th>
                  <th className="border px-3 py-2 font-semibold">Status</th>
                  <th className="border px-3 py-2 font-semibold">Submitted At</th>
                  <th className="border px-3 py-2 font-semibold">File</th>
                </tr>
              </thead>
              <tbody>
                {(submissions[openIdx]?.paperRevisions || []).map((rev, i) => (
                  <tr key={rev.revisionId || i}>
                    <td className="border px-3 py-2 text-center">{i + 1}</td>
                    <td className="border px-3 py-2 text-center">{rev.status}</td>
                    <td className="border px-3 py-2 text-center">
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
                    <td className="border px-3 py-2 text-center">
                      {rev.filePath ? (
                        <a
                          href={rev.filePath}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          View
                        </a>
                      ) : (
                        "No file"
                      )}
                    </td>
                  </tr>
                ))}
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
