
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Share2,
  MessageSquareHeart,
  Film,
  Clapperboard,
  BrainCircuit,
  Heart,
  Hash,
  Activity,
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const topIcons = [
  { href: '/circles', label: 'Circles', icon: Share2 },
  { href: '/chat', label: 'ChitChat', icon: MessageSquareHeart },
  { href: '/clips', label: 'Clips', icon: Film },
];

const bottomIcons = [
  { href: '/hashflicks', label: 'HASHFLICKS', icon: Clapperboard },
  { href: '/memory-bank', label: 'Memory Bank', icon: BrainCircuit },
  { href: '/dynamic-feeds', label: 'Dynamic Feeds', icon: Activity },
]

export default function SideNav() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  const NavItem = ({ item, isActive }: { item: typeof topIcons[0], isActive: boolean }) => {
    return (
        <Link href={item.href}>
            <div
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 cursor-pointer w-full
                ${isActive
                    ? "bg-white/90 text-primary shadow-lg"
                    : "text-sidebar-foreground hover:bg-white/20 hover:text-white"
                }`}
            >
                <item.icon className="h-6 w-6 shrink-0" />
                <AnimatePresence>
                {isHovered && (
                    <motion.span 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                        className="whitespace-nowrap font-semibold"
                    >
                        {item.label}
                    </motion.span>
                )}
                </AnimatePresence>
            </div>
      </Link>
    );
  };

  return (
    <motion.div 
        className="fixed top-0 left-0 h-full bg-gradient-to-b from-sidebar-grad-start to-sidebar-grad-end flex flex-col items-center py-8 z-50 rounded-r-2xl shadow-2xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ width: 80 }}
        animate={{ width: isHovered ? 208 : 80 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
        <div className="flex flex-col justify-between h-full w-full px-2">
            {/* Icons top */}
            <div className="flex flex-col gap-4 items-center">
              {topIcons.map((item) => (
                <NavItem key={item.href} item={item} isActive={pathname.startsWith(item.href)} />
              ))}
            </div>

            {/* Center Hashtag Icon */}
            <Link href="/home">
                <div className="w-16 h-16 rounded-full bg-sidebar-grad-end border-4 border-yellow-300 flex items-center justify-center text-3xl text-white shadow-xl transition-transform hover:scale-105 cursor-pointer">
                  <Hash />
                </div>
            </Link>

            {/* Icons bottom */}
            <div className="flex flex-col gap-4 items-center">
              {bottomIcons.map((item) => (
                <NavItem key={item.href} item={item} isActive={pathname.startsWith(item.href)} />
              ))}
            </div>
        </div>
      </motion.div>
  );
}

    