import React from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import bgImage from "../assets/images/tru-so-fpt20250415141843.jpg";

const clientId = "170897089182-ki6hqkt96pjabhg2tlqhk27csufvqhq4.apps.googleusercontent.com";

const Login = () => {
    const handleSuccess = async (credentialResponse) => {
        const credential = credentialResponse.credential;
        console.log('credentialResponse:', credential);
        try {
            const res = await fetch("https://localhost:7166/api/GoogleLogin/Login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idToken: credential }),
                credentials: "include"
            });
            if (res.ok) {
                const data = await res.json();
                localStorage.setItem("accessToken", data.accessToken);
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
            className="login-page flex items-center justify-center min-h-screen"
            style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
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
    );
};

export default Login;
