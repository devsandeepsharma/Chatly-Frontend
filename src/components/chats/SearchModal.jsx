import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

import { motion, AnimatePresence } from "framer-motion";
import { userCardVarient } from "../../animation/Animation";

import Modal from "../ui/Modal";
import UserCard from "../chats/UserCard";
import { chatsActions } from "../../store/chatsSlice";
import { uiActions } from "../../store/uiSlice";

const SearchModal = () => {

    const dispatch = useDispatch();
    const [results, setResults] = useState([]);
    const [error, setError] = useState("");

    const handleSearch = useCallback(async (values, actions) => {
        if (!values.query) return;
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
            setResults(res.data.data.users);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to search users");
        } finally {
            actions.setSubmitting(false);
        }
    }, []);

    const accessChat = async (userId) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/chats`,
                { userId },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            const chat = res.data.data.chat;
            dispatch(chatsActions.addChat(chat));
            dispatch(chatsActions.setSelectedChat(chat));
            dispatch(uiActions.closeModal());
        } catch (err) {
            console.log(err.response?.data?.message || "Failed to open chat");
        }
    };

    const validationSchema = Yup.object({
        query: Yup.string()
            .min(2, "Enter at least 2 characters")
            .required("Search term is required"),
    });

    return (
        <Modal>
            <div className="h-[80vh] relative px-1 overflow-y-auto">
                <div className="sticky top-0 bg-white w-full">
                    <h2 className="text-lg font-semibold mb-4">Search Users</h2>
                    <Formik
                        initialValues={{ query: "" }}
                        validationSchema={validationSchema}
                        onSubmit={(values, actions) => {
                            handleSearch(values, actions);
                        }}
                    >
                        {({ isSubmitting }) => (
                            <>
                                <Form className="flex gap-1 mb-2">
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
                                </Form>
                                <p className="text-xs font-medium text-red-500 mb-4">
                                    <ErrorMessage name="query" />
                                    {error && error}
                                </p>
                            </>
                        )}
                    </Formik>
                </div>
                <div className="flex flex-col gap-2">
                    <AnimatePresence>
                        {results.length > 0 ? (
                            results.map((user, i) => (
                                <motion.li
                                    key={user._id}
                                    variants={userCardVarient}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                >
                                    <UserCard
                                        avatar={user?.avatar}
                                        title={user?.username}
                                        subtitle={user?.email}
                                        onClick={() => accessChat(user._id)}
                                    />
                                </motion.li>
                            ))
                        ) : (
                            <motion.p
                                className="text-gray-500 text-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                No users found
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </Modal>
    );
};

export default SearchModal;