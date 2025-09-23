
'use client';
import { useState, useId } from 'react';
import { motion } from 'framer-motion';

export const VibeButton = ({ showLabel = true }: { showLabel?: boolean }) => {
    const [isChecked, setIsChecked] = useState(false);
    const uniqueId = useId();
  
    return (
        <motion.div 
            className="relative flex items-center"
            whileHover={showLabel ? "hover" : ""}
        >
            <input 
                id={uniqueId}
                type="checkbox" 
                className="absolute opacity-0 w-full h-full cursor-pointer z-10"
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
            />
            <label htmlFor={uniqueId} className="icons flex items-center justify-center gap-2 h-9 w-auto px-3 rounded-full transition-colors hover:text-primary cursor-pointer">
                <div className="relative w-6 h-6">
                    <div id="icon-like-regular" className="absolute inset-0 transition-all duration-300" style={{ transform: isChecked ? 'scale(0)' : 'scale(1)'}}>
                        <span className="text-2xl">🥂</span>
                    </div>
                    <div id="icon-like-solid" className="absolute inset-0 transition-all duration-300" style={{ transform: isChecked ? 'scale(1.2)' : 'scale(0)', filter: isChecked ? `drop-shadow(0 0 4px hsl(var(--primary)))` : 'none' }}>
                       <span className="text-2xl">🥂</span>
                    </div>
                </div>
                 {showLabel && (
                    <motion.span 
                        className="font-semibold"
                        initial={{ width: 0, opacity: 0, marginLeft: 0 }}
                        variants={{
                            hover: { width: "auto", opacity: 1, marginLeft: 4 }
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        Vibe
                    </motion.span>
                 )}
            </label>
            <div className="fireworks absolute inset-0 pointer-events-none">
                {isChecked && Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="checked-like-fx" style={{ transform: `rotate(${i * 36}deg)` }} />
                ))}
            </div>
        </motion.div>
    );
};
