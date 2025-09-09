
"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

type Circle = { id: number; name: string; image: string };

const ELECTRON_SHELL_CAPACITIES = [2, 8, 8, 18, 18, 32, 32];

const periodicTable: { [key: number]: { symbol: string, name: string } } = {
  1: { symbol: 'H', name: 'Hydrogen' }, 2: { symbol: 'He', name: 'Helium' },
  3: { symbol: 'Li', name: 'Lithium' }, 4: { symbol: 'Be', name: 'Beryllium' },
  5: { symbol: 'B', name: 'Boron' }, 6: { symbol: 'C', name: 'Carbon' },
  7: { symbol: 'N', name: 'Nitrogen' }, 8: { symbol: 'O', name: 'Oxygen' },
  9: { symbol: 'F', name: 'Fluorine' }, 10: { symbol: 'Ne', name: 'Neon' },
  11: { symbol: 'Na', name: 'Sodium' }, 12: { symbol: 'Mg', name: 'Magnesium' },
  13: { symbol: 'Al', name: 'Aluminium' }, 14: { symbol: 'Si', name: 'Silicon' },
  15: { symbol: 'P', name: 'Phosphorus' }, 16: { symbol: 'S', name: 'Sulfur' },
  17: { symbol: 'Cl', name: 'Chlorine' }, 18: { symbol: 'Ar', name: 'Argon' },
  19: { symbol: 'K', name: 'Potassium' }, 20: { symbol: 'Ca', name: 'Calcium' },
  // Add more elements as needed
};

const getElementByAtomicNumber = (atomicNumber: number) => {
    return periodicTable[atomicNumber] || { symbol: '?', name: 'Unknown' };
}

const getElectronConfiguration = (electrons: number) => {
    const shells: number[] = [];
    let remainingElectrons = electrons;
    for (const capacity of ELECTRON_SHELL_CAPACITIES) {
        if (remainingElectrons === 0) break;
        const electronsInShell = Math.min(remainingElectrons, capacity);
        shells.push(electronsInShell);
        remainingElectrons -= electronsInShell;
    }
    if(remainingElectrons > 0) shells.push(remainingElectrons);
    return shells;
};

interface AtomicConnectionCirclesProps {
  circles: Circle[];
  onCircleSelect: (circle: Circle | null) => void;
}

export default function AtomicConnectionCircles({ circles, onCircleSelect }: AtomicConnectionCirclesProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedDialogCircle, setSelectedDialogCircle] = useState<Circle | null>(null);

  const { shells, element } = useMemo(() => {
    const atomicNumber = circles.length;
    const shells = getElectronConfiguration(atomicNumber);
    const element = getElementByAtomicNumber(atomicNumber);
    return { shells, element };
  }, [circles]);

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

  const handleCircleClick = (circle: Circle) => {
    setSelectedDialogCircle(circle);
    onCircleSelect(circle);
  }

  const NUCLEUS_SIZE = 140;
  const ELECTRON_SIZE = 50;
  const BASE_RADIUS = 120;
  const RADIUS_INCREMENT = 70;
  const containerSize = (BASE_RADIUS + (distributedCircles.length - 1) * RADIUS_INCREMENT) * 2 + ELECTRON_SIZE * 2;
  
  return (
    <>
      <div 
          className="relative flex items-center justify-center transition-all duration-500" 
          style={{ height: containerSize, width: containerSize }}
      >
        {/* Rings */}
        <AnimatePresence>
        {isExpanded && distributedCircles.map((_, ringIndex) => (
            <motion.div
                key={`ring-${ringIndex}`}
                className="absolute border border-[#37B7C3] rounded-full"
                initial={{ width: 0, height: 0, opacity: 0 }}
                animate={{ 
                    width: BASE_RADIUS * 2 + ringIndex * RADIUS_INCREMENT * 2, 
                    height: BASE_RADIUS * 2 + ringIndex * RADIUS_INCREMENT * 2,
                    opacity: 1
                }}
                exit={{ width: 0, height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut", delay: ringIndex * 0.1 }}
                style={{
                    top: `calc(50% - ${BASE_RADIUS + ringIndex * RADIUS_INCREMENT}px)`,
                    left: `calc(50% - ${BASE_RADIUS + ringIndex * RADIUS_INCREMENT}px)`
                }}
            />
        ))}
        </AnimatePresence>

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
                <div className="relative rounded-full overflow-hidden bg-[#088395] shadow-lg w-full h-full border-2 border-[#37B7C3]">
                  <Image src={circle.image} alt={circle.name} fill style={{ objectFit: 'cover' }} />
                </div>
              </motion.button>
            );
          });
        })}

        {/* Nucleus */}
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute z-20 rounded-full bg-[#EBF4F6] shadow-2xl cursor-pointer flex items-center justify-center text-gray-800"
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
          <div className="text-center">
            <div className="text-6xl font-serif font-bold">{element.symbol}</div>
            <AnimatePresence>
            {!isExpanded && (
                 <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-semibold"
                 >
                    {element.name}
                 </motion.div>
            )}
            </AnimatePresence>
          </div>
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
