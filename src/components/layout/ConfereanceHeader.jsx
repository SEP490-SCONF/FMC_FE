import React from "react";
import { useConference } from "../../context/ConferenceContext";
import { Link, useParams } from "react-router-dom";
import fptLogo from "../../assets/images/fptlogo.png";
import "../../assets/css/style.min.css";
import UserDropdown from "../header/UserDropdown";
import { useUser } from "../../context/UserContext";

const Header = () => {
  const { user } = useUser();
  const { selectedConference } = useConference();
  const params = useParams();

  // Prefer context id, fallback to URL param
  const conferenceId = selectedConference?.conferenceId || params.id;

  return (
    <header className="sticky top-0 w-full bg-white border-b border-gray-200 z-50 shadow-sm">
      <div className="container-fluid px-23 py-3">
        <nav className="flex items-center justify-between py-3">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src={fptLogo}
              alt="FPT Logo"
              className="h-10 w-auto object-contain"
              style={{ maxHeight: 40 }}
            />
            <span className="font-bold text-xl text-brand-700 hidden md:inline">
              FPT Conference
            </span>
          </Link>
          {/* Center: Navigation */}
          <ul className="flex gap-6 items-center">
            <li>
              <Link
                to="/"
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
                CALL FOR PAPERS
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
                to={
                  conferenceId
                    ? `/conference/${conferenceId}/forum`
                    : "#"
                }
                className="text-gray-700 font-semibold hover:text-blue-700 transition uppercase"
              >
                Forum
              </Link>
            </li>
          </ul>
          {/* Right: User/Login */}
          <div>
            {user ? (
              <UserDropdown user={user} />
            ) : (
              <Link
                to="/login"
                className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-5 rounded transition"
              >
                Sign In
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
