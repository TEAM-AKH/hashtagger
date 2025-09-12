
'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const initialCircles = [
  { id: 1, name: "Project Team", image: "https://picsum.photos/seed/1/100" },
  { id: 2, name: "Close Friends", image: "https://picsum.photos/seed/2/100" },
  { id: 3, name: "Gaming Squad", image: "https://picsum.photos/seed/3/100" },
  { id: 4, name: "Family", image: "https://picsum.photos/seed/4/100" },
  { id: 5, name: "Book Club", image: "https://picsum.photos/seed/5/100" },
  { id: 6, name: "Hiking Group", image: "https://picsum.photos/seed/6/100" },
];

export default function ConnectionsPage() {
  const [items, setItems] = useState(initialCircles);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Ring limits: 4, 6, 8, 10, 12
  const ringLimits = [4, 6, 8, 10, 12];

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

  const addCircle = () => {
    const newId = items.length + 1;
    const newCircle = {
      id: newId,
      name: `New Circle ${newId}`,
      image: `https://picsum.photos/seed/${newId}/100`,
    };
    setItems([...items, newCircle]);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] bg-background overflow-hidden">
      <div className="text-center mb-4 z-10">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 pb-2">
          Your Connection Orbit
        </h1>
        <p className="max-w-[600px] text-muted-foreground md:text-xl">
          A dynamic, atomic view of your social universe.
        </p>
      </div>
      <Button onClick={addCircle} className="mb-4 z-10">
        <Plus className="mr-2 h-4 w-4" /> Add Circle
      </Button>

      <div className="relative w-[700px] h-[700px] flex items-center justify-center">
        {/* Central Circle */}
        <motion.div
          className="absolute w-28 h-28 rounded-full flex items-center justify-center bg-card shadow-xl border-4 border-primary/50 z-20 cursor-pointer"
          onClick={toggleCollapse}
          whileHover={{ scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Logo className="h-20 w-20" />
        </motion.div>

        {/* Orbiting Rings */}
        <AnimatePresence>
          {rings.map((ring, ringIndex) => {
            const radius = 120 + ringIndex * 90;
            const size = 80 - ringIndex * 8;
            const duration = 20 + ringIndex * 10;
            const direction = ringIndex % 2 === 0 ? 1 : -1;

            return (
              <motion.div
                key={ringIndex}
                className="absolute"
                style={{ width: radius * 2, height: radius * 2 }}
                animate={{ rotate: 360 * direction }}
                transition={{
                  repeat: Infinity,
                  duration: duration,
                  ease: "linear",
                }}
              >
                {ring.map((item, i) => {
                  const angle = (i / ring.length) * 2 * Math.PI;
                  const x = (radius - size / 2) + radius * Math.cos(angle);
                  const y = (radius - size / 2) + radius * Math.sin(angle);
                  
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      className="absolute flex items-center justify-center rounded-full border-4 border-primary/30 bg-background shadow-md overflow-hidden"
                      initial={{
                        width: size,
                        height: size,
                        left: '50%',
                        top: '50%',
                        x: '-50%',
                        y: '-50%',
                        opacity: 0,
                      }}
                      animate={{
                        width: size,
                        height: size,
                        left: isCollapsed ? '50%' : x,
                        top: isCollapsed ? '50%' : y,
                        x: isCollapsed ? '-50%' : 0,
                        y: isCollapsed ? '-50%' : 0,
                        opacity: 1,
                        rotate: -360 * direction,
                      }}
                      exit={{
                        opacity: 0,
                        width: 0,
                        height: 0,
                      }}
                      transition={{
                        layout: { type: 'spring', stiffness: 200, damping: 20 },
                        opacity: { duration: 0.3 },
                        rotate: { repeat: Infinity, duration: duration, ease: "linear" }
                      }}
                      whileHover={{ scale: 1.1, zIndex: 20, shadow: "0 0 15px hsl(var(--primary))" }}
                    >
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </motion.div>
                  );
                })}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
