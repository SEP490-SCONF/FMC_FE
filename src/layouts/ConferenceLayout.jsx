import ConferenceHeader from "../components/layout/ConfereanceHeader";
import Footer from "../components/layout/Footer";
import { Outlet } from "react-router-dom";

const ConferenceLayout = () => (
  <div>
    <ConferenceHeader />
    <Outlet />
    <Footer />
  </div>
);

export default ConferenceLayout;