
"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Logo } from "./logo";

type Circle = { id: number; name: string; image: string };

const SHELL_CAPACITIES = [4, 6, 8, 10, 12];

const getElectronConfiguration = (electrons: number) => {
    const shells: number[] = [];
    let remainingElectrons = electrons;
    for (const capacity of SHELL_CAPACITIES) {
        if (remainingElectrons === 0) break;
        const electronsInShell = Math.min(remainingElectrons, capacity);
        shells.push(electronsInShell);
        remainingElectrons -= electronsInShell;
    }
    // If there are more electrons than total capacity, add them to the last shell
    if (remainingElectrons > 0) {
        if (shells.length > 0) {
            shells[shells.length - 1] += remainingElectrons;
        } else {
            shells.push(remainingElectrons);
        }
    }
    return shells;
};

interface AtomicConnectionCirclesProps {
  circles: Circle[];
  onCircleSelect: (circle: Circle | null) => void;
}

export default function AtomicConnectionCircles({ circles, onCircleSelect }: AtomicConnectionCirclesProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedDialogCircle, setSelectedDialogCircle] = useState<Circle | null>(null);

  const shells = useMemo(() => getElectronConfiguration(circles.length), [circles.length]);

  const distributedCircles = useMemo(() => {
    const rings: Circle[][] = [];
    let circlesCopy = [...circles];
    for (const count of shells) {
      if (circlesCopy.length === 0) break;
      const ringCircles = circlesCopy.splice(0, count);
      rings.push(ringCircles);
    }
    return rings;
  }, [circles, shells]);
  
  useEffect(() => {
    // Auto-expand on load for demonstration
    const timer = setTimeout(() => setIsExpanded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleCircleClick = (circle: Circle) => {
    setSelectedDialogCircle(circle);
    onCircleSelect(circle);
  }

  const NUCLEUS_SIZE = 120;
  const ELECTRON_SIZE = 60;
  const BASE_RADIUS = 120;
  const RADIUS_INCREMENT = 80;

  const containerSize = (BASE_RADIUS + (distributedCircles.length - 1) * RADIUS_INCREMENT) * 2 + ELECTRON_SIZE * 2;
  
  return (
    <>
      <div 
          className="relative flex items-center justify-center transition-all duration-500" 
          style={{ height: containerSize, width: containerSize }}
      >
        {/* Electrons (Circles) */}
        {distributedCircles.map((ring, ringIndex) => {
          const radius = BASE_RADIUS + ringIndex * RADIUS_INCREMENT;
          return ring.map((circle, circleIndex) => {
            const angle = (circleIndex / ring.length) * 2 * Math.PI - (Math.PI / 2);
            
            return (
              <motion.button
                key={circle.id}
                onClick={() => handleCircleClick(circle)}
                className="absolute flex flex-col items-center group cursor-pointer z-10"
                style={{ 
                  width: ELECTRON_SIZE, 
                  height: ELECTRON_SIZE,
                  top: `calc(50% - ${ELECTRON_SIZE / 2}px)`,
                  left: `calc(50% - ${ELECTRON_SIZE / 2}px)`,
                }}
                initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                animate={{
                    x: isExpanded ? radius * Math.cos(angle) : 0,
                    y: isExpanded ? radius * Math.sin(angle) : 0,
                    scale: isExpanded ? 1 : 0,
                    opacity: isExpanded ? 1 : 0
                }}
                transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                    delay: isExpanded ? ringIndex * 0.1 + circleIndex * 0.05 : 0
                }}
              >
                <div className="relative rounded-full overflow-hidden bg-muted shadow-lg w-full h-full border-2 border-primary/50">
                  <Image src={circle.image} alt={circle.name} fill style={{ objectFit: 'cover' }} />
                </div>
              </motion.button>
            );
          });
        })}

        {/* Nucleus */}
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute z-20 rounded-full bg-background shadow-2xl cursor-pointer flex items-center justify-center"
          style={{ 
              width: NUCLEUS_SIZE, 
              height: NUCLEUS_SIZE,
              top: `calc(50% - ${NUCLEUS_SIZE / 2}px)`,
              left: `calc(50% - ${NUCLEUS_SIZE / 2}px)`
          }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
          aria-expanded={isExpanded}
        >
          <Logo className="h-20 w-20 text-primary" />
        </motion.button>
      </div>

      <Dialog open={!!selectedDialogCircle} onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedDialogCircle(null);
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Connection Details</DialogTitle>
            <DialogDescription>
              Information about your connection with {selectedDialogCircle?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-4 py-4">
            <div className="relative w-24 h-24 rounded-full overflow-hidden">
                {selectedDialogCircle && <Image src={selectedDialogCircle.image} alt={selectedDialogCircle.name} fill style={{ objectFit: 'cover' }} />}
            </div>
            <span className="text-2xl font-bold">{selectedDialogCircle?.name}</span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
