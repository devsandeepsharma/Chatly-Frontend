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