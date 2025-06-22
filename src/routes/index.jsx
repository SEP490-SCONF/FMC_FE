import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import CommitteeList from "../pages/CommitteeList";
import CallForPaper from "../pages/CallForPaper";
import PaperSubmition from "../pages/PaperSubmition";
import UserP from "../pages/User";
import Screen from "../pages/Screen";
import Login from "../pages/Login"; 
import ScrollToTop from "../components/common/ScrollToTop";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="committee" element={<CommitteeList />} />
          <Route path="call-for-paper" element={<CallForPaper />} />
          <Route path="paper-submition" element={<PaperSubmition />} />
          <Route path="user" element={<UserP />} />
          <Route path="screen" element={<Screen />} />
          <Route path="/login" element={<Login />} />
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}