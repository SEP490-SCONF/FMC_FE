// src/components/ui/Modal.jsx
import ReactDOM from "react-dom";

const Modal = ({ children, onClose }) => {
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
