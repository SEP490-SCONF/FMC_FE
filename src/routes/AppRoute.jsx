import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "../App";
import Home from "../pages/conference/Home";
import CommitteeList from "../pages/conference/CommitteeList";
import CallForPaper from "../pages/conference/CallForPaper";
import PaperSubmition from "../pages/author/PaperSubmition";
import UserP from "../pages/User/UserProfile";
import Login from "../pages/auth/Login";
import ScrollToTop from "../components/common/ScrollToTop";
import SubOrganizer from "../pages/organizer/SubmittedPaper";
import PaperReview from "../pages/reviewer/PaperReview";
import ConferenceLayout from "../layouts/ConferenceLayout";
import PaperAss from "../pages/reviewer/PaperAss";
import OrganizerView from "../pages/organizer/OrganizerView";
import ManageConferenceLayout from "../layouts/ManageConferenceLayout";
import SubmittedOrga from "../components/paper/OrganizerSubmittedPapers";
import SubmittedPaperAuthor from "../pages/author/Submittedpaper";
import AuthorConference from "../pages/author/AuthorConference";
import EditConferencePage from "../pages/organizer/EditConferencePage";
import ReviewerListPage from "../pages/organizer/ReviewerListPage";
import PublishedPaperList from "../pages/organizer/PublishedPaperList";
import ManageCallForPaper from "../pages/organizer/ManageCallForPaper";
import ManageTimeline from "../pages/organizer/ManageTimeline"; 



import NotFoundPage from "../pages/otherpages/NotFoundPage";
import ForbiddenPage from "../pages/otherpages/ForbiddenPage";

import About from "../pages/User/AboutUs";
import ViewPaperReview from "../pages/author/ViewPaperReview"; // Thêm import ở đầu file
import MainHomePage from "../pages/User/MainHomePage";
import ConferenceSearch from "../pages/User/ConferenceSearch"; // Import ConferenceSearch component
import CommitteeForm from "../pages/conference/CommitteeForm";
import ViewCertificate from "../pages/author/ViewCertificate";




export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<MainHomePage />} />
          <Route path="/committee-form" element={<CommitteeForm />} />
          <Route path="/forbidden" element={<ForbiddenPage />} />
          <Route path="/not-found" element={<NotFoundPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/conferences" element={<ConferenceSearch />} />
          <Route path="user" element={<UserP />} />
          <Route path="/reviewer/assigned-papers" element={<PaperAss />} />
          <Route path="/review/paper/:assignmentId" element={<PaperReview />} />
          <Route path="/manage-conference" element={<OrganizerView />} />
          <Route
            path="/author/conference/:conferenceId/submittedPaper"
            element={<SubmittedPaperAuthor />}
          />
          <Route path="/author/conference" element={<AuthorConference />} />
          <Route path="/author/view-certificates/:paperId" element={<ViewCertificate />} />

          <Route
            path="/author/view-paper-review/:revisionId"
            element={<ViewPaperReview />}
          />{" "}
         <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route element={<ConferenceLayout />}>
         <Route path="*" element={<NotFoundPage />} />
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
          <Route path="/manage-conference/:conferenceId/edit" element={<EditConferencePage />} />
          <Route path="/manage-conference/:conferenceId/reviewers" element={<ReviewerListPage />} />
          <Route path="/manage-conference/:conferenceId/published-papers" element={<PublishedPaperList />}/>
          <Route path="/manage-conference/:conferenceId/call-for-paper" element={<ManageCallForPaper />} />
          <Route path="/manage-conference/:conferenceId/timelines" element={<ManageTimeline />} /> 



          



          



          {/* Thêm các route con khác nếu cần */}
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}
