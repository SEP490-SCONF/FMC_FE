import React from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import bgImage from "../assets/images/tru-so-fpt20250415141843.jpg"; // Make sure this path is correct

const clientId = "YOUR_GOOGLE_CLIENT_ID"; // Replace with your Google OAuth client ID

const Login = () => {
    const handleSuccess = async (credentialResponse) => {
        const credential = credentialResponse.credential;
        try {
            // Send the credential to your .NET backend
            const res = await fetch("https://your-backend-url/api/auth/google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: credential }),
            });
            if (res.ok) {
                const data = await res.json();
                // Save JWT/token, redirect, etc.
                console.log("Backend login success:", data);
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