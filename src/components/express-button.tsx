
'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';

const letterVariants = {
  closed: { rotateX: 0 },
  open: { rotateX: 180, transition: { duration: 0.4, ease: 'easeInOut' } },
};

const flapVariants = {
  closed: { rotateX: 0, y: 0 },
  open: { rotateX: -180, y: -2, transition: { duration: 0.4, ease: 'easeInOut' } },
};

const ExpressIcon = ({ isToggled }: { isToggled: boolean }) => {
  return (
    <motion.div
      className="relative w-7 h-7"
      animate={isToggled ? 'open' : 'closed'}
    >
      {/* Back of envelope */}
      <motion.div className="absolute inset-0 bg-card border rounded-md" />
      
      {/* Letter inside */}
      <motion.div 
        className="absolute inset-x-1 top-2 h-4 bg-primary/20 rounded-sm"
        initial={{ y: 20 }}
        variants={{ closed: { y: 20 }, open: { y: 0 } }}
        transition={{ delay: 0.2 }}
      />

      {/* Flap */}
      <motion.div
        className="absolute inset-x-0 top-0 h-1/2"
        style={{ perspective: 100, transformOrigin: 'top' }}
        variants={flapVariants}
      >
        <div className="absolute inset-0 bg-card border-b rounded-t-md" />
        <div 
            className="absolute inset-0"
            style={{
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                background: 'linear-gradient(to bottom, hsl(var(--border)), hsl(var(--card)))'
            }}
        />
      </motion.div>

       {/* Front of envelope */}
       <motion.div
            className="absolute inset-0"
            style={{
                clipPath: 'polygon(0 0, 100% 0, 50% 50%, 0 100%, 100% 100%, 50% 50%)',
                background: 'linear-gradient(to bottom, hsl(var(--card)), hsl(var(--border)))'
            }}
        />
        
       {/* Emoji */}
       <motion.div 
        className="absolute inset-0 flex items-center justify-center"
        initial={false}
        animate={{ opacity: isToggled ? 0 : 1 }}
        transition={{ delay: isToggled ? 0 : 0.3 }}
       >
         <span className="text-lg">💌</span>
       </motion.div>
    </motion.div>
  );
};


export const ExpressButton = ({ isToggled, onToggle }: { isToggled: boolean, onToggle: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onClick={onToggle}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2 px-3 rounded-full"
      aria-label="Express"
    >
      <ExpressIcon isToggled={isToggled} />
      <motion.span
        initial={{ width: 0, opacity: 0, x: -10 }}
        animate={{ 
            width: isHovered ? 'auto' : 0, 
            opacity: isHovered ? 1 : 0,
            x: isHovered ? 0 : -10
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="overflow-hidden whitespace-nowrap"
      >
        Express
      </motion.span>
    </motion.button>
  );
};
