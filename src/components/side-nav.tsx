
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Film,
  BrainCircuit,
  Heart,
  MessageSquareHeart,
  Clapperboard,
  Share2,
  Hash,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const topIcons = [
  { href: '/circles', label: 'Circles', icon: Share2 },
  { href: '/chat', label: 'ChitChat', icon: MessageSquareHeart },
  { href: '/clips', label: 'Clips', icon: Film },
];

const bottomIcons = [
  { href: '/hashflicks', label: 'HASHFLICKS', icon: Clapperboard },
  { href: '/memory-bank', label: 'Memory Bank', icon: BrainCircuit },
  { href: '/dynamic-feeds', label: 'Favorites', icon: Heart },
]

const NavItem = ({ item, isActive }: { item: typeof topIcons[0], isActive: boolean }) => {
    return (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={item.href}
              aria-label={item.label}
              className={`text-2xl p-3 rounded-full transition-all duration-300 ${isActive ? "text-white scale-110 bg-black/20 shadow-lg" : "text-sidebar-foreground hover:scale-110 hover:text-white"}`}
            >
              <item.icon className="h-6 w-6" />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-primary/90 text-primary-foreground border-none">
            <p>{item.label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
};


export default function SideNav() {
  const pathname = usePathname();

  return (
    <div className="relative h-screen w-24 bg-gradient-to-b from-sidebar-grad-start to-sidebar-grad-end border-r-2 border-cyan-400/80 flex flex-col justify-between items-center py-8 z-50">
        
        {/* Icons top */}
        <div className="flex flex-col gap-8">
          {topIcons.map((item) => (
            <NavItem key={item.href} item={item} isActive={pathname.startsWith(item.href)} />
          ))}
        </div>

        {/* Center Hashtag Icon */}
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
          <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/home">
                    <div className="w-16 h-16 rounded-full bg-sidebar-grad-end border-4 border-yellow-300 flex items-center justify-center text-3xl text-white shadow-xl transition-transform hover:scale-105">
                      <Hash />
                    </div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-primary/90 text-primary-foreground border-none">
                  <p>Home</p>
                </TooltipContent>
              </Tooltip>
          </TooltipProvider>
        </div>

        {/* Icons bottom */}
        <div className="flex flex-col gap-8">
          {bottomIcons.map((item) => (
            <NavItem key={item.href} item={item} isActive={pathname.startsWith(item.href)} />
          ))}
        </div>
      </div>
  );
}
