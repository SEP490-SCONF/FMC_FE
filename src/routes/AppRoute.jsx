import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import CommitteeList from "../pages/CommitteeList";
import CallForPaper from "../pages/CallForPaper";
import PaperSubmition from "../pages/author/PaperSubmition";
import UserP from "../pages/User";
import Screen from "../pages/Screen";
import Login from "../pages/Login";
import ScrollToTop from "../components/common/ScrollToTop";
import SubOrganizer from "../pages/organizer/SubmittedPaper";
import ResultPaper from "../pages/author/ResultPaper";
import PaperPay from "../pages/author/Payment";
import PaperReview from "../pages/PaperReview";
import ConferenceLayout from "../layouts/ConferenceLayout";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Screen  />} />
          <Route path="/login" element={<Login />} />
          <Route path="user" element={<UserP />} />
        </Route>

        <Route element={<ConferenceLayout />}>
          <Route path="/conference/:id" element={<Home />} />
          <Route path="committee" element={<CommitteeList />} />
          <Route path="call-for-paper" element={<CallForPaper />} />
          <Route path="paper-submition" element={<PaperSubmition />} />
         
          <Route path="screen" element={<Screen />} />
          <Route path="paper-review" element={<PaperReview />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
