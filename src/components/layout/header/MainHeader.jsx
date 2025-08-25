import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../../context/UserContext";
import { useNotificationSignalR } from "../../../hooks/useNotificationSignalR";
import { getNotificationsByUserId } from "../../../services/NotificationService";
import NotificationDropdown from "./NotificationDropdown";
import UserDropdown from "./UserDropdown";
import fptLogo from "../../../assets/images/fptlogo.png";
import { toast } from "react-toastify";

const MainHeader = ({ onClick, onToggle }) => {
  const { user } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    if (user?.userId) {
      getNotificationsByUserId(user.userId)
        .then(setNotifications)
        .catch(() => setNotifications([]));
    }
  }, [user?.userId]);

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

  return (
    <header className="sticky top-0 w-full bg-white border-b border-gray-200 z-50 dark:border-gray-800 dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between h-20">
        {/* Left: Logo */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex-shrink-0 overflow-hidden">
            <img
              className="max-h-12 w-auto object-contain dark:hidden"
              src={fptLogo}
              alt="Logo"
            />
          </Link>
          <span className="font-bold text-xl text-gray-800 dark:text-gray-100 hidden md:inline-block">
            FPT Conferences
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 gap-10 items-center justify-center">
          <Link
            to="/conferences"
            className="text-gray-700 font-semibold hover:text-blue-700 transition uppercase"
          >
            Conferences
          </Link>
          <Link
            to="/proceedings"
            className="text-gray-700 font-semibold hover:text-blue-700 transition uppercase"
          >
            Proceedings / Papers
          </Link>
          <Link
            to="/about"
            className="text-gray-700 font-semibold hover:text-blue-700 transition uppercase"
          >
            About Us
          </Link>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <NotificationDropdown notifications={notifications} />
              <UserDropdown user={user} />
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded bg-brand-500 text-white font-medium hover:bg-brand-600 transition"
            >
              Sign In
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={toggleApplicationMenu}
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
      </div>

      {/* Mobile Navigation */}
      {isApplicationMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 space-y-4">
          <Link
            to="/conferences"
            className="block text-gray-700 font-semibold hover:text-blue-700 transition uppercase"
            onClick={toggleApplicationMenu}
          >
            Conferences
          </Link>
          <Link
            to="/submit-paper"
            className="block text-gray-700 font-semibold hover:text-blue-700 transition uppercase"
            onClick={toggleApplicationMenu}
          >
            Submit Paper
          </Link>
          <Link
            to="/proceedings"
            className="block text-gray-700 font-semibold hover:text-blue-700 transition uppercase"
            onClick={toggleApplicationMenu}
          >
            Proceedings / Papers
          </Link>
          <Link
            to="/about"
            className="block text-gray-700 font-semibold hover:text-blue-700 transition uppercase"
            onClick={toggleApplicationMenu}
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className="block text-gray-700 font-semibold hover:text-blue-700 transition uppercase"
            onClick={toggleApplicationMenu}
          >
            Contact
          </Link>
        </div>
      )}
    </header>
  );
};

export default MainHeader;
