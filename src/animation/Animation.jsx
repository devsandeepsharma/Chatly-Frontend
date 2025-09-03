export const cardVariant = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 240, damping: 20 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.18 } }
};

export const stepTransition = {
    type: 'tween', duration: 0.28
}