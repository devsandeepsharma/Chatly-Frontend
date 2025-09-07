import { motion } from "motion/react";
import { dotVariants } from "../../animation/Animation";

const TypingDots = () => {
    return (
        <div className="flex items-center gap-1">
            {[0, 1, 2].map((i) => (
                <motion.span
                    key={i}
                    custom={i}
                    variants={dotVariants}
                    animate="animate"
                    className="w-1.5 h-1.5 rounded-full bg-white"
                />
            ))}
        </div>
    );
};

export default TypingDots;