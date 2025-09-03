
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarContent,
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  Home,
  Compass,
  ShoppingCart,
  User,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';


const navItems = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/circles', label: 'Discover', icon: Compass },
  { href: '/clips', label: 'Clips', icon: ShoppingCart },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function SideNav() {
  const pathname = usePathname();
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  const activeIndex = navItems.findIndex(item => pathname.startsWith(item.href));

  return (
      <div className="flex flex-col h-full bg-card border-r">
        <SidebarContent className="flex-grow">
          <TooltipProvider>
            <SidebarMenu className="relative flex flex-col items-center gap-6 p-4">
                <AnimatePresence>
                {activeIndex !== -1 && (
                     <motion.div
                        layoutId="active-indicator"
                        initial={false}
                        animate={{ y: activeIndex * 76 + 16 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        className="absolute top-0 left-0 w-full h-[60px] flex items-center justify-center"
                    >
                         <div className="w-[60px] h-[60px] bg-primary rounded-full" />
                         <svg width="104" height="104" viewBox="0 0 104 104" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute text-card -right-1.5 transform -translate-x-full">
                            <path d="M103 1C103 1 64.062 1.503 40.5 24C16.938 46.497 1 52 1 52C1 52 16.938 57.503 40.5 79.5C64.062 101.497 103 103 103 103" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                    </motion.div>
                )}
                </AnimatePresence>


              {navItems.map((item, index) => {
                const isActive = pathname.startsWith(item.href);
                const Icon = item.icon;
                
                return (
                  <SidebarMenuItem key={item.href} className="z-10 w-[60px] h-[60px]" onMouseEnter={() => setHoveredPath(item.href)} onMouseLeave={() => setHoveredPath(null)}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link href={item.href}>
                                <div className={cn(
                                    "w-full h-full flex items-center justify-center rounded-full transition-colors duration-200",
                                    isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                                )}>
                                    <Icon className="h-7 w-7" />
                                </div>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right" align="center" className="capitalize">
                            {item.label}
                        </TooltipContent>
                    </Tooltip>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </TooltipProvider>
        </SidebarContent>
      </div>
  );
}
