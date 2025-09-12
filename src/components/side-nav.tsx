
'use client';

import { useState, useRef, useEffect, createContext, useContext } from 'react';
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
  MessageSquareText,
  Heart,
  Hash,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


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
    const [isExpanded, setIsExpanded] = useState(false);
    return (
        <SideNavContext.Provider value={{ isExpanded, setIsExpanded }}>
            {children}
        </SideNavContext.Provider>
    );
}

const navItems = [
  { href: '/circles', label: 'Circles', icon: Share2 },
  { href: '/chat', label: 'ChitChat', icon: MessageSquareText },
  { href: '/clips', label: 'Clips', icon: Film },
  { href: '/home', label: 'Hastagger', icon: Hash, isCentral: true },
  { href: '/hashflicks', label: 'HASHFLICKS', icon: Clapperboard },
  { href: '/memory-bank', label: 'Memory Bank', icon: BrainCircuit },
  { href: '/dynamic-feeds', label: 'Dynamic Feeds', icon: Heart },
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
  const { isExpanded, setIsExpanded } = useSideNav();
  
  const navRef = useRef<HTMLElement>(null);

  useOnClickOutside(navRef, () => setIsExpanded(false));

  const allItems = [...navItems, ...bottomNavItems];
  
  const labelVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { 
        opacity: 1,
        x: 0,
        transition: { type: 'spring', stiffness: 260, damping: 20 }
    },
  };

  const NavItem = ({ item, isActive }: { item: typeof navItems[0], isActive: boolean }) => {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={item.href}
              onClick={() => setIsExpanded(true)}
              className={cn(
                "relative flex items-center group w-full",
                isExpanded ? "justify-start px-4 gap-3 py-2" : "justify-center py-3"
              )}
            >
              <motion.div
                className={cn(
                  'flex items-center justify-center rounded-full text-muted-foreground transition-colors duration-200 group-hover:text-primary z-10',
                  isActive ? 'text-primary' : 'text-muted-foreground',
                  item.isCentral ? 'h-12 w-12' : 'h-10 w-10'
                )}
              >
                <item.icon className={cn(item.isCentral ? 'h-10 w-10' : 'h-6 w-6')} />
              </motion.div>
              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    variants={labelVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="text-sm font-bold whitespace-nowrap text-foreground"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </TooltipTrigger>
          {!isExpanded && (
            <TooltipContent side="right" className="bg-accent text-accent-foreground">
              <p>{item.label}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  };


  return (
        <motion.nav
          ref={navRef}
          className="fixed top-0 left-0 h-full bg-background/80 backdrop-blur-sm border-r flex flex-col items-center py-6 gap-2 z-50"
          initial={false}
          animate={{ width: isExpanded ? 200 : 80 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="flex flex-col items-center gap-2 w-full">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <div key={item.href} className="relative w-full">
                   {isActive && (
                    <motion.div
                      layoutId="active-nav-item"
                      className="absolute inset-y-0 left-0 w-full bg-primary/10"
                      style={{
                        clipPath: isExpanded
                          ? `path('M0 0 H 190 C 200 0 200 0 200 10 V 40 C 200 50 200 50 190 50 H 0 Z')`
                          : `path('M 10 0 C 0 0 0 0 0 10 V 44 C 0 54 0 54 10 54 H 80 V 0 Z')`
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  {isActive && !item.isCentral && (
                     <motion.div 
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-primary rounded-r-full"
                        layoutId="active-nav-indicator"
                      />
                  )}
                   {isActive && item.isCentral && (
                     <motion.div
                      layoutId="active-nav-item-central-bg"
                      className="absolute inset-0 m-auto h-16 w-16 bg-primary rounded-2xl -z-10"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                     >
                       <div className="absolute -top-2 -left-2 w-6 h-6 bg-transparent" style={{ clipPath: 'path("M 24 0 A 24 24 0 0 1 0 24 L 0 0 Z")' }} />
                     </motion.div>
                  )}
                  <NavItem item={item} isActive={isActive} />
                </div>
              )
            })}
          </div>

          <div className="mt-auto flex flex-col items-center gap-2 w-full">
              {bottomNavItems.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <div key={item.href} className="relative w-full">
                        {isActive && (
                        <motion.div
                            layoutId="active-nav-item"
                            className="absolute inset-y-0 left-0 w-full bg-primary/10"
                            style={{
                                clipPath: isExpanded
                                ? `path('M0 0 H 190 C 200 0 200 0 200 10 V 40 C 200 50 200 50 190 50 H 0 Z')`
                                : `path('M 10 0 C 0 0 0 0 0 10 V 44 C 0 54 0 54 10 54 H 80 V 0 Z')`
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                        )}
                        {isActive && <motion.div layoutId="active-nav-indicator" className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-primary rounded-r-full" />}
                        <NavItem item={item} isActive={isActive} />
                    </div>
                  )
              })}
          </div>
        </motion.nav>
  );
}
