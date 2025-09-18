
'use client';
import { useState } from 'react';

export const VibeButton = () => {
    const [isChecked, setIsChecked] = useState(false);
  
    return (
        <div className="relative">
            <input 
                id="like-checkbox" 
                type="checkbox" 
                className="absolute opacity-0 w-full h-full cursor-pointer"
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
            />
            <div className="icons flex items-center justify-center h-9 w-9">
                <svg id="icon-like-regular" className="w-6 h-6 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                   <span className="text-2xl">🤓</span>
                </svg>
                <svg id="icon-like-solid" className="w-6 h-6 text-yellow-400" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                   <span className="text-2xl">🤓</span>
                </svg>
            </div>
            <div className="fireworks">
                {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="checked-like-fx" style={{ transform: `rotate(${i * 36}deg)` }} />
                ))}
            </div>
        </div>
    );
};

    