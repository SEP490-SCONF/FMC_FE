import React, { useState, useEffect } from "react";
import "../../assets/styles/pages/_section.scss";
import Buttonsubmit from "../ui/button/Button";
import { useConference } from "../../context/ConferenceContext";
import { getConferenceTopicsByConferenceId } from "../../service/ConferenceTopicService";
import { useParams } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { uploadPaperPdf } from "../../Service/PaperSerice";

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
    const { user } = useUser(); // Lấy user từ context
    const { id } = useParams();
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    const [abstract, setAbstract] = useState("");
    const [keywords, setKeywords] = useState("");
    const [topic, setTopic] = useState("");
    const [topics, setTopics] = useState([]);
    // Mặc định chọn chính user hiện tại làm tác giả
    const [authorIds, setAuthorIds] = useState(user ? [user.userId] : []);

    // Chỉ lấy user hiện tại làm tác giả
    const authors = user ? [{ id: user.userId, name: user.name }] : [];

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

    const handleAuthorChange = (e) => {
        const options = Array.from(e.target.selectedOptions, option => Number(option.value));
        setAuthorIds(options);
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
            console.log({
                file,
                title,
                abstract,
                keywords,
                topic,
                conferenceId: selectedConference?.conferenceId,
                authorIds
            });
            alert("Please fill in all required fields and select a file.");
            return;
        }
        // Tạo formData để gửi lên server
        const formData = new FormData();
        formData.append("ConferenceId", selectedConference.conferenceId);
        formData.append("Title", title);
        formData.append("Abstract", abstract);
        formData.append("Keywords", keywords);
        formData.append("TopicId", topic);
        authorIds.forEach(id => formData.append("AuthorIds", id));
        formData.append("PdfFile", file);

        try {
            const res = await uploadPaperPdf(formData);
            alert("Paper submitted successfully!");
            // Reset form nếu cần
        } catch (error) {
            alert("Failed to submit paper.");
            console.error(error);
        }
    };

    return (
        <section className="pt-120 pb-120 n1-bg-color">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-7">
                        <div className="section-area d-grid gap-3 gap-md-4 mb-6">
                            <h2 className="fs-two fw-bold p7-color mb-2">Submit Your Paper</h2>
                            <p className="n3-color fs-seven">
                                Please read the submission rules carefully before uploading your paper.
                            </p>
                        </div>
                        <div className="box-style second-alt alt-two p-5 mb-6">
                            <ul className="cfp-rules-list" style={{ textAlign: "left", marginLeft: 0 }}>
                                {rules.map((rule, idx) => (
                                    <li key={idx} className="mb-2">{rule}</li>
                                ))}
                            </ul>
                        </div>
                        <form onSubmit={handleSubmit} className="d-grid gap-4">
                            <div className="mb-3">
                                <label htmlFor="title" className="fw-semibold mb-2 d-block">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    className="form-control"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="abstract" className="fw-semibold mb-2 d-block">
                                    Abstract
                                </label>
                                <input
                                    type="text"
                                    id="abstract"
                                    className="form-control"
                                    value={abstract}
                                    onChange={e => setAbstract(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="topic" className="fw-semibold mb-2 d-block">
                                    Topic
                                </label>
                                <select
                                    id="topic"
                                    className="form-control"
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
                            <div className="mb-3">
                                <label htmlFor="keywords" className="fw-semibold mb-2 d-block">
                                    Keywords
                                </label>
                                <input
                                    type="text"
                                    id="keywords"
                                    className="form-control"
                                    value={keywords}
                                    onChange={e => setKeywords(e.target.value)}
                                    maxLength={500}
                                    placeholder="Enter keywords separated by commas"
                                />
                            </div>
                            {/* Ẩn phần chọn tác giả, chỉ lấy user hiện tại */}
                            {/* 
                            <div className="mb-3">
                                <label htmlFor="authors" className="fw-semibold mb-2 d-block">
                                    Authors
                                </label>
                                <select
                                    id="authors"
                                    className="form-control"
                                    multiple
                                    value={authorIds}
                                    onChange={handleAuthorChange}
                                    required
                                >
                                    {authors.map(a => (
                                        <option key={a.id} value={a.id}>{a.name}</option>
                                    ))}
                                </select>
                                <small className="text-muted">Hold Ctrl (Windows) hoặc Cmd (Mac) để chọn nhiều tác giả.</small>
                            </div>
                            */}
                            <div className="mb-3">
                                <label htmlFor="paperFile" className="fw-semibold mb-2 d-block">
                                    Upload Paper (PDF only, max 30MB)
                                </label>
                                <input
                                    type="file"
                                    id="paperFile"
                                    accept=".pdf"
                                    className="form-control"
                                    onChange={handleFileChange}
                                    required
                                />
                                {file && (
                                    <div className="mt-2 n3-color fs-eight">
                                        Selected file: <strong>{file.name}</strong>
                                    </div>
                                )}
                            </div>
                            <Buttonsubmit />
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SubmitPapers;