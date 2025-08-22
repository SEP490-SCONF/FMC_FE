import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import AppRoutes from "./routes/AppRoute.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppRoutes />
    <ToastContainer />
  </StrictMode>
);
