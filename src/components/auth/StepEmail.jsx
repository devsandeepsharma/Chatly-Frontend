import { useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";

import { motion } from "motion/react"
import { stepTransition } from "../../animation/Animation";

const StepEmail = ({ setStep, setEmail }) => {

    const [error, setError] = useState(false);

    const emailSchema = Yup.object({
        email: Yup.string()
            .email("Invalid email address")
            .required("Email is required"),
    });

    const loginAsGuest = async () => {
        setError("");
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/auth/guest-login`);
            setStep(3);
            console.log(res.data);
        } catch (err) {
            setError(err.response?.data?.message || "Guest login failed, try again");
        }
    }

    const sendOTP = async (values, actions) => {
        setError("");
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/auth/send-otp`, 
                { email: values.email }
            );
            setEmail(values.email);
            setStep(2);
            console.log(res.data);
        } catch (err) {
            setError(err.response?.data?.message || "Send OTP failed, try again");
        } finally {
            actions.setSubmitting(false);
        }
    }

    return (
        <motion.div 
            key="s1" 
            initial={ { opacity: 0, y: 8 } } 
            animate={ { opacity: 1, y: 0 } } 
            exit={ { opacity: 0, x: -20 } } 
            transition={ stepTransition }
        >
            <h2 className="text-2xl font-bold my-3 text-gray-800">Sign in with Email</h2>
            <Formik
                initialValues={{
                    email: ""
                }}
                validationSchema={emailSchema}
                onSubmit={(values, actions) => {
                    sendOTP(values, actions);
                }}
            >
                {({ isSubmitting }) => (
                    <Form className="flex flex-col gap-3 mt-2">
                        <div className="flex flex-col gap-2">
                            <label className="block text-sm text-gray-600">Email</label>
                            <Field 
                                className="w-full rounded-xl border border-gray-200 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00BFA6]/50" 
                                name="email" 
                                type="email" 
                                placeholder="Enter your email"
                            />
                            <p className="text-xs font-medium text-red-500">
                                <ErrorMessage name="email" />
                                {error && error}
                            </p>
                        </div>
                        <button 
                            type="submit" 
                            disabled={isSubmitting} 
                            className="flex-1 py-3 rounded-xl font-semibold text-white bg-gradient-to-br from-[#00BFA6] to-[#0AE2C3] shadow-lg transform active:scale-95 transition cursor-pointer"
                        >
                            {isSubmitting ? 'Sending…' : 'Continue'}
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-px bg-gray-200" />
                            <div className="text-sm text-gray-500">or</div>
                            <div className="flex-1 h-px bg-gray-200" />
                        </div>
                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={loginAsGuest}
                            className="w-full py-3 rounded-xl font-semibold shadow-inner text-black bg-[#FFD93D] transform active:scale-95 transition cursor-pointer"
                        >
                            Continue as Guest
                        </button>
                    </Form>
                )}
            </Formik>
            <p className="text-xs text-gray-500 mt-4">By continuing you agree to our terms. We'll send a one-time verification code to your email.</p>
        </motion.div>
    )
}

export default StepEmail;