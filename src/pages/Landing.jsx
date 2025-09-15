import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { fadeIn, staggerContainer } from "../animation/Animation";

import AuthHeader from "../components/layout/AuthHeader";
import Footer from "../components/layout/Footer";
import ChatDemo from "../components/landing/ChatDemo";
import FeatureCard from "../components/landing/FeatureCard";
import Testimonial from "../components/landing/Testimonial";
import { ArrowRight, MessageCircle, MonitorSmartphone, UserPlus, Users } from "lucide-react";

const Landing = () => {
    return (
        <>
            <AuthHeader />
            <main className="p-4 w-full max-w-7xl mx-auto">
                <section className="pt-16 pb-10 grid md:grid-cols-2 gap-10 items-center">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="show"
                        className="space-y-6"
                    >
                        <motion.h1 variants={fadeIn} className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
                            Modern Messaging, <span className="bg-clip-text text-transparent bg-gradient-to-br from-[#00BFA6] to-[#0AE2C3]">Instantly</span>
                        </motion.h1>
                        <motion.p variants={fadeIn} className="text-base md:text-lg text-gray-600 max-w-prose">
                            Experience real-time messaging like never before and stay connected with friends, family, or teammates—anywhere, anytime, without delays.
                        </motion.p>
                        <motion.div variants={fadeIn} className="flex items-center gap-3">
                            <Link to="/auth" className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-white bg-gradient-to-br from-[#00BFA6] to-[#0AE2C3] shadow-lg transform active:scale-95 transition cursor-pointer">
                                Get Started <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                            <a href="#features" className="text-sm md:text-base font-medium text-gray-700 hover:text-[#00BFA6]">Explore features</a>
                        </motion.div>
                    </motion.div>

                    <div className="flex justify-center">
                        <ChatDemo />
                    </div>
                </section>
                <section id="features" className="py-16">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <motion.h2 variants={fadeIn} className="text-2xl md:text-3xl font-bold text-center mb-3">Everything you need</motion.h2>
                        <motion.p variants={fadeIn} className="text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10">
                            Built for speed and simplicity. Powerful features wrapped in a minimal UI.
                        </motion.p>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <FeatureCard
                                icon={<MessageCircle className="h-6 w-6" />}
                                title="Real-time Messaging"
                                desc="Lightning-fast updates via WebSockets so chats feel instant and reliable."
                            />
                            <FeatureCard
                                icon={<Users className="h-6 w-6" />}
                                title="Group Chats"
                                desc="Create vibrant spaces for teams, classes, or communities with ease."
                            />
                            <FeatureCard
                                icon={<UserPlus className="h-6 w-6" />}
                                title="Guest Login"
                                desc="Frictionless onboarding — jump in with a click, no forms required."
                            />
                            <FeatureCard
                                icon={<MonitorSmartphone className="h-6 w-6" />}
                                title="Cross‑Platform"
                                desc="Beautiful on phones, tablets, and desktops with responsive layouts."
                            />
                        </div>
                    </motion.div>
                </section>
                <section id="testimonials" className="py-16">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <motion.h2 variants={fadeIn} className="text-2xl md:text-3xl font-bold text-center mb-3">Loved by early users</motion.h2>
                        <motion.p variants={fadeIn} className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
                            A few words from our (fictional but fabulous) community.
                        </motion.p>

                        <div className="grid md:grid-cols-3 gap-6">
                            <Testimonial
                                name="Priya Mehta"
                                role="Product Designer"
                                quote="Finally, a chat app that nails minimalism without feeling bland. The micro-interactions are chef's kiss."
                            />
                            <Testimonial
                                name="Arjun Singh"
                                role="Community Manager"
                                quote="Groups feel snappy even with hundreds of members. Guest login is a game changer for onboarding." />
                            <Testimonial
                                name="Lina Park"
                                role="Developer"
                                quote="The responsive layout and smooth animations make this a joy to use across devices." />
                        </div>
                    </motion.div>
                </section>
                <section id="cta" className="py-16">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.3 }}
                        className="text-center"
                    >
                        <motion.h3 variants={fadeIn} className="text-2xl md:text-3xl font-extrabold mb-4">Ready to start chatting?</motion.h3>
                        <motion.p variants={fadeIn} className="text-gray-600 mb-8">Join now and set up your first conversation in seconds.</motion.p>
                        <Link
                            variants={fadeIn}
                            to="/auth"
                            className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white shadow-2xl bg-gradient-to-r from-[#00BFA6] to-[#0AE2C3] hover:shadow-[0_20px_60px_-12px_rgba(10,226,195,0.45)] transition-transform hover:scale-[1.03]"
                        >
                            Get Started <ArrowRight className="h-5 w-5" />
                        </Link>
                    </motion.div>
                </section>
            </main>
            <Footer />
        </>
    )
}

export default Landing;