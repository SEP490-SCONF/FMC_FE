import React, { useEffect } from "react";
import ReactDOM from "react-dom";


const Modal = ({ children, onClose }) => {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);
    const modalRoot = document.getElementById("modal-root");
    if (!modalRoot) return null;

    return ReactDOM.createPortal(
        <div
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
            onClick={onClose}
        >
            <div
                className="bg-white p-6 rounded-xl shadow-xl w-[600px] relative"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>,
        modalRoot
    );
};

export default Modal;
