import React from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import bgImage from "../assets/images/FPTinformationsytem.jpg"; // Make sure this path is correct

const clientId = "170897089182-ki6hqkt96pjabhg2tlqhk27csufvqhq4.apps.googleusercontent.com";

const Login = () => {
    const handleSuccess = async (credentialResponse) => {
        const credential = credentialResponse.credential;
        try {
            // Gửi credential lên backend
            const res = await fetch("https://localhost:7205/api/GoogleLogin/Login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idToken: credential }),
                credentials: "include" // Để nhận cookie HttpOnly từ backend
            });
            if (res.ok) {
                const data = await res.json();
                // Lưu accessToken vào localStorage
                localStorage.setItem("accessToken", data.accessToken);
                // Chuyển hướng hoặc reload
                window.location.href = "/";
            } else {
                console.error("Backend login failed");
            }
        } catch (err) {
            console.error("Error:", err);
        }
    };

    const handleError = () => {
        console.log("Google login failed");
    };

    return (
        <div
            className="login-page d-center"
            style={{
                minHeight: "100vh",
                backgroundImage: `url(${bgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            <div className="login-box p-5 rounded shadow" style={{ background: "#fff" }}>
                <GoogleOAuthProvider clientId={clientId}>
                    <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={handleError}
                        width="100%"
                        shape="rectangular"
                        text="signin_with"
                        theme="filled_blue"
                    />
                </GoogleOAuthProvider>
            </div>
        </div>
    );
};

export default Login;