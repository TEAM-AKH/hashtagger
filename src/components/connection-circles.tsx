
"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { UserPlus } from "lucide-react";
import { motion } from 'framer-motion';

type Member = { name: string; avatar: string };
type Circle = { id: number; name: string; image: string; hint: string; members: Member[] };

const CIRCLE_SIZE = 90;
const MAIN_CIRCLE_SIZE = 120;
const RING_RADIUSES = [180, 280, 380, 480, 580]; // Radii for up to 5 rings
const RING_CAPACITIES = [4, 6, 8, 10, 12];

interface ConnectionCirclesProps {
  circles: Circle[];
  onCircleSelect: (circle: Circle | null) => void;
}

export default function ConnectionCircles({ circles, onCircleSelect }: ConnectionCirclesProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedDialogCircle, setSelectedDialogCircle] = useState<Circle | null>(null);

  useEffect(() => {
    // When a circle is removed from the parent, close the dialog if it was showing that circle
    if(selectedDialogCircle && !circles.find(c => c.id === selectedDialogCircle.id)) {
        setSelectedDialogCircle(null);
    }
  }, [circles, selectedDialogCircle]);

  const distributedCircles = useMemo(() => {
    const rings: Circle[][] = [];
    let circlesCopy = [...circles];
    
    for (const capacity of RING_CAPACITIES) {
      if (circlesCopy.length === 0) break;
      const ringCircles = circlesCopy.splice(0, capacity);
      rings.push(ringCircles);
    }
    // remaining circles can go into the last ring type
    if(circlesCopy.length > 0) {
        rings.push(circlesCopy);
    }

    return rings;
  }, [circles]);

  const handleCircleClick = (circle: Circle) => {
    setSelectedDialogCircle(circle);
    onCircleSelect(circle);
  }

  const containerSize = (RING_RADIUSES[distributedCircles.length -1] || MAIN_CIRCLE_SIZE) * 2 + CIRCLE_SIZE * 2;


  return (
    <>
      <div 
          className="relative flex items-center justify-center transition-all duration-500" 
          style={{ height: containerSize, width: containerSize }}
      >
        {distributedCircles.map((ring, ringIndex) => {
          const radius = RING_RADIUSES[ringIndex] || RING_RADIUSES[RING_RADIUSES.length - 1];
          return ring.map((circle, circleIndex) => {
            const angle = (circleIndex / ring.length) * 2 * Math.PI - (Math.PI / 2); // Start from top
            
            return (
              <motion.button
                key={circle.id}
                onClick={() => handleCircleClick(circle)}
                className="absolute flex flex-col items-center group cursor-pointer"
                style={{ 
                  width: CIRCLE_SIZE, 
                  height: CIRCLE_SIZE + 40,
                  top: `calc(50% - ${CIRCLE_SIZE / 2}px)`,
                  left: `calc(50% - ${CIRCLE_SIZE / 2}px)`,
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
                <div className="relative rounded-full overflow-hidden border-4 border-accent/50 shadow-lg hover:border-primary transition-colors" style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}>
                  <Image src={circle.image} alt={circle.name} fill style={{ objectFit: 'cover' }} data-ai-hint={circle.hint} />
                </div>
                <span className="mt-2 text-sm font-medium text-foreground opacity-0 group-hover:opacity-100 transition-opacity">{circle.name}</span>
              </motion.button>
            );
          });
        })}

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
              "absolute z-10 rounded-full bg-card shadow-xl overflow-hidden cursor-pointer border-4 flex items-center justify-center text-muted-foreground hover:border-primary transition-all duration-300",
              isExpanded ? "border-primary" : "border-primary/50"
          )}
          style={{ 
              width: MAIN_CIRCLE_SIZE, 
              height: MAIN_CIRCLE_SIZE,
              top: `calc(50% - ${MAIN_CIRCLE_SIZE / 2}px)`,
              left: `calc(50% - ${MAIN_CIRCLE_SIZE / 2}px)`
          }}
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

      <Dialog open={!!selectedDialogCircle} onOpenChange={(isOpen) => {
          if (!isOpen) {
              setSelectedDialogCircle(null);
              onCircleSelect(null);
          }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedDialogCircle?.name}</DialogTitle>
            <DialogDescription>
              Members of the {selectedDialogCircle?.name.toLowerCase()} circle.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[300px] overflow-y-auto">
            {selectedDialogCircle?.members.length ? selectedDialogCircle?.members.map(member => (
              <div key={member.name} className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{member.name}</span>
              </div>
            )) : <p className="text-muted-foreground text-center">No members yet.</p>}
          </div>
          <DialogFooter>
            <Button variant="outline"><UserPlus className="mr-2"/>Add Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
