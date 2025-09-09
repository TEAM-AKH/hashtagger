
"use client";

import { useState, useMemo, useEffect } from "react";
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
    if (remainingElectrons > 0) {
        let shellIndex = 0;
        while(remainingElectrons > 0) {
            if (shellIndex < shells.length) {
                const space = SHELL_CAPACITIES[shellIndex] - shells[shellIndex];
                const toAdd = Math.min(remainingElectrons, space);
                shells[shellIndex] += toAdd;
                remainingElectrons -= toAdd;
            } else {
                 const toAdd = Math.min(remainingElectrons, SHELL_CAPACITIES[shellIndex] || 12);
                 shells.push(toAdd);
                 remainingElectrons -= toAdd;
            }
            shellIndex++;
        }
    }
    return shells;
};

interface AtomicConnectionCirclesProps {
  circles: Circle[];
  setCircles: React.Dispatch<React.SetStateAction<Circle[]>>;
}

export default function AtomicConnectionCircles({ circles, setCircles }: AtomicConnectionCirclesProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedCircle, setSelectedCircle] = useState<Circle | null>(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState("");

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
    const timer = setTimeout(() => setIsExpanded(true), 500);
    return () => clearTimeout(timer);
  }, []);
  
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
  const ELECTRON_SIZE = 60;
  const BASE_RADIUS = 120;
  const RADIUS_INCREMENT = 80;

  const containerSize = (BASE_RADIUS + (distributedCircles.length - 1) * RADIUS_INCREMENT) * 2 + ELECTRON_SIZE * 2;
  
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

          return (
            <motion.div
              key={ringIndex}
              className="absolute w-full h-full"
              animate={{ rotate: 360 }}
              transition={{
                ease: "linear",
                duration: duration,
                repeat: Infinity,
                repeatType: "loop",
              }}
              style={{ 
                originX: '50%', 
                originY: '50%',
                animationPlayState: isPaused ? 'paused' : 'running'
              }}
            >
             <div className="absolute w-full h-full">
              {ring.map((circle, circleIndex) => {
                const angle = (circleIndex / ring.length) * 2 * Math.PI - (Math.PI / 2);
                const x = radius * Math.cos(angle);
                const y = radius * Math.sin(angle);
                
                return (
                  <motion.button
                    key={circle.id}
                    onClick={() => setSelectedCircle(circle)}
                    className="absolute flex flex-col items-center group cursor-pointer z-10"
                    style={{ 
                      width: ELECTRON_SIZE, 
                      height: ELECTRON_SIZE,
                      top: `calc(50% - ${ELECTRON_SIZE / 2}px)`,
                      left: `calc(50% - ${ELECTRON_SIZE / 2}px)`,
                      transform: `rotate(${-360 * (isPaused ? 1 : 0)}deg)` // Counter-rotate hack
                    }}
                    initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                    animate={{
                        x: isExpanded ? x : 0,
                        y: isExpanded ? y : 0,
                        scale: isExpanded ? 1 : 0,
                        opacity: isExpanded ? 1 : 0,
                    }}
                    whileHover={{ scale: isExpanded ? 1.2 : 0, zIndex: 50 }}
                    transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 15,
                        delay: isExpanded ? ringIndex * 0.1 + circleIndex * 0.05 : 0
                    }}
                  >
                    <motion.div 
                        className="relative rounded-full overflow-hidden bg-muted shadow-lg w-full h-full border-2 border-primary/50"
                        style={{ transform: `rotate(${-(ringIndex * 360)}deg)` }} // Static image
                         animate={{ rotate: -360 }}
                         transition={{
                            ease: "linear",
                            duration: duration,
                            repeat: Infinity,
                            repeatType: "loop",
                         }}
                    >
                      <Image src={circle.image} alt={circle.name} fill style={{ objectFit: 'cover' }} />
                    </motion.div>
                    <AnimatePresence>
                    <motion.div 
                        className="absolute -bottom-6 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                    >
                        {circle.name}
                    </motion.div>
                    </AnimatePresence>
                  </motion.button>
                );
              })}
              </div>
            </motion.div>
          );
        })}

        {/* Nucleus */}
        <motion.div
          className="absolute z-20 rounded-full bg-background shadow-2xl flex items-center justify-center"
          style={{ 
              width: NUCLEUS_SIZE, 
              height: NUCLEUS_SIZE,
              top: `calc(50% - ${NUCLEUS_SIZE / 2}px)`,
              left: `calc(50% - ${NUCLEUS_SIZE / 2}px)`
          }}
        >
          <Logo className="h-20 w-20 text-primary" />
        </motion.div>
      </div>

      <Dialog open={!!selectedCircle} onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedCircle(null);
            setIsRenaming(false);
          }
      }}>
        <DialogContent className="sm:max-w-md">
           <DialogHeader className="flex-row items-center justify-between">
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
                    <DropdownMenuItem onSelect={() => setIsRenaming(true)}>
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
                        <Button variant="outline" size="sm"><UserPlus className="mr-2"/>Add</Button>
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
