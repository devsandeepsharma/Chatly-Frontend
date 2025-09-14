import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { motion, AnimatePresence } from "framer-motion";
import { stepTransition, userCardVarient } from "../../animation/Animation";

import Modal from "../ui/Modal";
import { avatars, groupAvatars } from "../../data/avatar";
import { uploadImage } from "../../utils/uploadImage";
import { chatsActions } from "../../store/chatsSlice";
import { uiActions } from "../../store/uiSlice";

const GroupProfileModal = ({ chat, currentUser }) => {

    const dispatch = useDispatch();
    const isAdmin = chat.groupAdmin._id === currentUser._id;

    const [isEditing, setIsEditing] = useState(false);
    const [avatar, setAvatar] = useState(chat.chatAvatar || groupAvatars[0]);
    const [customFile, setCustomFile] = useState(null);
    const [error, setError] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const validationSchema = Yup.object({
        name: Yup.string()
            .min(3, "Group name must be at least 3 characters")
            .max(30, "Group name must be 30 characters or less")
            .required("Group name is required"),
        description: Yup.string()
            .min(3, "Group description must be at least 3 characters")
            .max(60, "Group description must be 30 characters or less")
            .required("Group description is required"),
    });

    const handleAvatarUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCustomFile(file);
            setAvatar(URL.createObjectURL(file));
        }
    };

    const handleSearch = useCallback(async (values, actions) => {
        if (!values.query) {
            actions.setSubmitting(false);
            return;
        };

        try {
            actions.setSubmitting(true);
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/v1/user/search`,
                {
                    params: { q: values.query },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            const filteredUsers = res.data.data.users.filter(
                (u) => !chat.users.some((cu) => cu._id === u._id)
            );
            setSearchResults(filteredUsers);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to search users");
        } finally {
            actions.setSubmitting(false);
        }
    }, []);

    const handleAddUser = async (user) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/chats/group/add`,
                { chatId: chat._id, users: [user._id] },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            const updatedChat = res.data.data.chat;
            const addedUser = updatedChat.users.find(u => !chat.users.some(cu => cu._id === u._id));

            if (addedUser) {
                dispatch(chatsActions.addUserToChat({ chatId: chat._id, user: addedUser }));
            }

            setSearchResults([]);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add user");
        }
    };

    const removeUser = async (userId) => {
        try {
            const res = await axios.delete(
                `${import.meta.env.VITE_API_URL}/api/v1/chats/group/remove`,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                    data: { chatId: chat._id, userId },
                }
            );
            dispatch(chatsActions.removeUserFromChat({
                chatId: chat._id,
                userId,
            }));
        } catch (err) {
            setError(err.response?.data?.message || "Failed to remove user");
        }
    };

    const leaveGroup = async () => {
        try {
            const res = await axios.delete(
                `${import.meta.env.VITE_API_URL}/api/v1/chats/group/leave`,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                    data: { chatId: chat._id }
                }
            );

            dispatch(chatsActions.removeChat(chat._id));
            dispatch(uiActions.closeModal());
        } catch (err) {
            setError(err.response?.data?.message || "Failed to leave group");
        }
    };

    const updateGroup = async (values) => {
        try {
            let finalAvatar = avatar;
            if (customFile) finalAvatar = await uploadImage(customFile);

            const res = await axios.patch(
                `${import.meta.env.VITE_API_URL}/api/v1/chats/group/update`,
                {
                    chatId: chat._id,
                    name: values.name,
                    chatDescription: values.description,
                    avatar: finalAvatar,
                },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );

            dispatch(chatsActions.updateChat(res.data.data.chat));
            setIsEditing(false);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update group");
        }
    };

    return (
        <Modal>
            <motion.div
                key={isEditing ? "edit" : "view"}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={stepTransition}
                className="overflow-y-auto"
            >
                {!isEditing ? (
                    <>
                        <div className="flex items-start gap-3">
                            <img
                                src={chat.chatAvatar}
                                alt="avatar"
                                className="w-18 h-18 rounded-full border-4 border-[#00BFA6] shadow-md flex-shrink-0"
                            />
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">{chat.chatName}</h2>
                                <p className="mt-2 text-sm text-gray-600 italic">
                                    {chat.chatDescription || "No description set"}
                                </p>
                            </div>
                        </div>
                        {isAdmin && (
                            <Formik
                                initialValues={{ query: "" }}
                                onSubmit={(values, actions) => {
                                    handleSearch(values, actions);
                                }}
                            >
                                {({ isSubmitting }) => (
                                    <>
                                        <Form className="mt-4">
                                            <div className="flex gap-2">
                                                <Field
                                                    name="query"
                                                    placeholder="Search by username or email"
                                                    className="flex-5 rounded-xl border border-gray-200 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00BFA6]/50"
                                                />
                                                <button
                                                    type="submit"
                                                    className="flex-2 py-3 rounded-xl font-semibold text-white bg-gradient-to-br from-[#00BFA6] to-[#0AE2C3] shadow-lg transform active:scale-95 transition cursor-pointer"
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? "Searching..." : "Search"}
                                                </button>
                                            </div>
                                        </Form>
                                        <AnimatePresence>
                                            {searchResults.map((user) => (
                                                <motion.div
                                                    key={user._id}
                                                    variants={userCardVarient}
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="exit"
                                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                                    className="mt-2"
                                                >
                                                    <div className="flex w-full items-center justify-between gap-4 overflow-hidden rounded transition bg-white/70 shadow hover:shadow-md">
                                                        <div className="flex items-center gap-2">
                                                            <img
                                                                src={user.avatar || avatars[0]}
                                                                alt="user"
                                                                className="h-10 w-10 rounded object-cover bg-gray-300"
                                                            />
                                                            <span className="truncate text-sm font-semibold text-gray-900 sm:text-base">
                                                                {user.username}
                                                            </span>
                                                        </div>
                                                        <button
                                                            onClick={() => handleAddUser(user)}
                                                            className="text-[#00BFA6] font-medium hover:underline cursor-pointer mr-2"
                                                        >
                                                            Add
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                        <p className="text-xs font-medium text-red-500 mb-4">
                                            <ErrorMessage name="query" />
                                            {error && error}
                                        </p>
                                    </>
                                )}
                            </Formik>
                        )}
                        <div className="space-y-2 mt-4">
                            {chat.users.map((u) => (
                                <div
                                    key={u._id}
                                    className="flex w-full items-center justify-between gap-4 overflow-hidden rounded transition bg-white/70 shadow hover:shadow-md"
                                >
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={u.avatar || avatars[0]}
                                            alt="user"
                                            className="h-10 w-10 rounded object-cover bg-gray-300"
                                        />
                                        <span className="truncate text-sm font-semibold text-gray-900 sm:text-base">
                                            {u.username}{" "}
                                            {u._id === chat.groupAdmin._id && (
                                                <span className="text-sm text-[#00BFA6]">(Admin)</span>
                                            )}
                                        </span>
                                    </div>
                                    {isAdmin && u._id !== currentUser._id && (
                                        <button
                                            onClick={() => removeUser(u._id)}
                                            className="text-red-500 text-sm font-medium hover:underline cursor-pointer mr-2"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between gap-3 mt-4">
                            {isAdmin ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex-1 py-3 rounded-xl font-semibold text-white bg-gradient-to-br from-[#00BFA6] to-[#0AE2C3] shadow-lg cursor-pointer"
                                >
                                    Edit Group
                                </button>
                            ) : (
                                <button
                                    onClick={leaveGroup}
                                    className="flex-1 py-3 rounded-xl font-semibold text-white bg-red-500 shadow-lg cursor-pointer"
                                >
                                    Leave Group
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold mb-2 text-gray-800">Edit Group Details</h2>
                        <Formik
                            initialValues={{
                                name: chat.chatName || "",
                                description: chat.chatDescription || "",
                            }}
                            validationSchema={validationSchema}
                            onSubmit={updateGroup}
                        >
                            {({ isSubmitting }) => (
                                <Form className="space-y-5">
                                    <div className="flex flex-col items-center gap-4">
                                        <label
                                            htmlFor="avatarUpload"
                                            className="cursor-pointer relative w-20 h-20 rounded-full overflow-hidden shadow-inner border-2 flex items-center justify-center"
                                            style={{ borderColor: avatar ? "#00BFA6" : "transparent" }}
                                        >
                                            <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                                            <input
                                                id="avatarUpload"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleAvatarUpload}
                                                className="hidden"
                                            />
                                        </label>
                                        <div className="flex gap-3">
                                            {groupAvatars.map((av) => (
                                                <motion.button
                                                    type="button"
                                                    key={av}
                                                    onClick={() => {
                                                        setAvatar(av);
                                                        setCustomFile(null);
                                                    }}
                                                    className={`w-12 h-12 rounded-full overflow-hidden border-2 cursor-pointer ${avatar === av ? "border-4 border-[#00BFA6]" : "border-transparent"
                                                        }`}
                                                    whileHover={{
                                                        scale: 1.08,
                                                        boxShadow: "0 8px 30px rgba(0,191,166,0.16)",
                                                    }}
                                                >
                                                    <img src={av} alt="avatar" className="w-full h-full" />
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-2">Group Name</label>
                                        <Field
                                            name="name"
                                            placeholder="Group name"
                                            className="w-full rounded-xl border border-gray-200 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00BFA6]/50"
                                        />
                                        <p className="text-xs font-medium text-red-500 mt-2">
                                            <ErrorMessage name="name" />
                                            {error && error}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-2">Group Description</label>
                                        <Field
                                            as="textarea"
                                            name="description"
                                            placeholder="Say something..."
                                            className="w-full rounded-xl border border-gray-200 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00BFA6]/50"
                                        />
                                        <p className="text-xs font-medium text-red-500 mt-2">
                                            <ErrorMessage name="description" />
                                            {error && error}
                                        </p>
                                    </div>

                                    <div className="flex justify-between gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="flex-1 py-3 rounded-xl font-semibold text-gray-700 bg-gray-200 shadow-sm transform active:scale-95 transition cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || !avatar}
                                            className="flex-1 py-3 rounded-xl font-semibold text-white bg-gradient-to-br from-[#00BFA6] to-[#0AE2C3] shadow-lg transform active:scale-95 transition cursor-pointer"
                                        >
                                            {isSubmitting ? "Saving..." : "Save"}
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </>
                )}
            </motion.div>
        </Modal>
    );
};

export default GroupProfileModal;