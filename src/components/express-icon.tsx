
'use client';

import { motion } from 'framer-motion';

export const ExpressIcon = ({ isHovered, isStatic = false, isEnlarged = false }: { isHovered?: boolean, isStatic?: boolean, isEnlarged?: boolean }) => {
    const shouldAnimate = !isStatic && isHovered;
    const size = isEnlarged ? 32 : 24;

    return (
        <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="url(#grad)"
            stroke="hsl(var(--card))"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-sm"
            animate={shouldAnimate ? { scale: 1.1, rotate: -5 } : { scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
        >
            <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="var(--express-grad-start)" />
                    <stop offset="100%" stopColor="var(--express-grad-end)" />
                </linearGradient>
            </defs>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <motion.path 
                d="M7 8l5 3.5 5-3.5" 
                stroke="hsl(var(--primary))" 
                initial={{ y: -2, opacity: 0 }}
                animate={{ y: shouldAnimate ? 0 : -2, opacity: shouldAnimate ? 1: 0 }}
                transition={{ delay: 0.1 }}
            />
             <motion.rect
                x="7"
                y="7"
                width="10"
                height="6"
                rx="1"
                ry="1"
                fill="hsl(var(--card))"
                stroke="none"
                initial={{ height: 6 }}
                animate={{ height: shouldAnimate ? 0 : 6 }}
                transition={{ duration: 0.2 }}
            />
        </motion.svg>
    );
};
