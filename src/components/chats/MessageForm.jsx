import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";

import socket from "../../utils/socket";
import { Send } from "lucide-react";

const MessageForm = ({ chatId }) => {

    const { user } = useSelector(state => state.auth);
    const [typing, setTyping] = useState(false);
    const typingTimeoutRef = useRef(null);

    const MessageSchema = Yup.object().shape({
        content: Yup.string().trim().required("Message cannot be empty"),
    });

    const sendMessage = async (content, resetForm) => {
        try {
            if (!content.trim()) return;
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/message`,
                { chatId, content },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            const message = res.data.data.message;
            socket.emit("sendMessage", message);
            resetForm();

            setTyping(false);
            socket.emit("stopTyping", { chatId, userId: user._id });
        } catch (err) {
            console.log(err.response?.data?.message || "Failed to send message");
        }
    };

    const handleTyping = (e) => {
        if (!typing) {
            setTyping(true);
            socket.emit("typing", { chatId, userId: user._id });
        }

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        typingTimeoutRef.current = setTimeout(() => {
            setTyping(false);
            socket.emit("stopTyping", { chatId, userId: user._id });
        }, 1000);
    };

    return (
        <Formik
            initialValues={{ content: "" }}
            validationSchema={MessageSchema}
            onSubmit={(values, { resetForm }) => sendMessage(values.content, resetForm)}
        >
            {({ isSubmitting, setFieldValue }) => (
                <Form className="flex items-center gap-2">
                    <Field
                        name="content"
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        onChange={(e) => {
                            setFieldValue("content", e.target.value);
                            handleTyping(e);
                        }}
                    />
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="p-2 rounded-full text-white bg-gradient-to-br from-[#00BFA6] to-[#0AE2C3] shadow-lg transform active:scale-95 transition cursor-pointer disabled:opacity-50"
                    >
                        <Send className="h-5 w-5" />
                    </button>
                </Form>
            )}
        </Formik>
    );
};

export default MessageForm;