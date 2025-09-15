import { motion } from "motion/react";
import { fadeIn } from "../../animation/Animation";

const Testimonial = ({ name, role, quote, img }) => (
    <motion.figure
        variants={fadeIn}
        className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-lg"
    >
        <div className="flex items-center gap-3 mb-4">
            <img
                src={img || `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(name)}`}
                alt={name}
                className="h-10 w-10 rounded-full object-cover"
            />
            <figcaption>
                <div className="font-semibold text-gray-900">{name}</div>
                <div className="text-xs text-gray-500">{role}</div>
            </figcaption>
        </div>
        <blockquote className="text-gray-700 leading-relaxed">“{quote}”</blockquote>
    </motion.figure>
);

export default Testimonial;