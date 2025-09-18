
'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

export const VibeButton = () => {
    const [isChecked, setIsChecked] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
  
    return (
        <motion.div 
            className="relative flex items-center"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            <input 
                id={`like-checkbox-${Math.random()}`}
                type="checkbox" 
                className="absolute opacity-0 w-full h-full cursor-pointer z-10"
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
            />
            <div className="icons flex items-center justify-center h-9 w-auto px-3 rounded-full transition-colors hover:text-primary">
                <div className="relative w-6 h-6">
                    <div id="icon-like-regular" className="absolute inset-0 transition-all duration-300" style={{ transform: isChecked ? 'scale(0)' : 'scale(1)'}}>
                        <span className="text-2xl">🥂</span>
                    </div>
                    <div id="icon-like-solid" className="absolute inset-0 transition-all duration-300" style={{ transform: isChecked ? 'scale(1.2)' : 'scale(0)', filter: isChecked ? `drop-shadow(0 0 4px hsl(var(--primary)))` : 'none' }}>
                       <span className="text-2xl">🥂</span>
                    </div>
                </div>
                 <motion.span
                    initial={{ width: 0, opacity: 0, x: -10 }}
                    animate={{ 
                        width: isHovered ? 'auto' : 0, 
                        opacity: isHovered ? 1 : 0,
                        x: isHovered ? 0 : -10
                    }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="overflow-hidden whitespace-nowrap text-muted-foreground group-hover:text-primary font-medium"
                >
                    Vibe
                </motion.span>
            </div>
            <div className="fireworks absolute inset-0 pointer-events-none">
                {isChecked && Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="checked-like-fx" style={{ transform: `rotate(${i * 36}deg)` }} />
                ))}
            </div>
        </motion.div>
    );
};
