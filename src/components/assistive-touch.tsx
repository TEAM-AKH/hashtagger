
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, User, Settings, LogOut, X, Plus } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const actions = [
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/logout', label: 'Logout', icon: LogOut },
];

const menuVariants = {
  closed: {
    scale: 0,
    transition: {
      when: 'afterChildren',
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
  open: {
    scale: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  closed: { opacity: 0, y: 15, scale: 0.8 },
  open: { opacity: 1, y: 0, scale: 1 },
};

export function AssistiveTouch() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  if (!isClient) {
    return null;
  }

  const radius = 90;
  const numActions = actions.length;
  const angleIncrement = Math.PI / (numActions - 1);

  return (
    <div className="fixed top-1/2 right-4 transform -translate-y-1/2 z-50">
      {/* Radial Menu Items */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="absolute right-0 top-0 w-12 h-12"
          >
            {actions.map((action, i) => {
              const angle = Math.PI + i * angleIncrement;
              const x = radius * Math.cos(angle);
              const y = radius * Math.sin(angle);
              return (
                <motion.div
                  key={action.href}
                  className="absolute"
                  style={{ top: '50%', left: '50%', x: '-50%', y: '-50%' }}
                  initial={{ x, y, opacity: 0 }}
                  animate={{ x, y, opacity: 1 }}
                  exit={{ x: 0, y: 0, opacity: 0 }}
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-14 h-14 rounded-full flex items-center justify-center bg-primary/90 backdrop-blur-md text-primary-foreground shadow-2xl z-10"
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
    </div>
  );
}
