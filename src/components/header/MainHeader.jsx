import React from "react";
import { Link } from "react-router-dom";
import NotificationDropdown from "./NotificationDropdown";
import UserDropdown from "./UserDropdown";
import { useUser } from "../../context/UserContext";
import fptLogo from "../../assets/images/fptlogo.png"; // Đường dẫn tùy vị trí file ảnh

const MainHeader = ({ onClick, onToggle }) => {
  const { user } = useUser();
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
            className="font-medium text-gray-700 hover:text-red-700 transition text-lg"
          >
            Conferences / Events
          </Link>
          <Link
            to="/submit-paper"
            className="font-medium text-gray-700 hover:text-red-700 transition text-lg"
          >
            Submit Paper
          </Link>
          <Link
            to="/proceedings"
            className="font-medium text-gray-700 hover:text-red-700 transition text-lg"
          >
            Proceedings / Papers
          </Link>
          
          <Link
            to="/about"
            className="font-medium text-gray-700 hover:text-red-700 transition text-lg"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className="font-medium text-gray-700 hover:text-red-700 transition text-lg"
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
              <NotificationDropdown />
              <UserDropdown user={user} />
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
