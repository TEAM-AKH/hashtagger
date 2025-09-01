"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const connections = [
  { id: 1, name: "Alice", image: "https://picsum.photos/seed/1/100", hint: "woman smiling" },
  { id: 2, name: "Bob", image: "https://picsum.photos/seed/2/100", hint: "man glasses" },
  { id: 3, name: "Charlie", image: "https://picsum.photos/seed/3/100", hint: "person nature" },
  { id: 4, name: "Diana", image: "https://picsum.photos/seed/4/100", hint: "woman city" },
  { id: 5, name: "Eve", image: "https://picsum.photos/seed/5/100", hint: "man laughing" },
  { id: 6, name: "Frank", image: "https://picsum.photos/seed/6/100", hint: "person reading" },
];

const CIRCLE_SIZE = 80;
const MAIN_CIRCLE_SIZE = 120;
const RADIUS = 180;

export default function ConnectionCircles() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative flex items-center justify-center" style={{ height: RADIUS * 2, width: RADIUS * 2 }}>
      {connections.map((conn, index) => {
        const angle = (index / connections.length) * 2 * Math.PI;
        const x = isExpanded ? RADIUS * Math.cos(angle) : 0;
        const y = isExpanded ? RADIUS * Math.sin(angle) : 0;
        
        return (
          <div
            key={conn.id}
            className="absolute flex flex-col items-center group cursor-pointer transition-all duration-500 ease-in-out"
            style={{ 
              width: CIRCLE_SIZE, 
              height: CIRCLE_SIZE + 20,
              transform: `translate(${x}px, ${y}px) scale(${isExpanded ? 1 : 0})`,
              opacity: isExpanded ? 1 : 0,
              transitionDelay: `${isExpanded ? index * 50 : (connections.length - index) * 50}ms`,
            }}
          >
            <div className="relative rounded-full overflow-hidden border-4 border-accent/50 shadow-lg" style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}>
              <Image src={conn.image} alt={conn.name} fill style={{ objectFit: 'cover' }} data-ai-hint={conn.hint} />
            </div>
            <span className="mt-2 text-sm font-medium text-foreground opacity-0 group-hover:opacity-100 transition-opacity">{conn.name}</span>
          </div>
        );
      })}

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
            "absolute z-10 rounded-full bg-card shadow-xl overflow-hidden cursor-pointer border-4 flex items-center justify-center text-muted-foreground hover:border-primary transition-all duration-300",
            isExpanded ? "border-primary" : "border-primary/50"
        )}
        style={{ width: MAIN_CIRCLE_SIZE, height: MAIN_CIRCLE_SIZE }}
        aria-expanded={isExpanded}
      >
        <div className="relative w-full h-full group">
            <Image src="https://picsum.photos/seed/user/120" alt="Your Profile" fill style={{ objectFit: 'cover' }} data-ai-hint="person selfie" />
            <div className={cn(
                "absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity duration-300",
                isExpanded ? "opacity-0" : "opacity-100 group-hover:bg-black/40"
            )}>
                <span className="text-white font-bold text-sm">Click Me</span>
            </div>
        </div>
      </button>
    </div>
  );
}
