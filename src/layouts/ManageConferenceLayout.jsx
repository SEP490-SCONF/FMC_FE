import ConferenceHeader from "../components/layout/ConfereanceHeader";
import Footer from "../components/layout/Footer";
import ManageConferenceSidebar from "../components/manage/ManageConferenceSidebar";
import { Outlet } from "react-router-dom";
import { ConferenceProvider } from "../context/ConferenceContext";
import MainHeader from "../components/header/MainHeader";
export default function ManageConferenceLayout() {
  return (
    <ConferenceProvider>
      <div className="min-h-screen flex flex-col">
        <MainHeader />
        <div className="flex flex-1 h-full">
          <ManageConferenceSidebar className="h-full" />
          <main className="flex-1  h-full">
            <Outlet />
          </main>
        </div>
        <Footer />
      </div>
    </ConferenceProvider>
  );
}