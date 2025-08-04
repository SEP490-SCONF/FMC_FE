import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getPapersByConferenceWithFilter,
  getPaperById,
} from "../../services/PaperSerice";

export default function PaperListByConference() {
  const { conferenceId } = useParams();
  const [papers, setPapers] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedPaperId, setSelectedPaperId] = useState(null);
  const [paperDetails, setPaperDetails] = useState({});

  useEffect(() => {
    async function fetchPapers() {
      try {
        const res = await getPapersByConferenceWithFilter(conferenceId);
        setPapers(res.data || res);
      } catch (err) {
        console.error("Error fetching papers:", err);
      }
    }

    fetchPapers();
  }, [conferenceId]);

  const openDetail = async (paperId) => {
    console.log("🔍 Open detail for paperId:", paperId);

    if (!paperDetails[paperId]) {
      try {
        const res = await getPaperById(paperId);
        const paper = res.data || res; // đảm bảo lấy đúng object
        console.log("✅ Paper detail loaded:", paper);
        setPaperDetails((prev) => ({ ...prev, [paperId]: paper }));
      } catch (err) {
        console.error("❌ Error loading paper detail:", err);
        return;
      }
    }

    setSelectedPaperId(paperId);
  };

  const closeDetail = () => {
    setSelectedPaperId(null);
  };

  const filteredPapers = papers.filter((paper) => {
    if (filterStatus === "Reviewed") {
      return paper.status === "Accepted" || paper.status === "Rejected";
    } else if (filterStatus === "Unreviewed") {
      return paper.status !== "Accepted" && paper.status !== "Rejected";
    }
    return true;
  });

  const detail = selectedPaperId ? paperDetails[selectedPaperId] : null;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        📄 Papers in Conference #{conferenceId}
      </h2>

      <div className="mb-4">
        <label className="mr-2 font-medium">Filter by Review Status:</label>
        <select
          className="border p-1 rounded"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Reviewed">Reviewed</option>
          <option value="Unreviewed">Unreviewed</option>
        </select>
      </div>

      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Author</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredPapers.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center py-4 text-gray-500">
                No papers found.
              </td>
            </tr>
          )}

          {filteredPapers.map((paper) => (
            <tr key={paper.paperId}>
              <td className="p-2 border">{paper.paperId}</td>
              <td className="p-2 border">{paper.title}</td>
              <td className="p-2 border">
                {paper.authors && paper.authors.length > 0
                  ? paper.authors
                      .sort((a, b) => a.authorOrder - b.authorOrder)
                      .map((a) => a.fullName)
                      .join(", ")
                  : "N/A"}
              </td>
              <td className="p-2 border">{paper.status}</td>
              <td className="p-2 border">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => openDetail(paper.paperId)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Detail */}
      {selectedPaperId && detail && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeDetail}
        >
          <div
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeDetail}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-lg"
            >
              &times;
            </button>

            <h3 className="text-xl font-bold mb-4">📄 Paper Details</h3>
            <div className="space-y-2 text-sm text-gray-800">
              <p>
                <strong>Title:</strong> {detail.title}
              </p>
              <p>
                <strong>Abstract:</strong> {detail.abstract}
              </p>
              <p>
                <strong>Uploaded:</strong> {detail.submitDate}
              </p>
              <p>
                <strong>PDF:</strong>{" "}
                <a
                  href={detail.filePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Download PDF
                </a>
              </p>
              <p>
                <strong>Authors:</strong>{" "}
                {detail.authors && detail.authors.length > 0
                  ? detail.authors
                      .sort((a, b) => a.authorOrder - b.authorOrder)
                      .map((a) => a.fullName)
                      .join(", ")
                  : "N/A"}
              </p>
              <p>
                <strong>Status:</strong> {detail.status}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
