import React, { useState, useEffect } from "react";
import Buttonsubmit from "../ui/button/Button";
import { useConference } from "../../context/ConferenceContext";
import { getConferenceTopicsByConferenceId } from "../../services/ConferenceTopicService";
import { useParams } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { uploadPaperPdf, uploadAndSpellCheck } from "../../services/PaperSerice";
import "../../App.css";

const rules = [
    "Papers must be original and not under consideration elsewhere.",
    "Submissions must be in PDF or DOC/DOCX format.",
    "The paper should follow the conference template and not exceed 8 pages.",
    "Include title, authors, affiliations, and contact email on the first page.",
    "All submissions will be peer-reviewed.",
    "Plagiarism will result in automatic rejection.",
    "At least one author must register and present if accepted.",
];

const SubmitPapers = () => {
    const { selectedConference, fetchConferenceDetail } = useConference();
    const { user } = useUser();
    const { id } = useParams();
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    const [abstract, setAbstract] = useState("");
    const [keywords, setKeywords] = useState("");
    const [topic, setTopic] = useState("");
    const [topics, setTopics] = useState([]);
    const [authorIds, setAuthorIds] = useState(user ? [user.userId] : []);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success"); // "success" or "error"
    const [highlightedUrl, setHighlightedUrl] = useState("");
    const [isChecking, setIsChecking] = useState(false);


    useEffect(() => {
        if (!selectedConference || selectedConference.conferenceId !== Number(id)) {
            fetchConferenceDetail(id);
        }
    }, [id, selectedConference, fetchConferenceDetail]);

    useEffect(() => {
        if (selectedConference?.conferenceId) {
            getConferenceTopicsByConferenceId(selectedConference.conferenceId)
                .then((res) => setTopics(res))
                .catch(() => setTopics([]));
        }
    }, [selectedConference]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            !file ||
            !title ||
            !abstract ||
            !keywords ||
            !topic ||
            !selectedConference?.conferenceId ||
            authorIds.length === 0
        ) {
            setMessageType("error");
            setMessage("Please fill in all required fields and select a file.");
            setTimeout(() => setMessage(""), 3000);
            return;
        }
        const formData = new FormData();
        formData.append("ConferenceId", selectedConference.conferenceId);
        formData.append("Title", title);
        formData.append("Abstract", abstract);
        formData.append("Keywords", keywords);
        formData.append("TopicId", topic);
        authorIds.forEach(id => formData.append("AuthorIds", id));
        formData.append("pdfFile", file);

        try {
            await uploadPaperPdf(formData);
            setMessageType("success");
            setMessage("Paper submitted successfully!");
            setHighlightedUrl(""); // reset khi submit paper
        } catch (error) {
            setMessageType("error");
            setMessage("Failed to submit paper.");
            console.error(error);
        }
        setTimeout(() => setMessage(""), 3000);
    };

const handleSpellCheck = async () => {
  console.log("👉 Spell check button clicked");

  if (!file) {
    setMessageType("error");
    setMessage("Please upload a file before checking spelling.");
    setTimeout(() => setMessage(""), 3000);
    return;
  }

  setIsChecking(true); // 👈 Bắt đầu check

  try {
    const res = await uploadAndSpellCheck(file);

    console.log("Spell check response:", res);

    if (res.highlightedFileUrl) {
      setHighlightedUrl(res.highlightedFileUrl);
      setMessageType("success");
      setMessage("Spell check completed. Download highlighted PDF below.");
    } else {
      setMessageType("error");
      setMessage("No highlighted PDF returned from server.");
    }
  } catch (error) {
    console.error("❌ Spell check error:", error);
    setMessageType("error");
    setMessage("Spell check failed.");
  } finally {
    setIsChecking(false); 
  }

  setTimeout(() => setMessage(""), 3000);
};



    return (
        <section className="py-20 min-h-[80vh] bg-gray-50 relative">
            <div className="container mx-auto px-4">
                <div className="flex justify-center">
                    <div className="w-full max-w-2xl">
                        <div className="grid gap-4 mb-8 text-center">
                            <h2 className="text-3xl font-bold text-blue-700 mb-2">Submit Your Paper</h2>
                            <p className="text-gray-600">
                                Please read the submission rules carefully before uploading your paper.
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6 mb-6">
                            <ul className="list-disc pl-5 text-gray-700 text-left space-y-2">
                                {rules.map((rule, idx) => (
                                    <li key={idx}>{rule}</li>
                                ))}
                            </ul>
                        </div>
                        <form onSubmit={handleSubmit} className="grid gap-4">
                            <div>
                                <label htmlFor="title" className="font-semibold mb-2 block">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="abstract" className="font-semibold mb-2 block">
                                    Abstract
                                </label>
                                <input
                                    type="text"
                                    id="abstract"
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    value={abstract}
                                    onChange={e => setAbstract(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="topic" className="font-semibold mb-2 block">
                                    Topic
                                </label>
                                <select
                                    id="topic"
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    value={topic}
                                    onChange={e => setTopic(e.target.value)}
                                    required
                                >
                                    <option value="">Select topic</option>
                                    {topics.map((t) => (
                                        <option key={t.topicId} value={t.topicId}>{t.topicName}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="keywords" className="font-semibold mb-2 block">
                                    Keywords
                                </label>
                                <input
                                    type="text"
                                    id="keywords"
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    value={keywords}
                                    onChange={e => setKeywords(e.target.value)}
                                    maxLength={500}
                                    placeholder="Enter keywords separated by commas"
                                />
                            </div>
                            <div>
                                <label htmlFor="paperFile" className="font-semibold mb-2 block">
                                    Upload Paper (PDF only, max 30MB)
                                </label>
                                <input
                                    type="file"
                                    id="paperFile"
                                    accept=".pdf"
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    onChange={handleFileChange}
                                    required
                                />
                                {file && (
                                    <div className="mt-2 text-gray-600 text-sm">
                                        Selected file: <strong>{file.name}</strong>
                                    </div>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-4 mt-4">
                                <Buttonsubmit />
                               <button
                                    type="button"
                                    onClick={handleSpellCheck}
                                    disabled={isChecking}
                                    className={`btn-spell-check ${isChecking ? "opacity-50 cursor-not-allowed" : ""}`}
                                    >
                                    {isChecking ? "Checking..." : "Check Spelling"}
                                    </button>

                            </div>
                        </form>

                        {/* Highlighted PDF link */}
                        {highlightedUrl && (
                            <div className="spell-check-link">
                                <a href={highlightedUrl} target="_blank" rel="noopener noreferrer">
                                    📑 Download Spell-Checked PDF
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {message && (
                <div
                    className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg text-center max-w-xs z-50
                        ${messageType === "success"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                >
                    {message}
                </div>
            )}
        </section>
    );
};

export default SubmitPapers;
