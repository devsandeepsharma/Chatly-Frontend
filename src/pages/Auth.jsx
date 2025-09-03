import { useState } from "react";
import { Link } from "react-router-dom";

import { AnimatePresence, motion } from "motion/react";
import { cardVariant } from "../animation/Animation";
import Logo from "../components/ui/Logo";
import StepEmail from "../components/auth/stepEmail";
import StepOTP from "../components/auth/StepOTP";
import StepProfile from "../components/auth/StepProfile";

const Auth = () => {

    const [step, setStep] = useState(1);
    const [email, setEmail] = useState(null);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={`auth-${step}`}
                    variants={cardVariant}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    className="w-full max-w-md rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md bg-white/70 border border-white/10"
                >
                    <div className="flex items-center gap-3">
                        <Link to="/"><Logo iconOnly={true} /></Link>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">Welcome back</h3>
                            <p className="text-xs text-gray-500">Fast & secure — sign in with a one-time code</p>
                        </div>
                    </div>
                    <AnimatePresence mode="wait">
                        {
                            step === 1 && (
                                <StepEmail setStep={setStep} setEmail={setEmail} />
                            )
                        }
                        {
                            step === 2 && (
                                <StepOTP setStep={setStep} email={email} />
                            )
                        }
                        {
                            step === 3 && (
                                <StepProfile />
                            )
                        }
                    </AnimatePresence>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

export default Auth;