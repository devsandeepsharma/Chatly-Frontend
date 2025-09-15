import ChatBubble from "../chats/ChatBubble";

import { motion } from "motion/react";
import { staggerContainer } from "../../animation/Animation";

const ChatDemo = () => {
    const messages = [
        { side: "left", text: "Hey! Welcome to Chatly 👋" },
        { side: "right", text: "Looks sleek. Is it real-time?" },
        { side: "left", text: "Instant. Groups, guests, everything ⚡" },
    ];

    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            className="relative rounded-2xl p-4 sm:p-6 md:p-8 bg-white/80 backdrop-blur border border-gray-200/80 shadow-2xl
                       w-full max-w-full sm:max-w-md mx-auto"
        >
            <div className="flex items-center gap-2 pb-4">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="h-3 w-3 rounded-full bg-green-400" />
            </div>

            <div className="flex flex-col gap-3">
                {messages.map((msg, i) => (
                    <ChatBubble key={i} i={i} side={msg.side} text={msg.text} />
                ))}
                <ChatBubble i={messages.length} side="left" isTyping />
            </div>
        </motion.div>
    );
};

export default ChatDemo;