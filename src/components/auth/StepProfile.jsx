import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

import { motion } from "motion/react";
import { stepTransition } from "../../animation/Animation";
import { avatars } from "../../data/avatar";
import { authActions } from "../../store/authSlice";
import { uploadImage } from "../../utils/uploadImage";

const StepProfile = () => {

    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [avatar, setAvatar] = useState(user?.avatar || avatars[0]);
    const [customFile, setCustomFile] = useState(null);
    const [error, setError] = useState(false);
  
    const profileSchema = Yup.object({
        username: Yup.string()
            .min(3, "Must be at least 3 characters")
            .max(20, "Must be 20 characters or less")
            .required("Username is required"),
    });

    const handleAvatarUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCustomFile(file);
            setAvatar(URL.createObjectURL(file));
        }
    };

    const updateProfile = async (values, actions) => {
        setError("");
        let finalAvatar = avatar;

        if (customFile) {
            finalAvatar = await uploadImage(customFile);
        }

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/auth/set-profile`,
                { avatar: finalAvatar, username: values.username },
                {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            const { user } = res.data.data;
            dispatch(authActions.update(user));
            navigate("/chats");
        } catch (err) {
            setError(err.response?.data?.message || "Profile update failed");
        } finally {
            actions.setSubmitting(false);
        }
    }

    return (
        <motion.div
            key="s3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={stepTransition}
        >
            <h2 className="text-2xl font-bold mt-3 mb-2 text-gray-800">Set up your profile</h2>
            <p className="text-sm text-gray-500 mb-4">
                Pick a display name and avatar — you can change this later.
            </p>
            <Formik
                initialValues={{ username: user?.username }}
                validationSchema={profileSchema}
                onSubmit={(values, actions) => {
                    updateProfile(values, actions);
                }}
            >
                {({ isSubmitting }) => (
                    <Form className="space-y-5">
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex items-center gap-4">
                                <label
                                    htmlFor="avatarUpload"
                                    className="cursor-pointer relative w-20 h-20 rounded-full overflow-hidden shadow-inner border-2 flex items-center justify-center"
                                    style={{ borderColor: avatar ? "#00BFA6" : "transparent" }}
                                >
                                    <img
                                        src={avatar}
                                        alt="avatar"
                                        className="w-full h-full object-cover"
                                    />
                                    <input
                                        id="avatarUpload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarUpload}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            <div className="flex gap-3">
                                {
                                    avatars.map(av => (
                                        <motion.button
                                            type="button"
                                            key={av}
                                            onClick={() => {
                                                setAvatar(av);
                                                setCustomFile(null);
                                            }}
                                            className={`w-14 h-14 rounded-full overflow-hidden border-2 ${
                                                avatar === av
                                                    ? "border-4 border-[#00BFA6]"
                                                    : "border-transparent"
                                                }`
                                            }
                                            whileHover={{
                                                scale: 1.08,
                                                boxShadow: "0 8px 30px rgba(0,191,166,0.16)",
                                            }}
                                        >
                                            <img src={av} alt="avatar" className="w-full h-full" />
                                        </motion.button>
                                    ))
                                }
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-2">
                                Username
                            </label>
                            <Field
                                name="username"
                                placeholder="e.g. alex"
                                className="w-full rounded-xl border border-gray-200 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00BFA6]/50"
                            />
                            <p className="text-xs font-medium text-red-500 mt-2">
                                <ErrorMessage name="username" />
                                {error && error}
                            </p>
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting || !avatar}
                            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-br from-[#00BFA6] to-[#0AE2C3] shadow-lg transform active:scale-95 transition cursor-pointer"
                        >
                            { isSubmitting ? "Saving...": "Save & Continue" }
                        </button>
                    </Form>
                )}
            </Formik>
        </motion.div>
    );
};

export default StepProfile;