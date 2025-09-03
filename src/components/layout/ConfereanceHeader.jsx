import React, { useEffect, useState } from "react";
import { useConference } from "../../context/ConferenceContext";
import { Link, useParams,useNavigate  } from "react-router-dom";
import fptLogo from "../../assets/images/fptlogo.png";

import UserDropdown from "./header/UserDropdown";
import { useUser } from "../../context/UserContext";
import { useNotificationSignalR } from "../../hooks/useNotificationSignalR";
import { getNotificationsByUserId } from "../../services/NotificationService";
import { getFeesByConferenceId } from "../../services/ConferenceFeesService";
import PayService from "../../services/PayService";
import NotificationDropdown from "./header/NotificationDropdown";
import { toast } from "react-toastify";
import { getUserConferenceRolesByUserId } from "../../services/UserConferenceRoleService";


const Header = () => {
  const { user } = useUser();
  const { selectedConference } = useConference();
  const params = useParams();
  const conferenceId = selectedConference?.conferenceId || params.id;


  const [notifications, setNotifications] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
const [hasRegistered, setHasRegistered] = useState(false);
const [participationFeeDetailId, setParticipationFeeDetailId] = useState(null);
const [isOrganizer, setIsOrganizer] = useState(false);


  const toggleMobileMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  useEffect(() => {
  const checkUserRole = async () => {
    if (!user?.userId || !conferenceId) return;
    try {
      const roles = await getUserConferenceRolesByUserId(user.userId);
      const isOrg = roles?.some(
        (r) =>
          String(r.conferenceId) === String(conferenceId) &&
          r.roleName === "Organizer"
      );
      setIsOrganizer(isOrg);
    } catch (err) {
      console.error("Header: failed to check user role", err);
    }
  };
  checkUserRole();
}, [user?.userId, conferenceId]);


  // Fetch notifications
  useEffect(() => {
    if (user?.userId) {
      getNotificationsByUserId(user.userId)
        .then(setNotifications)
        .catch(() => setNotifications([]));
    }
  }, [user?.userId]);

  // SignalR notification updates
  useNotificationSignalR(user?.userId, (title, content) => {
    toast.info(
      <div>
        <div className="font-bold">{title}</div>
        <div>{content}</div>
      </div>,
      {
        position: "bottom-right",
        autoClose: 5000,
        closeButton: true,
        hideProgressBar: false,
      }
    );
    getNotificationsByUserId(user.userId).then(setNotifications);
  });

  


  // Prefer context id, fallback to URL param

  useEffect(() => {
      const conferenceId = selectedConference?.conferenceId || params.id;

  if (!user?.userId) {
    console.log("Header: user not ready yet");
    return;
  }
  if (!conferenceId) {
    console.log("Header: conferenceId not ready yet");
    return;
  }

  const checkParticipation = async () => {
    console.log("Header: Checking participation...", { userId: user.userId, conferenceId });

    try {
      const fees = await getFeesByConferenceId(conferenceId);
      console.log("Header: Fetched fees:", fees);

      const participationFee = fees.find(f => f.feeTypeId === 2);
      if (!participationFee) {
        console.warn("Header: No Participation fee found");
        setHasRegistered(false);
        return;
      }

      setParticipationFeeDetailId(participationFee.feeDetailId);
      console.log("Header: Participation fee ID:", participationFee.feeDetailId);

      const res = await PayService.hasUserPaidFee(conferenceId, participationFee.feeDetailId);
      const paid = res?.HasPaid ?? res?.hasPaid ?? false;
      console.log("Header: Has user paid?", paid);
console.log("Header: API response", res);

      setHasRegistered(paid);
    } catch (err) {
      console.error("Header: Error checking participation fee:", err);
      setHasRegistered(false);
    }
  };

  checkParticipation();
}, [user?.userId, conferenceId]);



  return (
    <header className="sticky top-0 w-full bg-white border-b border-gray-200 z-50 shadow-sm dark:bg-gray-900 dark:border-gray-800">
      <div className="container-fluid px-4 md:px-6">
        <nav className="flex items-center justify-between py-3">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src={fptLogo}
              alt="FPT Logo"
              className="h-10 w-auto object-contain"
            />
            <span className="font-bold text-xl text-brand-700 hidden md:inline">
              FPT Conference
            </span>
          </Link>

          {/* Center: Navigation (hidden on mobile) */}
          <ul className="hidden md:flex gap-6 items-center">
            <li>
              <Link
                to={conferenceId ? `/conference/${conferenceId}` : "#"}
                className="text-gray-700 font-semibold hover:text-blue-700 transition uppercase"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to={
                  conferenceId ? `/conference/${conferenceId}/committee` : "#"
                }
                className="text-gray-700 font-semibold hover:text-blue-700 transition uppercase"
              >
                Committee
              </Link>
            </li>
            <li>
              <Link
                to={
                  conferenceId
                    ? `/conference/${conferenceId}/call-for-paper`
                    : "#"
                }
                className="text-gray-700 font-semibold hover:text-blue-700 transition uppercase"
              >
                Call for Papers
              </Link>
            </li>
            <li>
              <Link
                to={
                  conferenceId
                    ? `/conference/${conferenceId}/paper-submition`
                    : "#"
                }
                className="text-gray-700 font-semibold hover:text-blue-700 transition uppercase"
              >
                Paper Submission
              </Link>
            </li>
            <li>
              <Link
                to={conferenceId ? `/conference/${conferenceId}/forum` : "#"}
                className="text-gray-700 font-semibold hover:text-blue-700 transition uppercase"
              >
                Forum
              </Link>
            </li>
            <li>
              <Link
                to={conferenceId ? `/conference/${conferenceId}/fees` : "#"}
                className="text-gray-700 font-semibold hover:text-blue-700 transition uppercase"
              >
                Conference Fees
              </Link>
            </li>

            {!isOrganizer && (
  <li>
    <Link
      to={conferenceId ? `/conference/${conferenceId}/register` : "#"}
      className="text-gray-700 font-semibold hover:text-blue-700 transition uppercase"
    >
      Register
    </Link>
  </li>
)}



          </ul>

          {/* Right: User and Notifications */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <NotificationDropdown notifications={notifications} />
                <UserDropdown user={user} />
              </>
            ) : (
              <Link
                to="/login"
                className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded transition"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={toggleMobileMenu}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6 text-gray-700 dark:text-gray-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 space-y-4">
            <Link
              to={conferenceId ? `/conference/${conferenceId}` : "#"}
              onClick={toggleMobileMenu}
              className="block text-gray-700 font-semibold hover:text-blue-700 transition uppercase"
            >
              Home
            </Link>
            <Link
              to={conferenceId ? `/conference/${conferenceId}/committee` : "#"}
              onClick={toggleMobileMenu}
              className="block text-gray-700 font-semibold hover:text-blue-700 transition uppercase"
            >
              Committee
            </Link>
            <Link
              to={
                conferenceId
                  ? `/conference/${conferenceId}/call-for-paper`
                  : "#"
              }
              onClick={toggleMobileMenu}
              className="block text-gray-700 font-semibold hover:text-blue-700 transition uppercase"
            >
              Call for Papers
            </Link>
            <Link
              to={
                conferenceId
                  ? `/conference/${conferenceId}/paper-submition`
                  : "#"
              }
              onClick={toggleMobileMenu}
              className="block text-gray-700 font-semibold hover:text-blue-700 transition uppercase"
            >
              Paper Submission
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
