import React, { useEffect, useState } from 'react';
import { apiService } from '../../api/ApiService';
import favLogo from "../../assets/images/fav-2.png";
import logoText from "../../assets/images/logo-text.png";
import "../../assets/css/style.min.css";
import { Link } from "react-router-dom";
import UserDropdown from "../header/UserDropdown"; // Thêm dòng này


const Header = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("accessToken");
            if (!token) return;
            try {
                const userInfo = await apiService.get("/User/Information");
                setUser(userInfo);
            } catch (err) {
                setUser(null);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        window.location.href = "/auth/login";
    };

    return (
        <header className="header-section index-two n1-bg-color py-4 px-2 px-md-6">
            <div className="container-fluid">
                <div className="main-navbar px-0 px-xl-8">
                    <nav className="navbar-custom">
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex gap-6">
                                <button className="navbar-toggle-btn d-block d-lg-none" type="button">
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
                                <Link to="/" className="navbar-brand logo d-none d-lg-flex d-xl-flex d-lg-flex gap-2 align-items-center">
                                    <img src={favLogo} alt="logo" />
                                    <img src={logoText} className="d-none d-md-none d-xl-flex" alt="logo" />
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
                                            to="/committee"
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
                                            to="/call-for-paper"
                                            className="position-relative pe-5 z-1 slide-third text-uppercase slide-vertical menu-link"
                                            data-splitting
                                        >
                                            CFP
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
