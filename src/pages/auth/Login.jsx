import React from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import bgImage from "../../assets/images/tru-so-fpt20250415141843.jpg";
import { loginWithGoogle } from "../../services/AuthenService";

const clientId = "170897089182-ki6hqkt96pjabhg2tlqhk27csufvqhq4.apps.googleusercontent.com";

const Login = () => {
  const handleSuccess = async (credentialResponse) => {
    const credential = credentialResponse.credential;
    console.log("credentialResponse:", credential);
    try {
      const data = await loginWithGoogle(credential);
      // Lưu accessToken đã được thực hiện trong AuthenService
      window.location.href = "/";
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
