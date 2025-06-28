import React, { useEffect, useState } from "react";
import { useConference } from "../../context/ConferenceContext";
import { Link, useParams } from "react-router-dom";

import favLogo from "../../assets/images/fav-2.png";
import logoText from "../../assets/images/logo-text.png";
import "../../assets/css/style.min.css";
import UserDropdown from "../header/UserDropdown";
import { useUser } from "../../context/UserContext";

const Header = () => {
  const { user } = useUser();
  const { selectedConference } = useConference();
  const params = useParams();

  // Ưu tiên lấy id từ context, nếu không có thì lấy từ URL
  const conferenceId = selectedConference?.conferenceId || params.id;

  return (
    <header className="header-section index-two n1-bg-color py-4 px-2 px-md-6">
      <div className="container-fluid">
        <div className="main-navbar px-0 px-xl-8">
          <nav className="navbar-custom">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex gap-6">
                <button
                  className="navbar-toggle-btn d-block d-lg-none"
                  type="button"
                >
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </button>
              </div>
            </div>
            <div className="navbar-toggle-item">
              <div className="d-flex gap-5 flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between mt-5 mt-lg-0">
                {/* Logo lớn chuyển sang Link */}
                <Link
                  to="/"
                  className="navbar-brand logo d-none d-lg-flex d-xl-flex d-lg-flex gap-2 align-items-center"
                >
                  <img src={favLogo} alt="logo" />
                  <img
                    src={logoText}
                    className="d-none d-md-none d-xl-flex"
                    alt="logo"
                  />
                </Link>
                <ul className="custom-nav third d-lg-flex d-grid gap-3 gap-lg-4">
                  {/* HOME */}
                  <li className="menu-item position-relative menu-link">
                    <Link
                      to="/"
                      className="position-relative pe-5 z-1 slide-third text-uppercase slide-vertical menu-link"
                      data-splitting
                    >
                      HOME
                      <span className="dropdown-arrow ms-2"></span>
                    </Link>
                  </li>
                  {/* COMMITTEE */}
                  <li className="menu-item position-relative menu-link">
                    <Link
                      to={conferenceId ? `/conference/${conferenceId}/committee` : "#"}
                      className="position-relative pe-5 z-1 slide-third text-uppercase slide-vertical menu-link"
                      data-splitting
                    >
                      COMMITTEE
                      <span className="dropdown-arrow ms-2"></span>
                    </Link>
                  </li>
                  {/* CFP */}
                  <li className="menu-item position-relative menu-link">
                    <Link
                      to={conferenceId ? `/conference/${conferenceId}/call-for-paper` : "#"}
                      className="position-relative pe-5 z-1 slide-third text-uppercase slide-vertical menu-link"
                      data-splitting
                    >
                      CFP
                      <span className="dropdown-arrow ms-2"></span>
                    </Link>
                  </li>
                  {/* PAPER REVIEW */}
                  <li className="menu-item position-relative menu-link">
                    <Link
                      to={conferenceId ? `/conference/${conferenceId}/paper-review` : "#"}
                      className="position-relative pe-5 z-1 slide-third text-uppercase slide-vertical menu-link"
                      data-splitting
                    >
                      PAPER REVIEW
                      <span className="dropdown-arrow ms-2"></span>
                    </Link>
                  </li>
                  {/* SUBMITTED PAPERS - Mới thêm vào */}
                  <li className="menu-item position-relative menu-link">
                    <Link
                      to={conferenceId ? `/conference/${conferenceId}/submitted-papers` : "#"}
                      className="position-relative pe-5 z-1 slide-third text-uppercase slide-vertical menu-link"
                      data-splitting
                    >
                      SUBMITTED PAPERS
                      <span className="dropdown-arrow ms-2"></span>
                    </Link>
                  </li>
                  {/* Các menu khác giữ nguyên hoặc xóa nếu không cần */}
                </ul>
                <div className="right-area sidebar-items position-relative d-flex gap-3 gap-md-5 align-items-center">
                  <div className="single-item d-none d-lg-block">
                    {user ? (
                      <UserDropdown user={user} /> // Gọi UserDropdown và truyền user
                    ) : (
                      // Nút chuyển đến trang Login
                      <Link
                        to="/login"
                        className="box-style box-second first-alt alt-two d-center gap-2 py-2 py-md-3 px-3 px-md-6 px-xl-9"
                      >
                        <span className="fs-seven">Sign In</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
