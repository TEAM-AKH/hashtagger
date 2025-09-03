
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Clapperboard, Film, User, Settings, CircleDot } from 'lucide-react';
import { Logo } from './logo';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const navItems = [
  { href: '/circles', label: 'Circles', icon: CircleDot },
  { href: '/chat', label: 'Chit Chat', icon: MessageSquare },
  { href: '/clips', label: 'Clips', icon: Clapperboard },
  { href: '/flicks', label: 'Flicks', icon: Film },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
];

const ITEM_SIZE = 48;
const RADIUS = 150;

export default function SideNav() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <TooltipProvider>
      <div 
        className="fixed top-4 left-4 z-50"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="relative" style={{ width: RADIUS * 2, height: RADIUS * 2 }}>
            <Link href="/home" passHref>
                 <motion.div
                    className={cn(
                        "absolute z-10 rounded-full bg-card shadow-xl overflow-hidden cursor-pointer border-4 flex items-center justify-center text-muted-foreground hover:border-primary transition-all duration-300",
                        pathname === '/home' ? "border-primary" : "border-primary/50"
                    )}
                    style={{ 
                        top: RADIUS - ITEM_SIZE, 
                        left: RADIUS - ITEM_SIZE,
                        width: ITEM_SIZE * 2, 
                        height: ITEM_SIZE * 2 
                    }}
                    whileHover={{ scale: 1.1 }}
                    >
                    <Logo className="h-12 w-12" />
                </motion.div>
            </Link>

          {navItems.map((item, index) => {
            const angle = (index / (navItems.length -1)) * Math.PI - (Math.PI / 2) * 1.5;
            const x = isExpanded ? RADIUS * Math.cos(angle) : 0;
            const y = isExpanded ? RADIUS * Math.sin(angle) : 0;
            const isActive = pathname.startsWith(item.href);

            return (
              <motion.div
                key={item.href}
                className="absolute"
                style={{
                  left: RADIUS - ITEM_SIZE / 2,
                  top: RADIUS - ITEM_SIZE / 2,
                }}
                animate={{
                  x: isExpanded ? x : 0,
                  y: isExpanded ? y : 0,
                  scale: isExpanded ? 1 : 0,
                  opacity: isExpanded ? 1 : 0,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                  delay: isExpanded ? index * 0.05 : (navItems.length - index) * 0.05,
                }}
              >
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link href={item.href} passHref>
                           <motion.div
                            className={cn(
                                "h-12 w-12 rounded-full flex items-center justify-center bg-card border-2 shadow-md hover:border-primary",
                                isActive ? "bg-primary text-primary-foreground border-primary" : "text-foreground"
                            )}
                            whileHover={{ scale: 1.2, y: -4 }}
                            >
                                <item.icon className="h-6 w-6" />
                            </motion.div>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        <p>{item.label}</p>
                    </TooltipContent>
                </Tooltip>
              </motion.div>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
}
