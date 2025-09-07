import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import ProfileModal from "../profile/ProfileModal";
import MessageForm from "./MessageForm";
import ChatBubble from "./ChatBubble";
import { useIsDesktop } from "../../hooks/useIsDesktop";
import { uiActions } from "../../store/uiSlice";
import { ArrowLeft, Eye, MessageSquare } from "lucide-react";
import { chatsActions } from "../../store/chatsSlice";

const ChatBox = ({ handleSwitch }) => {

    const isDesktop = useIsDesktop();
    const dispatch = useDispatch();

    const { selectedChat, messages } = useSelector((state) => state.chats);
    const { modalType } = useSelector(state => state.ui);
    const { user } = useSelector((state) => state.auth);

    const [loading, setLoading] = useState(false);

    const otherUser = selectedChat?.isGroupChat
        ? null
        : selectedChat?.users?.find((u) => u._id !== user._id);

    const viewProfileModel = () => {
        dispatch(uiActions.openModal({ type: "view-profile" }));
    }

    const fetchMessages = useCallback(async () => {
        if (!selectedChat?._id) return;
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/v1/message`,
                {
                    params: { chatId: selectedChat._id },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            dispatch(chatsActions.setMessages(res.data.data.messages));
        } catch (err) {
            console.log(err)
            console.log(err.response?.data?.message || "Failed to fetch messages");
        }
    }, [selectedChat?._id]);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await fetchMessages();
            setLoading(false);
        };
        loadData();
    }, [fetchMessages]);

    return (
        <div className="h-full flex flex-col">
            {modalType === "view-profile" && <ProfileModal user={otherUser} />}
            {selectedChat ? (
                <>
                    <div className="sticky top-0 z-40 bg-white/70 w-full flex items-center justify-between py-3 border-b">
                        <div className="flex items-center gap-3">
                            {!isDesktop && (
                                <button
                                    onClick={() => handleSwitch("left")}
                                    className="py-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
                                >
                                    <ArrowLeft className="h-5 w-5 text-gray-700" />
                                </button>
                            )}
                            <img
                                src={selectedChat?.isGroupChat
                                    ? selectedChat.chatAvatar
                                    : otherUser?.avatar || "/default-avatar.png"}
                                alt="avatar"
                                className="w-10 h-10 rounded-full border"
                            />
                            <div className="flex flex-col">
                                <h2 className="font-semibold text-gray-800">
                                    {selectedChat?.isGroupChat
                                        ? selectedChat.chatName
                                        : otherUser?.username || "Unknown"}
                                </h2>
                                <span className="text-xs text-gray-500">
                                    {selectedChat?.isGroupChat ? "Group chat" : "Active now"}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={viewProfileModel}
                            className="py-2 px-4 inline-flex items-center justify-center gap-2 rounded-xl font-semibold text-white bg-gradient-to-br from-[#00BFA6] to-[#0AE2C3] shadow-lg transform active:scale-95 transition cursor-pointer"
                        >
                            <Eye className="h-4 w-4" /> View
                        </button>
                    </div>
                    {
                        loading ? (
                            <div className="flex-1 flex items-center justify-center text-gray-400">
                                <p>Loading messages</p>
                            </div>
                        ) : messages.length > 0 ? (
                            <div className="flex-1 flex flex-col gap-1 justify-end mb-5">
                                {
                                    messages.map((msg, i) => (
                                        <ChatBubble
                                            key={msg?._id}
                                            text={msg?.content}
                                            time={msg?.createdAt}
                                            side={msg?.sender?._id === user?._id ? "right" : "left"}
                                            i={i}
                                        />
                                    ))
                                }
                            </div>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-400">
                                <p>💬 Chat messages will go here</p>
                            </div>
                        )
                    }
                    <MessageForm chatId={selectedChat._id} />
                </>
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
            )}
        </div>
    );
};

export default ChatBox;