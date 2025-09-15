export const cardVariant = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 240, damping: 20 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.18 } }
};

export const stepTransition = {
    type: 'tween', duration: 0.28
}

export const chatPanelvariants = {
    hidden: (dir) => ({ opacity: 0, x: dir > 0 ? 100 : -100 }),
    visible: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -100 : 100 }),
};

export const userCardVarient = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
}

export const dotVariants = {
    animate: (i) => ({
        y: [0, -4, 0],
        opacity: [0.4, 1, 0.4],
        transition: {
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
        },
    }),
};

export const bubbleVariants = {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    show: (i) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { delay: 0.2 + i * 0.25, duration: 0.6, ease: "easeOut" },
    }),
};

export const staggerContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
};

export const fadeIn = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};