import { useState } from "react";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

import { motion } from "motion/react"
import { stepTransition } from "../../animation/Animation";
import { authActions } from "../../store/authSlice";

const StepOTP = ({ email, setStep }) => {

    const dispatch = useDispatch();
    const [error, setError] = useState(false);

    const otpSchema = Yup.object().shape({
        otp: Yup.string()
            .length(6, "OTP must be exactly 6 digits")
            .matches(/^\d+$/, "Only numbers allowed")
            .required("OTP is required"),
    });

    const verifyOTP = async (values, actions) => {
        setError("");
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/auth/verify-otp`, 
                { email, otp: values.otp }
            );
            const { token, user } = res.data.data;
            localStorage.setItem("token", token);
            dispatch(authActions.login(user));
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.message || "OTP verification failed, try again");
        } finally {
            actions.setSubmitting(false);
        }
    }

    const resendOTP = async () => {
        setError("");
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/auth/send-otp`, 
                { email }
            );
            console.log(res.data);
        } catch (err) {
            setError(err.response?.data?.message || "Resending OTP failed, try again");
        }
    }

    const backToEmailPage = () => {
        setStep(1);
    }

    return (
        <motion.div
            key="s1" 
            initial={ { opacity: 0, y: 8 } } 
            animate={ { opacity: 1, y: 0 } } 
            exit={ { opacity: 0, x: -20 } } 
            transition={ stepTransition }
        >
            <h2 className="text-2xl font-bold mt-3 mb-2 text-gray-800">Enter Verification Code</h2>
            <p className="text-sm text-gray-500 mb-4">
                We've sent a 6-digit code to{" "}
                <span className="font-medium text-gray-700">{email}</span>
            </p>
            <Formik
                initialValues={{ otp: "" }}
                validationSchema={otpSchema}
                onSubmit={(values, actions) => {
                    verifyOTP(values, actions);
                }}
            >
                {({ values, setFieldValue, isSubmitting }) => (
                    <Form>
                        <div className="flex gap-3 justify-center mb-3">
                            { Array.from({ length: 6 }).map((_, i) => (
                                <Field
                                    key={i}
                                    name="otp"
                                >
                                    {({ field }) => (
                                        <motion.input
                                            type="text"
                                            maxLength="1"
                                            value={values.otp[i] || ""}
                                            onChange={ (e) => {
                                                const val = e.target.value.replace(/\D/g, "");
                                                const otpArray = values.otp.split("");
                                                otpArray[i] = val;
                                                setFieldValue("otp", otpArray.join(""));
                                                if (val && i < 6 - 1) {
                                                    const next = document.getElementById(`otp-${i + 1}`);
                                                    if (next) next.focus();
                                                }
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === "Backspace" && !values.otp[i] && i > 0) {
                                                    const prev = document.getElementById(`otp-${i - 1}`);
                                                    if (prev) prev.focus();
                                                }
                                            }}
                                            id={`otp-${i}`}
                                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl text-center text-lg font-medium border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00BFA6]/50 shadow-sm"
                                        />
                                    )}
                                </Field>
                            ))}
                        </div>
                        <p className="text-xs font-medium text-red-500">
                            <ErrorMessage name="otp" />
                            {error && error}
                        </p>
                        <div className="flex gap-3 mt-5">
                            <button 
                                type="submit" 
                                disabled={isSubmitting} 
                                className="flex-1 py-3 rounded-xl font-semibold text-white bg-gradient-to-br from-[#00BFA6] to-[#0AE2C3] shadow-lg transform active:scale-95 transition cursor-pointer"
                            >
                                { isSubmitting ? "Verifying…": "Verify" }
                            </button>
                            <button
                                type="button"
                                className="py-3 px-4 rounded-xl font-semibold shadow-inner text-black bg-[#FFD93D] transform active:scale-95 transition cursor-pointer"
                                onClick={resendOTP}
                            >
                                Resend OTP
                            </button>
                        </div>
                        <button 
                            type="button"
                            className="block mt-4 text-xs mx-auto text-gray-500 underline cursor-pointer"
                            onClick={backToEmailPage}
                        >
                            Change your email
                        </button>
                    </Form>
                )}
            </Formik>
        </motion.div>
    );
};

export default StepOTP;