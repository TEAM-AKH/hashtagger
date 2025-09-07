
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Users,
  Film,
  BrainCircuit,
  Radio,
  History,
  Settings,
  User,
  Clapperboard,
  Compass,
  Circle,
} from 'lucide-react';
import { Logo } from './logo';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

const navItems = [
  { href: '/circles', label: 'Circles', icon: Circle },
  { href: '/chat', label: 'ChitChat', icon: Users },
  { href: '/clips', label: 'Clips', icon: Clapperboard },
  { href: '/hashflicks', label: 'HASHFLICKS', icon: Film },
  { href: '/home', label: 'Hastagger', icon: Logo, isCentral: true },
  { href: '/memory-bank', label: 'Memory Bank', icon: BrainCircuit },
  { href: '/stream', label: 'Stream', icon: Radio },
  { href: '/instant-updates', label: 'Updates', icon: History },
  { href: '/dynamic-feeds', label: 'Dynamic Feeds', icon: Compass },
];

const bottomNavItems = [
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/settings', label: 'Settings', icon: Settings },
]

export default function SideNav() {
  const pathname = usePathname();
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  
  const navRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  const allItems = [...navItems, ...bottomNavItems];
  const activeIndex = allItems.findIndex(item => item.href === pathname);
  const activeItem = allItems[activeIndex];

  const getHighlightStyle = () => {
    if (!activeItem || activeIndex < 0 || !navRef.current || !itemsRef.current[activeIndex]) return {};

    const navRect = navRef.current.getBoundingClientRect();
    const itemRect = itemsRef.current[activeIndex]!.getBoundingClientRect();

    const top = itemRect.top - navRect.top;
    const height = itemRect.height;
    const width = navRect.width;
    
    const waveWidth = 15;
    const waveHeight = height * 0.4;
    
    const path = `M${width - 2},${top - 20} 
                 C${width - waveWidth},${top + waveHeight}, ${width - waveWidth},${top + height - waveHeight}, ${width - 2},${top + height + 20}
                 `;

    return {
      top,
      path,
    };
  };

  const { path: highlightPath } = getHighlightStyle();

  return (
     <TooltipProvider>
        <nav
        ref={navRef}
        onMouseLeave={() => setHoveredPath(null)}
        className="fixed top-0 left-0 h-full w-20 bg-background/80 backdrop-blur-sm border-r flex flex-col items-center py-6 gap-2 z-50"
        >
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            <motion.path
            d={highlightPath}
            fill="transparent"
            stroke="hsl(var(--primary))"
            strokeWidth="2.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, d: highlightPath }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
        </svg>

        <div className="flex flex-col items-center gap-2">
            {navItems.map((item, index) => {
            const isActive = pathname === item.href;
            const isHovered = hoveredPath === item.href;

            return (
                <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                    <Link
                    href={item.href}
                    ref={(el) => (itemsRef.current[index] = el)}
                    onMouseEnter={() => setHoveredPath(item.href)}
                    className="relative"
                    >
                    <motion.div
                        className={cn(
                        'flex items-center justify-center rounded-full text-muted-foreground transition-colors duration-300 hover:text-primary',
                        isActive && 'text-primary',
                        item.isCentral ? 'w-14 h-14' : 'w-12 h-12'
                        )}
                        animate={{ scale: isActive || isHovered ? 1.1 : 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                    >
                        <item.icon className={cn(item.isCentral ? 'h-12 w-12' : 'h-6 w-6')} />
                    </motion.div>
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={10}>
                    <p>{item.label}</p>
                </TooltipContent>
                </Tooltip>
            );
            })}
        </div>

        <div className="mt-auto flex flex-col items-center gap-2">
            {bottomNavItems.map((item, index) => {
                 const fullIndex = navItems.length + index;
                 const isActive = pathname === item.href;
                 const isHovered = hoveredPath === item.href;
                 return (
                    <Tooltip key={item.href}>
                        <TooltipTrigger asChild>
                            <Link
                                href={item.href}
                                ref={(el) => (itemsRef.current[fullIndex] = el)}
                                onMouseEnter={() => setHoveredPath(item.href)}
                                className="relative"
                            >
                                <motion.div
                                    className="flex items-center justify-center w-12 h-12 rounded-full text-muted-foreground transition-colors duration-300 hover:text-primary"
                                     animate={{ scale: isActive || isHovered ? 1.1 : 1 }}
                                    transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                                >
                                    <item.icon className="h-6 w-6" />
                                </motion.div>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={10}>
                            <p>{item.label}</p>
                        </TooltipContent>
                    </Tooltip>
                 )
            })}
        </div>
        </nav>
     </TooltipProvider>
  );
}
