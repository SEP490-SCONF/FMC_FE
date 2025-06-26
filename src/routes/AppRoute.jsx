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


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<UserP />} />
          <Route path="committee" element={<CommitteeList />} />
          <Route path="call-for-paper" element={<CallForPaper />} />
          <Route path="paper-submition" element={<PaperSubmition />} />
          {/* <Route path="user" element={<UserP />} /> */}
          <Route path="screen" element={<Screen />} />
          <Route path="paper-review" element={<PaperReview />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="*" element={<PaperPay />} /> */}
          {/* <Route path="organizer/submitted-paper" element={<SubOrganizer />} /> */}
          <Route path="404 " element={<h1 className="text-center text-2xl">404 Not Found</h1>} />
          {/* <Route path="*" element={<ResultPaper />} /> */}
        </Route>

      </Routes>
    </BrowserRouter>
  );
}