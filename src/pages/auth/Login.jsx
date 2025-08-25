import React, { useEffect } from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import bgImage from "../../assets/images/tru-so-fpt20250415141843.jpg";
import { loginWithGoogle } from "../../services/AuthenService";
import { useAuth } from "../../context/AuthContext";
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const Login = () => {
  const { login } = useAuth();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      login(accessToken);
    }
  }, [login]);
  const handleSuccess = async (credentialResponse) => {
    const credential = credentialResponse.credential;

    try {
      const data = await loginWithGoogle(credential);
      login(data.accessToken, data.expiresAt);

    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleError = () => {
    // console.log("Google login failed");
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
      <div className="flex items-center justify-center h-screen">
        <div
          className="login-box p-5 rounded shadow"
          style={{ background: "#fff" }}
        >
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
    </div>
  );
};

export default Login;
