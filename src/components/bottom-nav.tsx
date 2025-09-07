
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
  Home,
  Circle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const navItems = [
  { href: '/circles', label: 'Circles', icon: Circle },
  { href: '/chat', label: 'ChitChat', icon: Users },
  { href: '/clips', label: 'Clips', icon: Film },
  { href: '/hashflicks', label: 'HASHFLICKS', icon: Clapperboard },
  { href: '/home', label: 'Hastagger', icon: Home, isCentral: true },
  { href: '/memory-bank', label: 'Memory Bank', icon: BrainCircuit },
  { href: '/stream', label: 'Stream', icon: Radio },
  { href: '/instant-updates', label: 'Updates', icon: History },
  { href: '/dynamic-feeds', label: 'Dynamic Feeds', icon: Compass },
];

const BottomNav = () => {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [highlightStyle, setHighlightStyle] = useState({});

  const navRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const currentActiveIndex = navItems.findIndex(item => item.href === pathname);
    setActiveIndex(currentActiveIndex);
  }, [pathname]);

  useEffect(() => {
    const calculateHighlight = (index: number | null) => {
      if (index === null || !itemsRef.current[index] || !navRef.current) return;

      const itemEl = itemsRef.current[index]!;
      const navEl = navRef.current!;

      const itemRect = itemEl.getBoundingClientRect();
      const navRect = navEl.getBoundingClientRect();

      const isCentral = navItems[index]?.isCentral;
      const width = itemRect.width * (isCentral ? 1.2 : 1.8);
      const height = itemRect.height * (isCentral ? 1.2 : 1.4);
      const left = itemRect.left - navRect.left - (width - itemRect.width) / 2;
      const top = (itemRect.top - navRect.top - (height - itemRect.height) / 2) + 4;
      
      const curveHeight = 20;

      const path = `M${left - 20},${top + height} 
                     C${left},${top + height}, ${left},${top + curveHeight}, ${left + 20},${top + curveHeight}
                     L${left + width - 20},${top + curveHeight}
                     C${left + width},${top + curveHeight}, ${left + width},${top + height}, ${left + width + 20},${top + height} Z`;
      
      setHighlightStyle({
        width: navRect.width,
        height: navRect.height,
        d: path
      });
    };

    calculateHighlight(activeIndex);
    
    window.addEventListener('resize', () => calculateHighlight(activeIndex));
    return () => window.removeEventListener('resize', () => calculateHighlight(activeIndex));

  }, [activeIndex, isMobile]);

  return (
    <div
      ref={navRef}
      className="fixed bottom-0 left-0 right-0 h-24 bg-background border-t p-2 z-50"
    >
      <motion.svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
        <motion.path
          d={(highlightStyle as any).d}
          fill="hsl(var(--primary) / 0.1)"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, d: (highlightStyle as any).d }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </motion.svg>
      <div className="flex justify-around items-center h-full relative z-10">
        {navItems.map((item, index) => {
          const isActive = index === activeIndex;
          const isHovered = index === hoveredIndex;

          return (
            <Link
              key={item.href}
              href={item.href}
              ref={el => (itemsRef.current[index] = el)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={cn(
                'flex flex-col items-center justify-center transition-all duration-300',
                item.isCentral ? 'w-16 h-16' : 'w-12 h-12'
              )}
            >
              <motion.div 
                className={cn('flex items-center justify-center rounded-full', item.isCentral ? 'w-16 h-16 bg-primary text-primary-foreground shadow-lg -translate-y-6' : 'w-10 h-10')}
                animate={{ 
                    scale: isActive || isHovered ? 1.1 : 1,
                    y: isActive && item.isCentral ? -28 : (isActive ? -4 : (item.isCentral ? -24 : 0)),
                }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <item.icon className={cn(
                    "transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground",
                    item.isCentral && "text-primary-foreground",
                    item.isCentral ? 'h-8 w-8' : 'h-6 w-6'
                 )} />
              </motion.div>
              <motion.span
                className="text-xs font-medium text-primary whitespace-nowrap absolute"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isActive || isHovered ? 1 : 0, y: isActive || isHovered ? 40 : 10 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                {item.label}
              </motion.span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
