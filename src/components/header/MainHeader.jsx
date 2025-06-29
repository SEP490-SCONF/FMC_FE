import React from 'react';
import { Link } from "react-router-dom";
import NotificationDropdown from "./NotificationDropdown";
import UserDropdown from "./UserDropdown";
import { useUser } from "../../context/UserContext";
import fptLogo from '../../assets/images/fptlogo.png'; // Đường dẫn tùy vị trí file ảnh


const MainHeader = ({ onClick, onToggle }) => {
    const { user } = useUser();
    const [isApplicationMenuOpen, setApplicationMenuOpen] = React.useState(false);



    const toggleApplicationMenu = () => {
        setApplicationMenuOpen(!isApplicationMenuOpen);
    };

    return (
        <header className="sticky top-0 w-full bg-white border-b border-gray-200 z-50 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between px-6 py-3">
                {/* Left: Logo + Search */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Hamburger menu */}
                    <button
                        className="flex items-center justify-center w-10 h-10 text-gray-500 rounded-lg lg:hidden dark:text-gray-400"
                        onClick={onToggle}
                    >
                        <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                            <path
                                d="M3 6h14M3 10h14M3 14h14"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0 overflow-hidden">
                        <img
                            className="max-h-8 max-w-24 w-auto object-contain dark:hidden"
                            src={fptLogo}
                            alt="Logo"
                        />
                        {/* <img
                            className="max-h-8 max-w-24 w-auto object-contain hidden dark:block"
                            src="/images/logo/logo-dark.svg"
                            alt="Logo"
                        /> */}
                    </Link>
                    {/* Search */}
                    <form className="flex items-center flex-1 max-w-xl ml-4">
                        <div className="relative w-full">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
                                    <circle
                                        cx="8.5"
                                        cy="8.5"
                                        r="6.5"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                    />
                                    <path
                                        d="M16 16L13 13"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </span>
                            <input
                                type="text"
                                placeholder="Search or type command..."
                                className="w-full h-10 pl-10 pr-20 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-brand-300 dark:bg-gray-900 dark:border-gray-800 dark:text-white"
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 text-xs border border-gray-200 rounded bg-gray-50 text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400"
                                tabIndex={-1}
                            >
                                <span>⌘</span>
                                <span>K</span>
                            </button>
                        </div>
                    </form>
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
                            className="px-4 py-2 rounded bg-brand-500 text-white font-medium hover:bg-brand-600 transition"
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
