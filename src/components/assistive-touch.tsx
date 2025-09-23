
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Bell, User, Settings, LogOut, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const actions = [
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/logout', label: 'Logout', icon: LogOut },
];

export function AssistiveTouch() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [dragConstraints, setDragConstraints] = useState({ top: 0, bottom: 0 });
  const pathname = usePathname();
  const y = useMotionValue(0);
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

  useEffect(() => {
    setIsClient(true);
    const updateConstraints = () => {
      setDragConstraints({ top: - (window.innerHeight / 2) + 100, bottom: (window.innerHeight / 2) - 100 });
    };
    updateConstraints();
    window.addEventListener('resize', updateConstraints);
    return () => window.removeEventListener('resize', updateConstraints);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);
  
  if (!isClient) {
    return null;
  }

  const radius = 90;
  const numActions = actions.length;
  // Spread items over a 180-degree arc (PI radians) on the right side
  const angleIncrement = Math.PI / (numActions);
  const startAngle = -Math.PI / 2; // Start from the top

  return (
     <motion.div
        drag="y"
        dragConstraints={dragConstraints}
        style={{ y: springY }}
        className="fixed top-1/2 left-0 z-50"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        animate={{ x: isHovered || isOpen ? 0 : -28 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >
      {/* Radial Menu Wrapper */}
      <AnimatePresence>
        {isOpen && (
           <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-14 h-14">
             {actions.map((action, i) => {
                // angle for right-side arc (from top to bottom)
                const angle = startAngle + (i + 0.5) * angleIncrement;
                const x = radius * Math.cos(angle);
                const y = radius * Math.sin(angle);
              
                return (
                  <motion.div
                    key={action.href}
                    className="absolute top-1/2 left-1/2"
                    initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                    animate={{ x: x, y: y, scale: 1, opacity: 1 }}
                    exit={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20, delay: i * 0.05 }}
                  >
                    <Link href={action.href} passHref>
                      <div
                        className="w-12 h-12 flex items-center justify-center rounded-full bg-card/80 backdrop-blur-md text-foreground hover:bg-primary hover:text-primary-foreground transition-colors shadow-lg"
                        onClick={() => setIsOpen(false)}
                      >
                        <action.icon className="h-6 w-6" />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
           </div>
        )}
      </AnimatePresence>

      {/* Main Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
            "relative w-14 h-14 rounded-full flex items-center justify-center bg-primary/90 backdrop-blur-md text-primary-foreground shadow-2xl z-10",
            "border-2 border-background/50"
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isOpen ? 'close' : 'open'}
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <X className="h-7 w-7" /> : 
                <div className="w-10 h-10 rounded-full bg-gradient-to-b from-white/90 to-gray-200 grid place-items-center shadow-inner relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-white/20" />
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <circle cx="12" cy="12" r="6" fill="#0b1220" opacity="0.12"/>
                        <circle cx="12" cy="12" r="3.6" fill="#0b1220" opacity="0.18"/>
                    </svg>
                </div>
            }
          </motion.div>
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
}
