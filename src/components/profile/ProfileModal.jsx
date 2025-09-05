import { useState } from "react";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

import { motion } from "motion/react";
import { stepTransition } from "../../animation/Animation";

import Modal from "../ui/Modal";
import { avatars } from "../../data/avatar";
import { authActions } from "../../store/authSlice";
import { uploadImage } from "../../utils/uploadImage";

const ProfileModal = ({ user, self=false }) => {

    const dispatch = useDispatch();

    const [isEditing, setIsEditing] = useState(false);
    const [avatar, setAvatar] = useState(user?.avatar || avatars[0]);
    const [customFile, setCustomFile] = useState(null);
    const [error, setError] = useState(false);

    const profileSchema = Yup.object({
        username: Yup.string()
            .min(3, "Must be at least 3 characters")
            .max(20, "Must be 20 characters or less")
            .required("Username is required"),
        bio: Yup.string().max(120, "Bio must be under 120 characters"),
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
            const res = await axios.patch(
                `${import.meta.env.VITE_API_URL}/api/v1/user`,
                { avatar: finalAvatar, username: values.username, bio: values.bio },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            const { user } = res.data.data;
            dispatch(authActions.update(user));
            setIsEditing(false);
        } catch (err) {
            console.log(err)
            setError(err.response?.data?.message || "Profile update failed");
        } finally {
            actions.setSubmitting(false);
        }
    };

    const logoutUser = () => {
        dispatch(authActions.logout());
        localStorage.removeItem("token");
    }

    return (
        <Modal>
            <motion.div
                key={isEditing ? "edit" : "view"}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={stepTransition}
            >
                {!isEditing ? (
                    <>
                        <div className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left md:gap-6">
                            <img
                                src={user?.avatar}
                                alt="avatar"
                                className="w-24 h-24 rounded-full border-4 border-[#00BFA6] shadow-md flex-shrink-0"
                            />
                            <div className="mt-3 md:mt-0">
                                <h2 className="text-xl font-bold text-gray-800">{user?.username}</h2>
                                <p className="text-gray-500">{user?.email}</p>
                                <p className="mt-2 text-sm text-gray-600 italic">
                                    {user?.bio || "No bio set"}
                                </p>
                            </div>
                        </div>
                        {
                            self && (
                                <div className="flex justify-center md:justify-start gap-2 mt-4">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex-3 py-3 rounded-xl font-semibold text-white bg-gradient-to-br from-[#00BFA6] to-[#0AE2C3] shadow-lg transform active:scale-95 transition cursor-pointer"
                                    >
                                        Edit Profile
                                    </button>
                                    <button
                                        onClick={logoutUser}
                                        className="flex-1 px-4 py-2 rounded-xl bg-red-500 text-white font-medium shadow-md cursor-pointer"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )
                        }
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold mb-2 text-gray-800">
                            Edit your profile
                        </h2>
                        <Formik
                            initialValues={{
                                username: user?.username || "",
                                bio: user?.bio || "",
                            }}
                            validationSchema={profileSchema}
                            onSubmit={updateProfile}
                        >
                            {({ isSubmitting }) => (
                                <Form className="space-y-5">
                                    <div className="flex flex-col items-center gap-4">
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
                                        <div className="flex gap-3">
                                            {
                                                avatars.map((av) => (
                                                    <motion.button
                                                        type="button"
                                                        key={av}
                                                        onClick={() => {
                                                            setAvatar(av);
                                                            setCustomFile(null);
                                                        }}
                                                        className={`w-12 h-12 rounded-full overflow-hidden border-2 ${
                                                            avatar === av
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
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-2">Bio</label>
                                        <Field
                                            as="textarea"
                                            name="bio"
                                            placeholder="Say something cool..."
                                            className="w-full rounded-xl border border-gray-200 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00BFA6]/50"
                                        />
                                        <p className="text-xs font-medium text-red-500 mt-2">
                                            <ErrorMessage name="bio" />
                                            {error && error}
                                        </p>
                                    </div>
                                    <div className="flex justify-between gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="flex-1 py-3 rounded-xl font-semibold text-gray-700 bg-gray-200 shadow-sm transform active:scale-95 transition"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || !avatar}
                                            className="flex-1 py-3 rounded-xl font-semibold text-white bg-gradient-to-br from-[#00BFA6] to-[#0AE2C3] shadow-lg transform active:scale-95 transition"
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
    )
}

export default ProfileModal;