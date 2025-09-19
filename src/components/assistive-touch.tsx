
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, User, Settings, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const actions = [
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/logout', label: 'Logout', icon: LogOut },
];

export function AssistiveTouch() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (!isClient) {
    return null;
  }

  return (
    <motion.div
      ref={widgetRef}
      layout
      onClick={() => setIsOpen(!isOpen)}
      className={cn(
        "fixed top-1/2 right-0 transform -translate-y-1/2 flex items-center justify-center cursor-pointer z-50",
        "bg-card/80 backdrop-blur-md shadow-2xl border border-border"
      )}
      initial={{ borderRadius: '50% 0 0 50%', width: '4rem', height: '7rem' }}
      animate={{
        width: isOpen ? '8rem' : '4rem',
        height: isOpen ? '24rem' : '7rem',
        borderRadius: isOpen ? '1.5rem' : '50% 0 0 50%',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {/* Ball Core */}
      <motion.div 
        layout="position"
        className="w-10 h-10 bg-primary rounded-full z-10 grid place-items-center"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-b from-white/90 to-gray-200 grid place-items-center shadow-inner relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-white/20" />
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
             <circle cx="12" cy="12" r="6" fill="#0b1220" opacity="0.12"/>
             <circle cx="12" cy="12" r="3.6" fill="#0b1220" opacity="0.18"/>
           </svg>
        </div>
      </motion.div>

      {/* Icon Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.1 } }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
          >
            {actions.map((action, i) => (
              <Link key={action.href} href={action.href} passHref>
                  <motion.div
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-background/80 text-foreground hover:bg-primary hover:text-primary-foreground transition-colors shadow-md"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1, transition: { delay: 0.1 + i * 0.05 } }}
                    exit={{ y: 20, opacity: 0, transition: { duration: 0.1 } }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <action.icon className="h-6 w-6" />
                  </motion.div>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
