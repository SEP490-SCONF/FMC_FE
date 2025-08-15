import ConferenceHeader from "../components/layout/ConfereanceHeader";
import Footer from "../components/layout/Footer";
import { Outlet } from "react-router-dom";
import { ConferenceProvider } from "../context/ConferenceContext";

const ConferenceLayout = () => (
  <ConferenceProvider>
    <div>
      <ConferenceHeader />
      <Outlet />
      
    </div>
  </ConferenceProvider>
);

export default ConferenceLayout;