import { createPortal } from "react-dom";
import { useDispatch } from "react-redux";
import { AnimatePresence, motion } from "motion/react";

import { uiActions } from "../../store/uiSlice";
import { X } from "lucide-react";

const Modal = ({ children }) => {

    const dispatch = useDispatch();

    const portalElement = document.getElementById("portal");

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
          dispatch(uiActions.closeModal());
        }
    };

    return createPortal(
        <AnimatePresence>
            <motion.div 
                key="backdrop"
                className="fixed inset-0 bg-black/40 z-[150] flex items-center justify-center p-6"
                onClick={handleBackdropClick}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                role="dialog"
                aria-modal="true"
            >
                <motion.div
                    key="modal"
                    initial={{ opacity: 0, scale: 0, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0, y: 10 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="relative bg-white rounded-2xl border border-[#00BFA6] shadow-xl max-w-lg w-full p-6"
                >
                    <button
                        onClick={() => dispatch(uiActions.closeModal())}
                        className="absolute z-100 top-3 right-3 p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
                    >
                        <X className="h-5 w-5 text-gray-600" />
                    </button>
                    {children}
                </motion.div>
            </motion.div>
        </AnimatePresence>,
        portalElement
    );
};

export default Modal;