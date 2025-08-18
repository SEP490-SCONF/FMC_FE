import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useNotificationSignalR } from "../../hooks/useNotificationSignalR";
import { getNotificationsByUserId } from "../../services/NotificationService";
import NotificationDropdown from "./NotificationDropdown";
import UserDropdown from "./UserDropdown";
import fptLogo from "../../assets/images/fptlogo.png"; // Đường dẫn tùy vị trí file ảnh

const MainHeader = ({ onClick, onToggle }) => {
  const { user } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [popup, setPopup] = useState(null);

  // In ra userId để test
  useEffect(() => {
    console.log("Current userId:", user?.userId);
  }, [user?.userId]);

  // Lấy thông báo ban đầu
  useEffect(() => {
    if (user?.userId) {
      getNotificationsByUserId(user.userId)
        .then(setNotifications)
        .catch(() => setNotifications([]));
    }
  }, [user?.userId]);

  // Lắng nghe SignalR
  useNotificationSignalR(user?.userId, (title, content) => {
    setPopup({ title, content });
    console.log("Received notification:", title, content);
    getNotificationsByUserId(user.userId).then(setNotifications);

    // Tự động tắt popup sau 5 giây
    setTimeout(() => setPopup(null), 5000);
  });

  const [isApplicationMenuOpen, setApplicationMenuOpen] = React.useState(false);

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  return (
    <header className="sticky top-0 w-full h-26 bg-white border-b border-gray-200 z-50 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between px-23 py-3">
        {/* Left: Logo + Search */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 overflow-hidden">
            <img
              className="max-h-23 max-w-24 w-auto object-contain dark:hidden"
              src={fptLogo}
              alt="Logo"
            />
          </Link>
          {/* Primary Navigation Menu */}
        <nav className="flex-1 flex gap-8 items-center justify-center">
          <Link
            to="/conferences"
            className="text-gray-700 font-semibold hover:text-blue-700 transition uppercase"
          >
            Conferences
          </Link>
          <Link
            to="/submit-paper"
            className="text-gray-700 font-semibold hover:text-blue-700 transition uppercase"
          >
            Submit Paper
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
          <Link
            to="/contact"
            className="text-gray-700 font-semibold hover:text-blue-700 transition uppercase"
          >
            Contact
          </Link>
        </nav>
        </div>
        
        {/* Right: Actions */}
        <div className="flex items-center gap-3 ml-4">
          {/* Nút dark mode nếu có */}
          {/* <ThemeToggleButton /> */}
          {user ? (
            <>
              <NotificationDropdown notifications={notifications} />
              <UserDropdown user={user} />
              {popup && (
                <div className="fixed bottom-6 right-6 z-50 px-6 py-3 rounded-lg shadow-lg bg-blue-100 text-blue-700 border border-blue-300 font-semibold animate-fade-in">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-bold">{popup.title}</div>
                      <div>{popup.content}</div>
                    </div>
                    <button
                      className="ml-4 text-lg font-bold text-gray-400 hover:text-gray-700"
                      onClick={() => setPopup(null)}
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <Link
              to="/login"
              className="px-6 py-4 rounded bg-brand-500 text-white font-medium hover:bg-brand-600 transition"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default MainHeader;
