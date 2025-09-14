import { useState } from "react";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

import { motion, AnimatePresence } from "framer-motion";
import { userCardVarient } from "../../animation/Animation";

import Modal from "../ui/Modal";
import { chatsActions } from "../../store/chatsSlice";
import { uiActions } from "../../store/uiSlice";
import { uploadImage } from "../../utils/uploadImage";
import { groupAvatars } from "../../data/avatar";

const CreateGroupChat = () => {

    const dispatch = useDispatch();

    const [selectedUsers, setSelectedUsers] = useState([]);
    const [results, setResults] = useState([]);
    const [error, setError] = useState("");
    const [avatar, setAvatar] = useState(groupAvatars[0]);
    const [customFile, setCustomFile] = useState(null);

    const validationSchema = Yup.object({
        name: Yup.string()
            .min(3, "Group name must be at least 3 characters")
            .max(30, "Group name must be 30 characters or less")
            .required("Group name is required")
    });

    const handleAvatarUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCustomFile(file);
            setAvatar(URL.createObjectURL(file));
        }
    };

    const handleSearch = async (query) => {
        if (!query) return;
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/v1/user/search`,
                {
                    params: { q: query },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setResults(res.data.data.users);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to search users");
        }
    };

    const toggleUser = (user) => {
        if (selectedUsers.find((u) => u._id === user._id)) {
            setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
        } else {
            setSelectedUsers([...selectedUsers, user]);
        }
    };

    const createGroup = async (values, actions) => {
        try {
            actions.setSubmitting(true);

            let finalAvatar = avatar;
            if (customFile) {
                finalAvatar = await uploadImage(customFile);
            }

            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/chats/group`,
                {
                    name: values.name,
                    users: selectedUsers.map((u) => u._id),
                    avatar: finalAvatar,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            const group = res.data.data.chat;
            dispatch(chatsActions.addChat(group));
            dispatch(uiActions.closeModal());
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create group");
        } finally {
            actions.setSubmitting(false);
        }
    };

    return (
        <Modal>
            <motion.div
                key="model"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="h-[80vh] relative px-2 overflow-y-auto"
            >
                <h2 className="text-lg font-semibold mb-2 text-gray-800">
                    Create Group Chat
                </h2>
                <Formik
                    initialValues={{
                        name: ""
                    }}
                    validationSchema={validationSchema}
                    onSubmit={createGroup}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-5">
                            <div className="flex flex-col items-center gap-4">
                                <label
                                    htmlFor="avatarUpload"
                                    className="cursor-pointer relative w-20 h-20 rounded-full overflow-hidden shadow-inner border-2 flex items-center justify-center"
                                    style={{ borderColor: avatar ? "#00BFA6" : "transparent" }}
                                >
                                    {avatar ? (
                                        <img
                                            src={avatar}
                                            alt="avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-xs text-gray-400">Upload</span>
                                    )}
                                    <input
                                        id="avatarUpload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarUpload}
                                        className="hidden"
                                    />
                                </label>
                                <div className="flex gap-3 flex-wrap justify-center">
                                    {groupAvatars.map((av) => (
                                        <motion.button
                                            type="button"
                                            key={av}
                                            onClick={() => {
                                                setAvatar(av);
                                                setCustomFile(null);
                                            }}
                                            className={`w-12 h-12 rounded-full overflow-hidden border-2 ${avatar === av
                                                    ? "border-4 border-[#00BFA6]"
                                                    : "border-transparent"
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
                                <label className="block text-sm text-gray-600 mb-2">
                                    Group Name
                                </label>
                                <Field
                                    name="name"
                                    placeholder="e.g. Weekend Squad"
                                    className="w-full rounded-xl border border-gray-200 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00BFA6]/50"
                                />
                                <p className="text-xs font-medium text-red-500 mt-2">
                                    <ErrorMessage name="name" />
                                    {error && error}
                                </p>
                            </div>
                            {selectedUsers.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {selectedUsers.map((u) => (
                                        <span
                                            key={u._id}
                                            className="px-3 py-1 bg-[#00BFA6]/10 text-[#00BFA6] text-sm rounded-xl cursor-pointer"
                                            onClick={() => toggleUser(u)}
                                        >
                                            {u.username} ✕
                                        </span>
                                    ))}
                                </div>
                            )}
                            <div>
                                <input
                                    type="text"
                                    placeholder="Search users to add"
                                    className="w-full rounded-xl border border-gray-200 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00BFA6]/50 mb-2"
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                                <p className="text-xs font-medium text-red-500 mb-2">
                                    {error && error}
                                </p>
                                <div className="flex flex-col gap-2">
                                    <AnimatePresence>
                                        {results.length > 0 ? (
                                            results.map((user) => (
                                                <motion.div
                                                    key={user._id}
                                                    variants={userCardVarient}
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="exit"
                                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                                    onClick={() => toggleUser(user)}
                                                >
                                                    <div
                                                        className={`p-3 rounded-xl border cursor-pointer ${selectedUsers.find((u) => u._id === user._id)
                                                                ? "border-[#00BFA6] bg-[#00BFA6]/10"
                                                                : "border-gray-200"
                                                            }`}
                                                    >
                                                        <p className="text-sm font-medium text-gray-800">
                                                            {user.username}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-center">No users found</p>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                            <div className="flex justify-between gap-3 mt-3">
                                <button
                                    type="button"
                                    onClick={() => dispatch(uiActions.closeModal())}
                                    className="flex-1 py-3 rounded-xl font-semibold text-gray-700 bg-gray-200 shadow-sm transform active:scale-95 transition cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !avatar}
                                    className="flex-1 py-3 rounded-xl font-semibold text-white bg-gradient-to-br from-[#00BFA6] to-[#0AE2C3] shadow-lg transform active:scale-95 transition cursor-pointer"
                                >
                                    {isSubmitting ? "Creating..." : "Create"}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </motion.div>
        </Modal>
    );
};

export default CreateGroupChat;