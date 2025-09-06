import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import Header from "../components/layout/Header";
import ProfileModal from "../components/profile/ProfileModal";
import SearchModal from "../components/chats/SearchModal";
import UserCard from "../components/chats/UserCard";
import { useIsDesktop } from "../hooks/useIsDesktop";

import { motion, AnimatePresence } from "framer-motion";
import { chatPanelvariants } from "../animation/Animation";
import { MessageSquare, Users } from "lucide-react";
import axios from "axios";

const Chats = () => {

    const { user } = useSelector(state => state.auth);
    const { modalType } = useSelector(state => state.ui);

    const isDesktop = useIsDesktop();
    const [active, setActive] = useState("left");
    const [direction, setDirection] = useState(1);
    const [chats, setChats] = useState([]);
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedChat, setSelectedChat] = useState(null);

    const handleSwitch = (target) => {
        setDirection(target === "right" ? 1 : -1);
        setActive(target);
    };

    const fetchChats = useCallback(async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/v1/chats`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setChats(res.data.data);
        } catch (err) {
            console.log(err.response?.data?.message || "Failed to fetch chats");
        }
    }, []);

    const fetchSuggestedUsers = useCallback(async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/v1/user/suggestions`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setSuggestedUsers(res.data.data.users);
        } catch (err) {
            console.log(err.response?.data?.message || "Failed to fetch suggestions");
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await fetchChats();
            await fetchSuggestedUsers();
            setLoading(false);
        };
        loadData();
    }, [fetchChats, fetchSuggestedUsers]);

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
                                <div className="sticky top-0 z-40 bg-white/70 w-full flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold text-gray-800">All Chats</h2>
                                    <button className="py-2 px-4 inline-flex items-center justify-center gap-2 rounded-xl font-semibold text-white bg-gradient-to-br from-[#00BFA6] to-[#0AE2C3] shadow-lg transform active:scale-95 transition cursor-pointer">
                                        <Users className="h-4 w-4" /> Create Group
                                    </button>
                                </div>
                                <div className="flex-1">
                                    {loading ? (
                                        <p className="text-gray-500">Loading...</p>
                                    ) : chats.length > 0 ? (
                                        console.log(chats)
                                    ) : (
                                        <>
                                            <h2 className="text-lg font-semibold text-center my-6 text-gray-800">No chats yet</h2>
                                            <h3 className="text-lg font-semibold text-gray-700 mb-3">
                                                Suggested Users
                                            </h3>
                                            <ul className="space-y-2">
                                                {
                                                    suggestedUsers.map((user) => (
                                                        <li key={user._id}>
                                                            <UserCard
                                                                isSelected={user._id === selectedChat}
                                                                avatar={user?.avatar}
                                                                title={user?.username}
                                                                subtitle={user?.email}  
                                                                onClick={() => {
                                                                    setSelectedChat(user._id);
                                                                    if (!isDesktop) {
                                                                        handleSwitch("right");
                                                                    }
                                                                }}
                                                            />
                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                        </>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleSwitch("right")}
                                    className="md:hidden mt-3 px-4 py-2 rounded-lg bg-teal-500 text-white shadow hover:bg-teal-600 transition"
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
                                className="overflow-y-auto absolute inset-0 m-4 md:m-0 md:my-2 md:static h-[calc(100vh-7rem)] flex-1 py-4 px-6 rounded-2xl bg-white shadow-lg"
                            >
                                {
                                    selectedChat ? (
                                        <h2 className="text-lg font-semibold text-gray-700">
                                            {selectedChat}
                                        </h2>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                                            <div className="w-24 h-24 mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                                                <MessageSquare className="w-14 h-14" />
                                            </div>
                                            <h2 className="text-lg font-semibold text-gray-700">
                                                Select a chat to start messaging
                                            </h2>
                                            <p className="text-sm text-gray-500 mt-2">
                                                Your messages will appear here once you choose a conversation.
                                            </p>
                                        </div>
                                    )
                                }
                                <button
                                    onClick={() => handleSwitch("left")}
                                    className="md:hidden mt-3 px-4 py-2 rounded-lg bg-teal-500 text-white shadow hover:bg-teal-600 transition"
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