
"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo } from "./logo";
import { MoreVertical, UserPlus, Edit, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type Circle = { id: number; name: string; image: string; members: string[] };

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
    while (remainingElectrons > 0) {
        const capacity = SHELL_CAPACITIES[shells.length % SHELL_CAPACITIES.length];
        const electronsInShell = Math.min(remainingElectrons, capacity);
        shells.push(electronsInShell);
        remainingElectrons -= electronsInShell;
    }
    return shells;
};


interface AtomicConnectionCirclesProps {
  circles: Circle[];
  setCircles: React.Dispatch<React.SetStateAction<Circle[]>>;
}

export default function AtomicConnectionCircles({ circles, setCircles }: AtomicConnectionCirclesProps) {
  const [isBreathing, setIsBreathing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedCircle, setSelectedCircle] = useState<Circle | null>(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState("");
  const [hoveredCircleId, setHoveredCircleId] = useState<number | null>(null);
  
  const randomAnglesRef = useRef<Map<number, number[]>>(new Map());

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
    distributedCircles.forEach((ring, ringIndex) => {
        const key = ring.map(c => c.id).join('-');
        if (!randomAnglesRef.current.has(ringIndex)) {
            const angles = ring.map(() => Math.random() * 2 * Math.PI);
            randomAnglesRef.current.set(ringIndex, angles);
        } else {
            const existingAngles = randomAnglesRef.current.get(ringIndex)!;
            if (existingAngles.length < ring.length) {
                const newAngles = Array.from({ length: ring.length - existingAngles.length }, () => Math.random() * 2 * Math.PI);
                randomAnglesRef.current.set(ringIndex, [...existingAngles, ...newAngles]);
            }
        }
    });
  }, [distributedCircles]);

  const handleBreathingAnimation = () => {
    setIsBreathing(prev => !prev);
  };
  
  const handleRemoveCircle = (id: number) => {
    setCircles(prev => prev.filter(c => c.id !== id));
    setSelectedCircle(null);
  };

  const handleRenameCircle = () => {
      if (selectedCircle && newName) {
          setCircles(prev => prev.map(c => c.id === selectedCircle.id ? { ...c, name: newName } : c));
          setSelectedCircle(prev => prev ? { ...prev, name: newName } : null);
          setIsRenaming(false);
          setNewName("");
      }
  };

  const NUCLEUS_SIZE = 120;
  const BASE_RADIUS = 120;
  const RADIUS_INCREMENT = 80;
  const MAX_ELECTRON_SIZE = 60;

  const containerSize = (BASE_RADIUS + (distributedCircles.length - 1) * RADIUS_INCREMENT) * 2 + MAX_ELECTRON_SIZE * 2;
  
  return (
    <>
      <div 
          className="relative flex items-center justify-center transition-all duration-500" 
          style={{ height: containerSize, width: containerSize }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
      >
        {/* Electrons (Circles) */}
        {distributedCircles.map((ring, ringIndex) => {
          const radius = BASE_RADIUS + ringIndex * RADIUS_INCREMENT;
          const duration = 20 + ringIndex * 10;
          const ringAngles = randomAnglesRef.current.get(ringIndex) || [];
          const electronSize = Math.max(MAX_ELECTRON_SIZE - ringIndex * 8, 20);

          return (
            <motion.div
              key={ringIndex}
              className="absolute w-full h-full"
              style={{ originX: '50%', originY: '50%'}}
              animate={{ rotate: 360 }}
              transition={{
                  ease: "linear",
                  duration: duration,
                  repeat: Infinity,
                  repeatType: "loop",
              }}
            >
             <motion.div 
                className="absolute w-full h-full"
                style={{
                    animationPlayState: isPaused ? 'paused' : 'running',
                }}
             >
              {ring.map((circle, circleIndex) => {
                const angle = ringAngles[circleIndex] || 0;
                const x = radius * Math.cos(angle);
                const y = radius * Math.sin(angle);
                
                return (
                  <motion.div
                    key={circle.id}
                    className="absolute flex flex-col items-center group cursor-pointer z-10"
                    style={{ 
                      width: electronSize, 
                      height: electronSize,
                      top: `calc(50% - ${electronSize / 2}px)`,
                      left: `calc(50% - ${electronSize / 2}px)`,
                    }}
                    initial={{ x: 0, y: 0, scale: 0 }}
                    animate={{
                        x: isBreathing ? x : 0,
                        y: isBreathing ? y : 0,
                        scale: isBreathing ? 1 : 0
                    }}
                    whileHover={{ scale: 1.2, zIndex: 50 }}
                    transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 15,
                        delay: ringIndex * 0.1 + circleIndex * 0.05
                    }}
                    onHoverStart={() => setHoveredCircleId(circle.id)}
                    onHoverEnd={() => setHoveredCircleId(null)}
                  >
                    <motion.button 
                        onClick={() => setSelectedCircle(circle)}
                        className="relative rounded-full overflow-hidden bg-muted shadow-lg w-full h-full border-2 border-primary/50"
                    >
                      <Image src={circle.image} alt={circle.name} fill style={{ objectFit: 'cover' }} />
                    </motion.button>
                    <AnimatePresence>
                    {hoveredCircleId === circle.id && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-full mt-2 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded-md whitespace-nowrap"
                        >
                            <motion.span
                                style={{
                                    display: 'inline-block',
                                    transformOrigin: 'center center',
                                }}
                                animate={{ rotate: -360 }}
                                transition={{
                                    ease: "linear",
                                    duration: duration,
                                    repeat: Infinity,
                                    repeatType: "loop",
                                }}
                            >
                                {circle.name}
                            </motion.span>
                        </motion.div>
                    )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
              </motion.div>
            </motion.div>
          );
        })}

        {/* Nucleus */}
        <motion.button
          onClick={handleBreathingAnimation}
          className="absolute z-20 rounded-full bg-background shadow-2xl flex items-center justify-center cursor-pointer"
          style={{ 
              width: NUCLEUS_SIZE, 
              height: NUCLEUS_SIZE,
              top: `calc(50% - ${NUCLEUS_SIZE / 2}px)`,
              left: `calc(50% - ${NUCLEUS_SIZE / 2}px)`
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Logo className="h-20 w-20 text-primary" />
        </motion.button>
      </div>

      <Dialog open={!!selectedCircle} onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedCircle(null);
            setIsRenaming(false);
          }
      }}>
        <DialogContent className="sm:max-w-md">
           <DialogHeader className="flex-row items-start justify-between">
              <div className="flex items-center gap-4">
                 <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                    {selectedCircle && <Image src={selectedCircle.image} alt={selectedCircle.name} fill style={{ objectFit: 'cover' }} />}
                 </div>
                 <div>
                    <DialogTitle className="text-2xl">{selectedCircle?.name}</DialogTitle>
                    <DialogDescription>
                        {selectedCircle?.members.length} members
                    </DialogDescription>
                 </div>
              </div>
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreVertical />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onSelect={() => {
                        setIsRenaming(true)
                        setNewName(selectedCircle?.name || '');
                    }}>
                        <Edit className="mr-2"/> Rename Circle
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => selectedCircle && handleRemoveCircle(selectedCircle.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                        <Trash2 className="mr-2"/> Remove Circle
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
           </DialogHeader>
            
            {isRenaming ? (
                 <div className="grid gap-4 py-4">
                    <Label htmlFor="rename" className="text-left">New Name</Label>
                    <Input id="rename" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Enter new name" />
                     <div className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={() => setIsRenaming(false)}>Cancel</Button>
                        <Button onClick={handleRenameCircle}>Save</Button>
                    </div>
                </div>
            ) : (
                <>
                <div className="py-4 space-y-4">
                    <div className="flex justify-between items-center">
                        <h4 className="font-semibold">Members</h4>
                        {circles.findIndex(c => c.id === selectedCircle?.id) >= 4 && (
                          <Button variant="outline" size="sm"><UserPlus className="mr-2"/>Add</Button>
                        )}
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {selectedCircle?.members.map(member => (
                            <div key={member} className="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                    {member.charAt(0)}
                                </div>
                                <span>{member}</span>
                            </div>
                        ))}
                         {selectedCircle?.members.length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-4">No members yet.</p>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                    <Button type="button" variant="secondary">
                        Close
                    </Button>
                    </DialogClose>
                </DialogFooter>
                </>
            )}
        </DialogContent>
      </Dialog>
    </>
  );
}
