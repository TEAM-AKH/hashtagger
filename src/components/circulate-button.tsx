
'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const CirculateIcon = ({ isHovered }: { isHovered: boolean }) => {
  const iconVariants = {
    rest: { rotate: 0 },
    hover: { rotate: 360, transition: { duration: 1.5, ease: 'linear', repeat: Infinity } },
  };

  const pathVariants = (delay: number) => ({
    rest: {
      opacity: 0,
      pathLength: 0,
    },
    hover: {
      opacity: 1,
      pathLength: 1,
      transition: {
        pathLength: { delay, duration: 0.4, ease: 'easeOut' },
        opacity: { delay, duration: 0.01 },
      },
    },
  });
  
  const circleVariants = (delay: number) => ({
    rest: { scale: 1, filter: 'brightness(1)' },
    hover: { 
        scale: [1, 1.2, 1], 
        filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)'],
        transition: { delay, duration: 0.5, ease: 'circOut' }
    },
  });

  return (
    <motion.svg
      width="24"
      height="24"
      viewBox="0 0 55 55"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
      variants={iconVariants}
      animate={isHovered ? 'hover' : 'rest'}
    >
      <g>
        {/* Paths */}
        <motion.path
          d="M45.6,20.5a18.5,18.5,0,0,1-23,26.7"
          stroke="currentColor" strokeWidth="6" strokeLinecap="round"
          variants={pathVariants(0)}
        />
        <motion.path
          d="M9.4,34.5A18.5,18.5,0,0,1,32.4,7.8"
          stroke="currentColor" strokeWidth="6" strokeLinecap="round"
          variants={pathVariants(0.2)}
        />
        <motion.path
          d="M22.6,47.2a18.5,18.5,0,0,1,10.2-39.4"
          stroke="currentColor" strokeWidth="6" strokeLinecap="round"
          variants={pathVariants(0.1)}
        />

        {/* Circles */}
        <motion.circle cx="13" cy="19" r="6" fill="currentColor" variants={circleVariants(0)} />
        <motion.circle cx="42" cy="36" r="6" fill="currentColor" variants={circleVariants(0.1)} />
        <motion.circle cx="27.5" cy="48" r="6" fill="currentColor" variants={circleVariants(0.2)} />
      </g>
    </motion.svg>
  );
};


export const CirculateButton = ({ showLabel = true }: { showLabel?: boolean }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={showLabel ? "hover" : ""}
      className="relative flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2 px-3 rounded-full"
    >
      <CirculateIcon isHovered={isHovered} />
       {showLabel && (
        <motion.span 
            className="font-semibold"
            initial={{ width: 0, opacity: 0, marginLeft: 0 }}
            variants={{
                hover: { width: "auto", opacity: 1, marginLeft: 4 }
            }}
            transition={{ duration: 0.3 }}
        >
            Circulate
        </motion.span>
       )}
    </motion.button>
  );
};
