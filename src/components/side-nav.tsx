
'use client';

import { useState, createContext, useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Film,
  BrainCircuit,
  Settings,
  User,
  Clapperboard,
  Share2,
  Heart,
  MessageSquareHeart,
  Sparkles,
  Hash,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';


type SideNavContextType = {
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
};

const SideNavContext = createContext<SideNavContextType | undefined>(undefined);

export const useSideNav = () => {
    const context = useContext(SideNavContext);
    if(context === undefined) {
        throw new Error("useSideNav must be used within a SideNav provider");
    }
    return context;
}

export const SideNavProvider = ({ children }: { children: React.ReactNode }) => {
    const isMobile = useIsMobile();
    const [isExpanded, setIsExpanded] = useState(false);
    
    const value = {
      isExpanded: isMobile ? false : isExpanded,
      setIsExpanded: setIsExpanded
    }

    return (
        <SideNavContext.Provider value={value}>
            {children}
        </SideNavContext.Provider>
    );
}

const mainNavItems = [
  { href: '/circles', label: 'Circles', icon: Share2 },
  { href: '/chat', label: 'ChitChat', icon: MessageSquareHeart },
  { href: '/clips', label: 'Clips', icon: Film },
  { href: '/hashflicks', label: 'HASHFLICKS', icon: Clapperboard },
  { href: '/memory-bank', label: 'Memory Bank', icon: Sparkles },
  { href: '/dynamic-feeds', label: 'Favorites', icon: Heart },
];

const centralNavItem = { href: '/home', label: 'Hastagger', icon: Hash, isCentral: true };


const NavItem = ({ item, isActive, isExpanded, isMobile }: { item: typeof mainNavItems[0], isActive: boolean, isExpanded: boolean, isMobile: boolean }) => {
    return (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={item.href}
              aria-label={item.label}
              className="group relative flex w-full items-center justify-center rounded-lg p-3 text-sidebar-foreground outline-none transition-transform duration-150 ease-out focus-visible:scale-110 focus-visible:text-white hover:scale-108 hover:text-white"
            >
              <item.icon className="h-7 w-7 transition-all" />
               <AnimatePresence>
                {isActive && (
                   <motion.div
                    layoutId="active-nav-indicator"
                    className="absolute right-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    initial={{x: 8, opacity: 0}}
                    animate={{x: 0, opacity: 1}}
                    exit={{x: 8, opacity: 0}}
                    transition={{ type: 'spring', stiffness: 400, damping: 20, duration: 180 }}
                    />
                )}
               </AnimatePresence>
            </Link>
          </TooltipTrigger>
          {!isExpanded && !isMobile && (
            <TooltipContent side="right" className="bg-primary/90 text-primary-foreground border-none">
              <p>{item.label}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
};


export default function SideNav() {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  const motionProps = {
    initial: { x: '-100%' },
    animate: { x: 0 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }

  const navWidth = isMobile ? 'w-[72px]' : 'w-24';

  return (
        <motion.nav
          {...motionProps}
          className={cn(
            "fixed top-0 left-0 h-full bg-gradient-to-b from-sidebar-grad-start to-sidebar-grad-end z-50 flex flex-col items-center justify-between py-5",
            navWidth
            )}
        >
          <div className="absolute inset-0 border-r-2 border-teal-400/80 rounded-r-3xl" style={{clipPath: 'url(#sidebar-clip-path)'}}/>

          <svg className="absolute h-0 w-0">
            <defs>
              <clipPath id="sidebar-clip-path" clipPathUnits="objectBoundingBox">
                <path d="M0 0 H 1 V 0.42 C 1 0.42, 0.2, 0.45, 0.2, 0.5 C 0.2, 0.55, 1, 0.58, 1, 0.58 V 1 H 0 V 0 Z" />
              </clipPath>
            </defs>
          </svg>
        
          {/* Top Icons */}
          <div className="flex w-full flex-col items-center gap-y-2 relative">
             <div className="absolute inset-0 flex flex-col items-center gap-y-2">
                 {mainNavItems.map((item) => (
                      pathname.startsWith(item.href) && (
                        <motion.div
                            key={item.href}
                            layoutId="active-item-highlight"
                            className="w-full h-[52px] bg-white/10"
                            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        />
                      )
                  ))}
            </div>

            {mainNavItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <NavItem key={item.href} item={item} isActive={isActive} isExpanded={false} isMobile={!!isMobile} />
              )
            })}
          </div>

        {/* Central Button */}
        <div className="absolute left-full top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                  <Link href={centralNavItem.href} aria-label={centralNavItem.label} className="group outline-none">
                     <motion.div
                        initial={{ scale: 0.92 }}
                        animate={{ scale: [0.92, 1.05, 1] }}
                        transition={{ duration: 0.7, ease: "easeInOut", delay: 0.3 }}
                        className="relative h-16 w-16 rounded-full bg-sidebar-grad-end p-1 shadow-lg transition-transform duration-200 ease-out group-hover:[transform:rotateX(6deg)_rotateY(-6deg)_translateZ(6px)]"
                     >
                        <div className="h-full w-full rounded-full border-2 border-yellow-400 bg-gradient-to-br from-sidebar-grad-start to-sidebar-grad-end flex items-center justify-center">
                            <Hash className="h-8 w-8 text-white" />
                        </div>
                     </motion.div>
                  </Link>
                </TooltipTrigger>
                 <TooltipContent side="right" className="bg-primary/90 text-primary-foreground border-none">
                  <p>{centralNavItem.label}</p>
                </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </motion.nav>
  );
}

    