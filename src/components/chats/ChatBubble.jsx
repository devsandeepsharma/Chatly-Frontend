import { motion } from "motion/react";
import { bubbleVariants } from "../../animation/Animation";

import TypingDots from "./TypingDots";
import { formatTime } from "../../utils/formatTime";
import { MessageCircle } from "lucide-react";

const ChatBubble = ({ text = "", time = "", side = "left", i = 0, isTyping = false }) => {
    return (
        <motion.div
            custom={i}
            variants={bubbleVariants}
            initial="hidden"
            animate="show"
            className={`max-w-[80%] w-fit rounded-xl px-4 py-2 text-sm shadow-lg ${side === "left"
                ? "bg-gradient-to-br from-[#00BFA6] to-[#0AE2C3] text-white self-start"
                : "bg-white text-gray-800 border border-gray-100/60 self-end"
                }`}
        >
            {isTyping ? (
                <TypingDots />
            ) : (
                <>
                    <span>{text}</span>
                    {time && (
                        <span
                            className={`text-xs ml-2 mt-1 ${
                                side === "left" 
                                    ? "text-white/80"
                                    : "text-gray-500"
                            }`}
                        >
                            {formatTime(time)}
                        </span>
                    )}
                </>
            )}
        </motion.div>
    );
};

export default ChatBubble;