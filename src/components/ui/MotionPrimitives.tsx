import { motion, MotionProps, HTMLMotionProps, Variants } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import React from 'react';

// Utility for merging tailwind classes
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Standard Animation Variants
export const FADE_IN_VARIANTS: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } },
};

export const SLIDE_UP_VARIANTS: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

export const SLIDE_IN_RIGHT_VARIANTS: Variants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } },
};

export const SHAKE_VARIANTS: Variants = {
    initial: { x: 0 },
    animate: {
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.4 }
    },
};

export const BOUNCE_VARIANTS: Variants = {
    initial: { scale: 1 },
    animate: {
        scale: [1, 1.2, 0.9, 1.1, 1],
        transition: { duration: 0.5 }
    }
};

export const PAGE_TRANSITION_VARIANTS: Variants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
};

export const STAGGER_CHILDREN_VARIANTS: Variants = {
    visible: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

// Reusable Motion Components

interface MotionDivProps extends HTMLMotionProps<'div'> {
    className?: string;
    delay?: number;
}

export const MotionDiv: React.FC<MotionDivProps> = ({
    children,
    className,
    variants = FADE_IN_VARIANTS,
    initial = 'hidden',
    animate = 'visible',
    exit = 'exit',
    delay,
    ...props
}) => {
    const transition = delay ? { delay } : undefined;

    return (
        <motion.div
            className={cn(className)}
            variants={variants}
            initial={initial}
            animate={animate}
            exit={exit}
            transition={transition}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export const PageTransition: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className
}) => {
    return (
        <motion.div
            className={cn(className)}
            variants={PAGE_TRANSITION_VARIANTS}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            {children}
        </motion.div>
    );
};

// Micro-interaction wrappers

export const HoverScale: React.FC<{ children: React.ReactNode; className?: string; scale?: number }> = ({
    children,
    className,
    scale = 1.05
}) => {
    return (
        <motion.div
            className={cn("inline-block", className)}
            whileHover={{ scale }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
            {children}
        </motion.div>
    );
};

export const HoverLift: React.FC<{ children: React.ReactNode; className?: string; y?: number }> = ({
    children,
    className,
    y = -5
}) => {
    return (
        <motion.div
            className={cn(className)}
            whileHover={{ y }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
            {children}
        </motion.div>
    );
};
