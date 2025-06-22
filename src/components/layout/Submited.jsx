import React from "react";

const submissions = [
    {
        title: "AI",
        abstract: "Work",
        file: "AI.PDF",
        topic: "AI",
        reviewer: "Waiting for assignment",
        status: "Submitted",
        option: "View",
        time: "30/05/2025 11:10 AM"
    },
    {
        title: "AI Alpha",
        abstract: "Alpha",
        file: "AIAlpha.PDF",
        topic: "AI",
        reviewer: "Done",
        status: "Need Revision",
        option: "View",
        time: "30/05/2025 11:10 AM"
    }
];

const Submited = () => (
    <div style={{ background: "#fff", minHeight: "100vh", padding: "0 0 40px 0" }}>
        <div style={{ borderBottom: "1px solid #222", padding: "16px 0 8px 0", textAlign: "center" }}>
            <h2 style={{ margin: 0, fontWeight: 600 }}>AI Conference</h2>
        </div>
        <div style={{ maxWidth: 1200, margin: "32px auto 0 auto", background: "#fff" }}>
            <h5 style={{ margin: "24px 0 12px 0", fontWeight: 500 }}>History Submission</h5>
            <div style={{ overflowX: "auto" }}>
                <table style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 16,
                    background: "#fff"
                }}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Title</th>
                            <th style={thStyle}>Abstract</th>
                            <th style={thStyle}>File PDF for submit</th>
                            <th style={thStyle}>Topic</th>
                            <th style={thStyle}>Reviewer</th>
                            <th style={thStyle}>Status</th>
                            <th style={thStyle}>Option</th>
                            <th style={thStyle}>Last time submitted</th>
                        </tr>
                    </thead>
                    <tbody>
                        {submissions.map((s, idx) => (
                            <tr key={idx}>
                                <td style={tdStyle}>{s.title}</td>
                                <td style={tdStyle}>{s.abstract}</td>
                                <td style={tdStyle}>{s.file}</td>
                                <td style={tdStyle}>{s.topic}</td>
                                <td style={tdStyle}>{s.reviewer}</td>
                                <td style={tdStyle}>{s.status}</td>
                                <td style={tdStyle}>
                                    <a href="#" style={{ color: "#1976d2", textDecoration: "underline" }}>{s.option}</a>
                                </td>
                                <td style={tdStyle}>{s.time}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

const thStyle = {
    border: "1px solid #222",
    padding: "8px 10px",
    fontWeight: 600,
    background: "#fff"
};

const tdStyle = {
    border: "1px solid #222",
    padding: "8px 10px",
    textAlign: "center",
    background: "#fff"
};

export default Submited;