import React, { useState } from "react";
import "../../assets/styles/pages/_section.scss";
import Buttonsubmit from "../ui/Button";

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
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!file) {
            alert("Please select a file to submit.");
            return;
        }
        // Handle file upload logic here (e.g., send to backend)
        alert(`File "${file.name}" submitted!`);
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
                                <label htmlFor="paperFile" className="fw-semibold mb-2 d-block">
                                    Upload Paper (PDF, DOC, DOCX)
                                </label>
                                <input
                                    type="file"
                                    id="paperFile"
                                    accept=".pdf,.doc,.docx"
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