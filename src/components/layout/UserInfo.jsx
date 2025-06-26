import React from "react";
import "../../assets/styles/pages/_section.scss";

const UserInfo = ({ user }) => {
    return (
        <div className="d-flex flex-column align-items-center min-vh-100 bg-n1">
            {/* Cover Photo + Title */}
            <div
                className="w-100 d-flex flex-column align-items-center justify-content-end"
                style={{
                    background: "#23272b",
                    height: 260,
                    position: "relative",
                }}
            >
                {/* Title */}
                <div
                    className="fw-bold text-uppercase position-absolute"
                    style={{
                        color: "#fff",
                        fontSize: 32,
                        letterSpacing: 2,
                        top: 80,
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 2,
                    }}
                >
                    User Information
                </div>

                {/* Avatar */}
                <div
                    style={{
                        position: "absolute",
                        bottom: -70,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 140,
                        height: 140,
                        borderRadius: "50%",
                        border: "6px solid #23272b",
                        background: "#fff",
                        overflow: "hidden",
                        zIndex: 3,
                    }}
                >
                    <img
                        src={user.avatarUrl || "https://bootdey.com/img/Content/avatar/avatar7.png"}
                        alt={user.name}
                        width="140"
                        height="140"
                        style={{ objectFit: "cover" }}
                    />
                </div>
            </div>

            {/* Main Info */}
            <div
                className="text-center"
                style={{
                    marginTop: 120, // đẩy phần nội dung xuống dưới avatar
                    padding: "0 1rem",
                    maxWidth: 500,
                    width: "100%",
                }}
            >
                <h2
                    className="fw-bold mb-2"
                    style={{
                        fontSize: 36,
                        color: "var(--n2)",
                    }}
                >
                    {user.name}
                </h2>

                <div
                    className="mb-2"
                    style={{ color: "var(--n2-2nd-color)", fontSize: 18 }}
                >
                    Tham gia{" "}
                    {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("vi-VN", {
                            month: "long",
                            year: "numeric",
                        })
                        : ""}
                </div>

                <div className="mb-3">
                    <span
                        className="badge p1-bg-color n1-color px-3 py-1 rounded-pill"
                        style={{ fontSize: 16 }}
                    >
                        {user.roleName || "No Role"}
                    </span>
                </div>

                <button
                    className="btn btn-outline-light px-4 py-2 rounded-pill border-color"
                    style={{
                        fontSize: 18,
                        borderWidth: 2,
                        color: "var(--n2)",
                    }}
                >
                    Thiết lập hồ sơ
                </button>
            </div>
        </div>
    );
};

export default UserInfo;
