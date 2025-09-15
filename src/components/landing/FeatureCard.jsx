import { motion } from "motion/react";
import { fadeIn } from "../../animation/Animation";

const FeatureCard = ({ icon, title, desc }) => (
    <motion.div
        variants={fadeIn}
        whileHover={{ y: -6, scale: 1.02 }}
        className="group rounded-2xl border border-gray-200/80 bg-white p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
    >
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#00BFA6] to-[#0AE2C3] text-white shadow flex items-center justify-center mb-4">
            {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
    </motion.div>
);

export default FeatureCard;