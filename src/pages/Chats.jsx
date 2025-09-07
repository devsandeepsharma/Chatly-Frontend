import { useState } from "react";
import { useSelector } from "react-redux";

import { motion, AnimatePresence } from "framer-motion";
import { chatPanelvariants } from "../animation/Animation";

import Header from "../components/layout/Header";
import ProfileModal from "../components/profile/ProfileModal";
import SearchModal from "../components/chats/SearchModal";
import MyChats from "../components/chats/MyChats";
import ChatBox from "../components/chats/ChatBox";
import { useIsDesktop } from "../hooks/useIsDesktop";

const Chats = () => {

    const { user } = useSelector(state => state.auth);
    const { modalType } = useSelector(state => state.ui);

    const isDesktop = useIsDesktop();
    const [active, setActive] = useState("left");
    const [direction, setDirection] = useState(1);

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
                                className="overflow-y-auto absolute inset-0 m-4 md:m-0 md:my-2 md:static h-[calc(100vh-7rem)] flex-1 py-4 px-6 rounded-2xl bg-white shadow-lg"
                            >
                                <MyChats handleSwitch={handleSwitch} />
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
                                className="overflow-y-auto absolute inset-0 m-4 md:m-0 md:my-2 md:static h-[calc(100vh-7rem)] flex-1 py-4 px-6 rounded-2xl bg-white shadow-lg"
                            >
                                <ChatBox handleSwitch={handleSwitch} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </>
    )
}

export default Chats;