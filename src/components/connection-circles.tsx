"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { PlusCircle, UserPlus } from "lucide-react";

const subCircles = [
  { id: 1, name: "Best Friends", image: "https://picsum.photos/seed/bf/200", hint: "group friends", members: [
      { name: "Alice", avatar: "https://picsum.photos/seed/1/100" },
      { name: "Bob", avatar: "https://picsum.photos/seed/2/100" },
      { name: "Charlie", avatar: "https://picsum.photos/seed/3/100" },
  ]},
  { id: 2, name: "Family", image: "https://picsum.photos/seed/fam/200", hint: "family picture", members: [
      { name: "Diana", avatar: "https://picsum.photos/seed/4/100" },
      { name: "Eve", avatar: "https://picsum.photos/seed/5/100" },
  ]},
  { id: 3, name: "Organization", image: "https://picsum.photos/seed/org/200", hint: "office building", members: [
      { name: "Frank", avatar: "https://picsum.photos/seed/6/100" },
      { name: "Grace", avatar: "https://picsum.photos/seed/7/100" },
      { name: "Heidi", avatar: "https://picsum.photos/seed/8/100" },
      { name: "Ivan", avatar: "https://picsum.photos/seed/9/100" },
  ]},
  { id: 4, name: "Clubs", image: "https://picsum.photos/seed/club/200", hint: "people hobby", members: [
       { name: "Judy", avatar: "https://picsum.photos/seed/10/100" },
       { name: "Mallory", avatar: "https://picsum.photos/seed/11/100" },
  ]},
];

type Circle = typeof subCircles[0];

const CIRCLE_SIZE = 90;
const MAIN_CIRCLE_SIZE = 120;
const RADIUS = 220;

export default function ConnectionCircles() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCircle, setSelectedCircle] = useState<Circle | null>(null);

  return (
    <>
      <div className="relative flex items-center justify-center" style={{ height: RADIUS * 2, width: RADIUS * 2 }}>
        {subCircles.map((circle, index) => {
          const angle = (index / subCircles.length) * 2 * Math.PI - (Math.PI / 2); // Start from top
          const x = isExpanded ? RADIUS * Math.cos(angle) : 0;
          const y = isExpanded ? RADIUS * Math.sin(angle) : 0;
          
          return (
            <button
              key={circle.id}
              onClick={() => setSelectedCircle(circle)}
              className="absolute flex flex-col items-center group cursor-pointer transition-all duration-500 ease-in-out"
              style={{ 
                width: CIRCLE_SIZE, 
                height: CIRCLE_SIZE + 20,
                transform: `translate(${x}px, ${y}px) scale(${isExpanded ? 1 : 0})`,
                opacity: isExpanded ? 1 : 0,
                transitionDelay: `${isExpanded ? index * 70 : (subCircles.length - index) * 50}ms`,
              }}
            >
              <div className="relative rounded-full overflow-hidden border-4 border-accent/50 shadow-lg hover:border-primary transition-colors" style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}>
                <Image src={circle.image} alt={circle.name} fill style={{ objectFit: 'cover' }} data-ai-hint={circle.hint} />
              </div>
              <span className="mt-2 text-sm font-medium text-foreground opacity-90 group-hover:opacity-100 transition-opacity">{circle.name}</span>
            </button>
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

      <Dialog open={!!selectedCircle} onOpenChange={(isOpen) => !isOpen && setSelectedCircle(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedCircle?.name}</DialogTitle>
            <DialogDescription>
              Members of the {selectedCircle?.name.toLowerCase()} circle.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedCircle?.members.map(member => (
              <div key={member.name} className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{member.name}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 mt-4">
             <Button variant="outline"><UserPlus/>Add Member</Button>
             <Button><PlusCircle/>Create Circle</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
