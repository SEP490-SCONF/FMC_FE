import { useEffect } from "react";

export default function NotificationPopup({
  message,
  type = "info",
  duration = 3000,
  onClose,
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500 text-black",
    info: "bg-blue-500",
  }[type];

  return (
    <div
      className={`fixed top-6 right-6 px-5 py-3 rounded-lg shadow-lg text-white font-medium transition-all duration-300 transform animate-slideIn ${bgColor}`}
    >
      {message}
    </div>
  );
}
