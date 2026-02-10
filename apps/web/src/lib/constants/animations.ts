export const pageVariants = {
  enter: { x: 300, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -300, opacity: 0 }
};

export const pageTransition = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30
};

export const avatarVariants = {
  hidden: { scale: 0, rotate: -180, opacity: 0 },
  visible: {
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 200,
      damping: 20
    }
  }
};

export const cardGlowVariants = {
  initial: { boxShadow: '0 0 0 rgba(0,0,0,0)' },
  hover: {
    boxShadow: '0 0 20px rgba(73, 234, 203, 0.3)',
    scale: 1.02,
    transition: { duration: 0.2 }
  },
  tap: { scale: 0.98 }
};

export const pulseVariants = {
  initial: { scale: 1, opacity: 1 },
  animate: {
    scale: [1, 1.1, 1],
    opacity: [1, 0.8, 1],
    transition: {
      repeat: Infinity,
      duration: 2
    }
  }
};

export const slideInUp = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 100
    }
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};
