
'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Logo } from '@/components/logo';

const initialCircles = [
  { id: 1, name: "Project Team", image: "https://picsum.photos/seed/1/100", members: ["Dave", "Eli", "George", "Heidi"] },
  { id: 2, name: "Close Friends", image: "https://picsum.photos/seed/2/100", members: ["Frank", "Grace", "Ivan"] },
  { id: 3, name: "Gaming Squad", image: "https://picsum.photos/seed/3/100", members: ["Judy", "Karl", "Liam", "Mia"] },
  { id: 4, name: "Family", image: "https://picsum.photos/seed/4/100", members: ["Nathan", "Olivia", "Paul"] },
  { id: 5, name: "Book Club", image: "https://picsum.photos/seed/5/100", members: ["Quinn", "Rachel"] },
  { id: 6, name: "Hiking Group", image: "https://picsum.photos/seed/6/100", members: ["Sam", "Tina", "Uma"] },
  { id: 7, name: "Work", image: "https://picsum.photos/seed/7/100", members: [] },
  { id: 8, name: "Mentors", image: "https://picsum.photos/seed/8/100", members: [] },
  { id: 9, name: "Neighbors", image: "https://picsum.photos/seed/9/100", members: [] },
  { id: 10, name: "Art Class", image: "https://picsum.photos/seed/10/100", members: [] },
];

export default function ConnectionsPage() {
  const [items] = useState(initialCircles);

  // Ring limits: 4, 6, 8, 10, 12
  const ringLimits = [4, 6, 8, 10, 12];

  // Distribute items across rings
  const rings = useMemo(() => {
    let distributedRings = [];
    let index = 0;
    for (let i = 0; i < ringLimits.length; i++) {
      const slice = items.slice(index, index + ringLimits[i]);
      if (slice.length > 0) {
        distributedRings.push(slice);
      }
      index += ringLimits[i];
    }
    return distributedRings;
  }, [items]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] bg-background overflow-hidden">
        <div className="text-center mb-8 z-10">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 pb-2">
                Your Connection Orbit
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
                A dynamic, atomic view of your social universe.
            </p>
        </div>
      <div className="relative w-[700px] h-[700px] flex items-center justify-center">
        
        {/* Central Circle */}
        <div className="absolute w-28 h-28 rounded-full flex items-center justify-center bg-card shadow-xl border-4 border-primary/50 z-10">
          <Logo className="h-20 w-20" />
        </div>

        {/* Orbiting Rings */}
        {rings.map((ring, ringIndex) => {
          const radius = 120 + ringIndex * 90; // Distance from center
          const size = 80 - ringIndex * 8; // Decrease size for outer rings
          return (
            <motion.div
              key={ringIndex}
              className="absolute w-full h-full"
              style={{ width: radius * 2, height: radius * 2 }}
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 20 + ringIndex * 5,
                ease: "linear",
              }}
            >
              {ring.map((item, i) => {
                const angle = (i / ring.length) * 2 * Math.PI;
                // We calculate position based on the parent div's size
                const x = (radius - size / 2) + radius * Math.cos(angle);
                const y = (radius - size / 2) + radius * Math.sin(angle);
                return (
                  <motion.div
                    key={item.id}
                    className="absolute flex items-center justify-center rounded-full border-4 border-primary/30 bg-background shadow-md overflow-hidden"
                    style={{
                      width: size,
                      height: size,
                      left: x,
                      top: y,
                    }}
                    whileHover={{ scale: 1.1, zIndex: 20, shadow: "0 0 15px hsl(var(--primary))" }}
                    // Counter-rotate the item to keep it upright
                    animate={{ rotate: -360 }}
                    transition={{
                        repeat: Infinity,
                        duration: 20 + ringIndex * 5,
                        ease: "linear",
                    }}
                  >
                     <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </motion.div>
                );
              })}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
