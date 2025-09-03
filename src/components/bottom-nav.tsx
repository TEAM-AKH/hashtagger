
'use client';

import {
  CircleDot,
  MessageSquare,
  Clapperboard,
  Film,
  BrainCircuit,
  Radio,
  History,
  User,
  Settings,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Logo } from './logo';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

const navItems = [
  { href: '/circles', label: 'Circles', icon: CircleDot },
  { href: '/chat', label: 'Chit Chat', icon: MessageSquare },
  { href: '/clips', label: 'Clips', icon: Clapperboard },
  { href: '/flicks', label: 'Flicks', icon: Film },
  { href: '/home', label: 'Home', icon: Logo },
  { href: '/memory-bank', label: 'Memory Bank', icon: BrainCircuit },
  { href: '/stream', label: 'Stream', icon: Radio },
  { href: '/instant-updates', label: 'Instant Updates', icon: History },
];

const NAV_HEIGHT = 64;
const ICON_SIZE = 24;
const RAISED_ICON_SIZE = 56;
const RAISED_AREA_WIDTH = 80;

export default function BottomNav() {
  const pathname = usePathname();
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  const activeIndex = navItems.findIndex((item) => pathname.startsWith(item.href));
  
  const getPathD = (index: number | null) => {
    if (typeof window === 'undefined' || index === null) return '';
    const center = (index + 0.5) * (100 / navItems.length);
    const notchWidth = RAISED_AREA_WIDTH / (window.innerWidth / 100); 

    const startX = center - notchWidth / 2;
    const endX = center + notchWidth / 2;

    return `M 0 20 L ${startX} 20 C ${startX + 5} 20, ${startX + 5} 0, ${center} 0 C ${endX - 5} 0, ${endX - 5} 20, ${endX} 20 L 100 20 L 100 100 L 0 100 L 0 20`;
  };

  const [svgPath, setSvgPath] = useState('');

  useEffect(() => {
    const calculatePath = () => {
      setSvgPath(getPathD(activeIndex));
    }
    calculatePath();
    window.addEventListener('resize', calculatePath);
    return () => window.removeEventListener('resize', calculatePath);
  }, [activeIndex]);

  const handleMouseEnter = (href: string) => {
    setHoveredPath(href);
  };

  const handleMouseLeave = () => {
    setHoveredPath(null);
  };

  return (
    <TooltipProvider>
      <div className="fixed bottom-0 left-0 right-0 h-24 md:h-28 z-50 flex justify-center pointer-events-none">
        <div className="relative w-full max-w-md pointer-events-auto">
          <motion.svg
            width="100%"
            height={NAV_HEIGHT + 20}
            viewBox="0 0 100 84"
            preserveAspectRatio="none"
            className="absolute bottom-0 drop-shadow-2xl"
          >
            <AnimatePresence>
                <motion.path
                    key={activeIndex}
                    d={svgPath}
                    initial={{ opacity: 0}}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    className="fill-background"
                />
            </AnimatePresence>
          </motion.svg>

          <div className="absolute bottom-0 w-full h-20 flex justify-around items-center">
            {navItems.map((item, index) => {
              const isActive = activeIndex === index;
              
              const Icon = item.icon;

              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className="relative flex items-center justify-center w-12 h-12"
                      onMouseEnter={() => handleMouseEnter(item.href)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <motion.div
                        className={cn(
                          "flex items-center justify-center rounded-full",
                          isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                        )}
                        animate={{
                          width: isActive ? RAISED_ICON_SIZE : ICON_SIZE + 12,
                          height: isActive ? RAISED_ICON_SIZE : ICON_SIZE + 12,
                          y: isActive ? - (RAISED_ICON_SIZE / 2) + 8 : 0,
                        }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      >
                         <Icon className={cn(
                            "transition-all duration-300", 
                            isActive ? 'h-8 w-8' : 'h-6 w-6'
                          )} />
                      </motion.div>
                    </Link>
                  </TooltipTrigger>
                   <TooltipContent>
                     <p>{item.label}</p>
                   </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
