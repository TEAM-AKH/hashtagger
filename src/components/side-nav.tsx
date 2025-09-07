
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
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
import { ChitChatIcon } from './chitchat-icon';

const navItems = [
  { href: '/circles', label: 'Circles', icon: Circle },
  { href: '/chat', label: 'ChitChat', icon: ChitChatIcon },
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

function useOnClickOutside(ref: React.RefObject<HTMLElement>, handler: (event: MouseEvent | TouchEvent) => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}


export default function SideNav() {
  const pathname = usePathname();
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const navRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useOnClickOutside(navRef, () => setIsExpanded(false));

  const allItems = [...navItems, ...bottomNavItems];
  const activeIndex = allItems.findIndex(item => item.href === pathname);
  const activeItem = allItems[activeIndex];

  const getHighlightStyle = () => {
    if (!activeItem || activeIndex < 0 || !navRef.current || !itemsRef.current[activeIndex]) return {};

    const navRect = navRef.current.getBoundingClientRect();
    const itemRect = itemsRef.current[activeIndex]!.getBoundingClientRect();

    const top = itemRect.top - navRect.top;
    const height = itemRect.height;
    
    let path;

    if (isExpanded) {
        path = `M${navRect.width - 2},${top - 20} 
                C${navRect.width - 15},${top + (height * 0.4)}, ${navRect.width - 15},${top + height - (height * 0.4)}, ${navRect.width - 2},${top + height + 20}
                `;
    } else {
         path = `M${navRect.width - 2},${top} Q${navRect.width - 20},${top + height/2} ${navRect.width - 2},${top + height}`
    }

    return { top, path, };
  };

  const { path: highlightPath } = getHighlightStyle();
  
  const labelVariants = {
    hidden: { opacity: 0, x: -10, y: 0 },
    hovered: { opacity: 1, x: 0, y: 35 },
    active: { opacity: 1, x: 0, y: 0 }
  };

  const renderNavItem = (item: any, index: number, isBottom: boolean) => {
    const isActive = pathname === item.href;
    const isHovered = hoveredPath === item.href;
    const fullIndex = isBottom ? navItems.length + index : index;

    return (
        <Link
          key={item.href}
          href={item.href}
          ref={(el) => (itemsRef.current[fullIndex] = el)}
          onMouseEnter={() => setHoveredPath(item.href)}
          onClick={() => setIsExpanded(true)}
          className="relative flex flex-col items-center justify-center group py-2"
        >
          <motion.div
              className={cn(
              'flex items-center justify-center rounded-full text-muted-foreground transition-colors duration-300 group-hover:text-primary',
              isActive && 'text-primary',
              item.isCentral ? 'w-14 h-14' : 'w-12 h-12'
              )}
              animate={{ scale: isActive || isHovered ? 1.1 : 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          >
              <item.icon className={cn(item.isCentral ? 'h-12 w-12' : 'h-6 w-6')} />
          </motion.div>
          <AnimatePresence>
            {(isHovered || (isActive && isExpanded)) && (
              <motion.div
                key={item.href}
                variants={labelVariants}
                initial="hidden"
                animate={isActive && isExpanded ? 'active' : 'hovered'}
                exit="hidden"
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className={cn(
                  "absolute text-sm font-bold whitespace-nowrap text-accent",
                  isActive && isExpanded ? "left-[60px]" : ""
                )}
              >
                {item.label}
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
    );
  }

  return (
        <motion.nav
          ref={navRef}
          onMouseLeave={() => setHoveredPath(null)}
          className="fixed top-0 left-0 h-full bg-background/80 backdrop-blur-sm border-r flex flex-col items-center py-6 gap-2 z-50"
          initial={false}
          animate={{ width: isExpanded ? 180 : 80 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
              <motion.path
              d={highlightPath}
              fill="transparent"
              stroke="hsl(var(--primary))"
              strokeWidth="2.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: activeIndex >= 0 ? 1 : 0, d: highlightPath }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
          </svg>

          <div className="flex flex-col items-center gap-2">
              {navItems.map((item, index) => renderNavItem(item, index, false))}
          </div>

          <div className="mt-auto flex flex-col items-center gap-2">
              {bottomNavItems.map((item, index) => renderNavItem(item, index, true))}
          </div>
        </motion.nav>
  );
}

