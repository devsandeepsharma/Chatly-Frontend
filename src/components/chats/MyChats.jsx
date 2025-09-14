import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { motion, AnimatePresence } from "framer-motion";
import { userCardVarient } from "../../animation/Animation";

import UserCard from "./UserCard";
import CreateGroupChat from "./CreateGroupChat";
import { chatsActions } from "../../store/chatsSlice";
import { uiActions } from "../../store/uiSlice";
import { useIsDesktop } from "../../hooks/useIsDesktop";
import { Users } from "lucide-react";

const MyChats = ({ handleSwitch }) => {

    const dispatch = useDispatch();
    const isDesktop = useIsDesktop();

    const [loading, setLoading] = useState(true);
    const { chats, suggestedUsers, selectedChat } = useSelector(
        (state) => state.chats
    );
    const { user } = useSelector(state => state.auth);
    const { modalType } = useSelector(state => state.ui);

    const openGroupChatModel = () => {
        dispatch(uiActions.openModal({ type: "group-chat" }));
    }

    const accessChat = async (userId) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/chats`,
                { userId: userId },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            const chat = res.data.data.chat;

            dispatch(chatsActions.addChat(chat));
            dispatch(chatsActions.setSelectedChat(chat));

            if (!isDesktop) handleSwitch("right");
        } catch (err) {
            console.log(err.response?.data?.message || "Failed to fetch chats");
        }
    }

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
            dispatch(chatsActions.setChats(res.data.data.chats));
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
            dispatch(chatsActions.setSuggestedUsers(res.data.data.users));
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
            {modalType === "group-chat" && <CreateGroupChat />}
            <div className="sticky top-0 z-40 bg-white/70 w-full flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">All Chats</h2>
                <button 
                    className="py-2 px-4 inline-flex items-center justify-center gap-2 rounded-xl font-semibold text-white bg-gradient-to-br from-[#00BFA6] to-[#0AE2C3] shadow-lg transform active:scale-95 transition cursor-pointer"
                    onClick={openGroupChatModel}
                >
                    <Users className="h-4 w-4" /> Create Group
                </button>
            </div>
            <div className="flex-1">
                {loading ? (
                    <p className="text-gray-500">Loading...</p>
                ) : chats.length > 0 ? (
                    <ul className="space-y-2">
                        <AnimatePresence>
                            {chats.map((chat) => {
                                const otherUser = chat.isGroupChat
                                    ? null
                                    : chat.users.find((u) => u._id !== user._id);

                                return (
                                    <motion.li
                                        key={chat._id}
                                        variants={userCardVarient}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                    >
                                        <UserCard
                                            isSelected={chat._id === selectedChat?._id}
                                            avatar={chat.isGroupChat ? chat.chatAvatar : otherUser?.avatar}
                                            title={chat.isGroupChat ? chat.chatName : otherUser?.username}
                                            subtitle={chat.latestMessage?.content || "No messages yet"}
                                            time={chat.latestMessage ? chat.latestMessage.createdAt : ""}
                                            onClick={() => {
                                                dispatch(chatsActions.setSelectedChat(chat));
                                                if (!isDesktop) handleSwitch("right");
                                            }}
                                        />
                                    </motion.li>
                                );
                            })}
                        </AnimatePresence>
                    </ul>
                ) : (
                    <>
                        <h2 className="text-lg font-semibold text-center my-6 text-gray-800">No chats yet</h2>
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">
                            Suggested Users
                        </h3>
                        <ul className="space-y-2">
                            <AnimatePresence>
                                {
                                    suggestedUsers.map((sUser) => (
                                        <motion.li
                                            key={sUser._id}
                                            variants={userCardVarient}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            transition={{ duration: 0.3, ease: "easeOut" }}
                                        >
                                            <UserCard
                                                avatar={sUser?.avatar}
                                                title={sUser?.username}
                                                subtitle={sUser?.email}
                                                onClick={() => accessChat(sUser._id)}
                                            />
                                        </motion.li>
                                    ))
                                }
                            </AnimatePresence>
                        </ul>
                    </>
                )}
            </div>
        </>
    )
}

export default MyChats;