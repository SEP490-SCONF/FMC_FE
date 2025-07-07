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
import PaperAss from "../pages/reviewer/PaperAss";
import OrganizerView from "../pages/organizer/OrganizerView";
import ManageConferenceLayout from "../layouts/ManageConferenceLayout";
import SubmittedOrga from "../components/layout/SubmittedOrga";
import ConferenceOrganizer from "../components/layout/organizer/ConferenceOrganizer";
import Submitted from "../pages/author/Submittedpaper";
import SubmittedPaperAuthor from "../pages/author/Submittedpaper";
import AuthorConference from "../pages/author/AuthorConference";
import ViewPaperReview from "../pages/author/ViewPaperReview"; // Thêm import ở đầu file

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Screen />} />
          <Route path="/login" element={<Login />} />
          <Route path="user" element={<UserP />} />
          <Route path="/reviewer/assigned-papers" element={<PaperAss />} />
          <Route path="/review/paper/:assignmentId" element={<PaperReview />} />
          <Route path="/manage-conference" element={<OrganizerView />} />
          <Route
            path="/author/conference/:conferenceId/submittedPaper"
            element={<SubmittedPaperAuthor />}
          />
          <Route path="/author/conference" element={<AuthorConference />} />
          <Route
            path="/author/view-paper-review/:revisionId"
            element={<ViewPaperReview />}
          />{" "}
          {/* Thêm dòng này */}
        </Route>

        <Route element={<ConferenceLayout />}>
          <Route path="/conference/:id" element={<Home />} />
          <Route path="/conference/:id/committee" element={<CommitteeList />} />
          <Route
            path="/conference/:id/call-for-paper"
            element={<CallForPaper />}
          />
          <Route
            path="/conference/:id/paper-submition"
            element={<PaperSubmition />}
          />
          <Route
            path="/conference/:id/paper-review"
            element={<PaperReview />}
          />
          <Route
            path="/conference/:id/submitted-papers"
            element={<SubmittedOrga />}
          />
        </Route>
        <Route element={<ManageConferenceLayout />}>
          <Route
            path="/manage-conference/:id/submitted-papers"
            element={<SubOrganizer />}
          />
          <Route
            path="/manage-conference/:conferenceId"
            element={<ConferenceOrganizer />}
          />

          {/* Thêm các route con khác nếu cần */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
