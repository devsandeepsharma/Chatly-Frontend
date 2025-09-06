import { useState } from "react";
import { useSelector } from "react-redux";

import Header from "../components/layout/Header";
import ProfileModal from "../components/profile/ProfileModal";
import SearchModal from "../components/chats/SearchModal";
import { useIsDesktop } from "../hooks/useIsDesktop";

import { motion, AnimatePresence } from "framer-motion";
import { chatPanelvariants } from "../animation/Animation";
import { Users } from "lucide-react";

const Chats = () => {

    const { user } = useSelector(state => state.auth);
    const { modalType } = useSelector(state => state.ui);

    const [active, setActive] = useState("left");
    const [direction, setDirection] = useState(1);
    const isDesktop = useIsDesktop();

    const handleSwitch = (target) => {
        setDirection(target === "right" ? 1 : -1);
        setActive(target);
    };

    return (
        <>
            {modalType === "profile" && <ProfileModal user={user} self />}
            {modalType === "search" && <SearchModal />}
            <Header />
            <main className="min-h-[calc(100vh-4rem)]">
                <div className="relative p-4 w-full max-w-7xl mx-auto flex flex-row gap-4">
                    <AnimatePresence mode="wait" custom={direction}>
                        {(active === "left" || isDesktop) && (
                            <motion.div
                                key="left"
                                custom={direction}
                                variants={chatPanelvariants}
                                initial={!isDesktop ? "hidden" : false}
                                animate="visible"
                                exit="exit"
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                                className="absolute inset-0 m-4 md:m-0 md:my-2 md:static min-h-[calc(100vh-7rem)] flex-1 py-4 px-6 rounded-2xl bg-white/70 shadow-lg"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold text-gray-800">All Chats</h2>
                                    <button className="py-2 px-4 inline-flex items-center justify-center gap-2 rounded-xl font-semibold text-white bg-gradient-to-br from-[#00BFA6] to-[#0AE2C3] shadow-lg transform active:scale-95 transition cursor-pointer">
                                        <Users className="h-4 w-4" /> Create Group
                                    </button>
                                </div>
                                <button
                                    onClick={() => handleSwitch("right")}
                                    className="md:hidden px-4 py-2 rounded-lg bg-teal-500 text-white shadow hover:bg-teal-600 transition"
                                >
                                    Go to Right Box →
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <AnimatePresence mode="wait" custom={direction}>
                        {(active === "right" || isDesktop) && (
                            <motion.div
                                key="right"
                                custom={direction}
                                variants={chatPanelvariants}
                                initial={!isDesktop ? "hidden" : false}
                                animate="visible"
                                exit="exit"
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                                className="absolute inset-0 m-4 md:m-0 md:my-2 md:static min-h-[calc(100vh-7rem)] flex-1 py-4 px-6 rounded-2xl shadow-xl bg-white"
                            >
                                <h2 className="text-xl font-bold mb-3">Right Container</h2>
                                <p className="text-gray-600 mb-6">
                                    This is the right container.
                                    - On desktop: always visible.
                                    - On mobile: only visible when active.
                                </p>
                                <button
                                    onClick={() => handleSwitch("left")}
                                    className="md:hidden px-4 py-2 rounded-lg bg-teal-500 text-white shadow hover:bg-teal-600 transition"
                                >
                                    ← Go to Left Box
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </>
    )
}

export default Chats;