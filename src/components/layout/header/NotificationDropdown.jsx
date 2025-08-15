import { useState } from "react";
import { Dropdown } from "../../ui/dropdown/Dropdown";
import { DropdownItem } from "../../ui/dropdown/DropdownItem";

export default function NotificationDropdown({ notifications = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);
  const [filter, setFilter] = useState("all"); // "all" or "unread"

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleClick = () => {
    toggleDropdown();
    setNotifying(false);
  };

  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const filteredNotifications =
    filter === "unread"
      ? sortedNotifications.filter((n) => !n.isRead)
      : sortedNotifications;

  function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds

    if (diff < 60) return "just now";
    if (diff < 3600)
      return `${Math.floor(diff / 60)} minute${
        Math.floor(diff / 60) > 1 ? "s" : ""
      } ago`;
    if (diff < 86400)
      return `${Math.floor(diff / 3600)} hour${
        Math.floor(diff / 3600) > 1 ? "s" : ""
      } ago`;
    if (diff < 2592000)
      return `${Math.floor(diff / 86400)} day${
        Math.floor(diff / 86400) > 1 ? "s" : ""
      } ago`;
    return date.toLocaleDateString();
  }

  return (
    <div className="relative">
      <button
        className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        style={{ borderRadius: "9999px" }}
        onClick={handleClick}
      >
        <span
          className={`absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400 ${
            !notifying ? "hidden" : "flex"
          }`}
        >
          <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
        </span>
        <svg
          className="fill-current"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
            fill="currentColor"
          />
        </svg>
      </button>
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute -right-[240px] mt-[17px] flex h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-[361px] lg:right-0"
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Notification
          </h5>
          <div className="flex gap-2 bg-[#f4f8ff] rounded-full px-1 py-1">
            <button
              className={`px-4 py-1 !rounded-full text-sm font-semibold transition ${
                filter === "all"
                  ? "bg-white text-blue-600 shadow font-bold"
                  : "bg-transparent text-gray-600 hover:bg-white/60"
              }`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={`px-4 py-1 !rounded-full text-sm font-semibold transition ${
                filter === "unread"
                  ? "bg-white text-blue-600 shadow font-bold"
                  : "bg-transparent text-gray-600 hover:bg-white/60"
              }`}
              onClick={() => setFilter("unread")}
            >
              Unread
            </button>
          </div>
        </div>
        <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar">
          {filteredNotifications.length === 0 && (
            <li className="text-center text-gray-400 py-8">No notifications</li>
          )}
          {filteredNotifications.map((noti) => (
            <li key={noti.notiId}>
              <DropdownItem
                onItemClick={closeDropdown}
                className={`flex flex-col gap-1 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5 ${
                  noti.isRead ? "opacity-60" : "font-semibold bg-orange-50"
                }`}
              >
                <span className="text-base text-gray-800 dark:text-white/90">
                  {noti.title}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {noti.content}
                </span>
                <span className="flex items-center gap-2 text-gray-400 text-xs mt-1">
                  <span>{noti.roleTarget}</span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span>{formatTimeAgo(noti.createdAt)}</span>
                  {!noti.isRead && (
                    <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                      New
                    </span>
                  )}
                </span>
              </DropdownItem>
            </li>
          ))}
        </ul>
      </Dropdown>
    </div>
  );
}
