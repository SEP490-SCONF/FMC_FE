import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import AppRoutes from "./routes/AppRoute.jsx";
import { UserProvider } from "./context/UserContext"; 

import "./index.css";
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  </StrictMode>,
)