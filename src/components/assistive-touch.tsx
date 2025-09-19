
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useDragControls, AnimatePresence } from 'framer-motion';
import { Bell, User, Settings, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const actionsConfig = [
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/logout', label: 'Logout', icon: LogOut },
];

export function AssistiveTouch() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const radialRef = useRef<HTMLDivElement>(null);
  const controls = useDragControls();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [dragConstraints, setDragConstraints] = useState<{top: number, bottom: number}>({top: 10, bottom: 500});

  useEffect(() => {
    setIsClient(true);
    setDragConstraints({
        top: 10,
        bottom: window.innerHeight - 74,
    });
  }, []);

  const closeRadial = () => setIsOpen(false);

  useEffect(() => {
    closeRadial();
  }, [pathname]);

  const handleDragStart = () => {
    setIsDragging(true);
    closeRadial();
  };

  const handleDragEnd = () => {
    // A timeout to prevent click event firing immediately after drag
    setTimeout(() => setIsDragging(false), 50);
  };
  
  const handleClick = (event: React.MouseEvent) => {
    if (isDragging) {
      event.stopPropagation();
      return;
    }
    setIsOpen(!isOpen);
  };
  
  const handleActionClick = () => {
    closeRadial();
  };
  
  // Close when clicking outside
  useEffect(() => {
    if (!isClient || !isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && 
          !buttonRef.current?.contains(event.target as Node) && 
          !radialRef.current?.contains(event.target as Node)) {
        closeRadial();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, isClient]);

  const radius = 100;
  const arc = Math.PI;
  const startAngle = Math.PI;
  
  if (!isClient) {
    return null;
  }
  
  return (
    <>
      <motion.div
        ref={buttonRef}
        drag="y"
        dragListener={false}
        dragControls={controls}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={handleClick}
        dragConstraints={dragConstraints}
        dragElastic={0.2}
        dragTransition={{ bounceStiffness: 400, bounceDamping: 25 }}
        className={cn(
          "fixed bottom-7 w-16 h-16 rounded-full cursor-pointer touch-none select-none z-[9998] grid place-items-center bg-black/50 backdrop-blur-md shadow-2xl transition-all duration-300",
          "right-[-32px] rounded-r-none",
          isHovered && "right-3 rounded-full",
          isDragging && "scale-95",
        )}
        style={{
           right: isHovered ? '12px' : '-32px',
        }}
        animate={{
            scale: isOpen ? 1.05 : 1,
            rotate: isOpen ? -180 : 0
        }}
        onPointerDown={(e) => controls.start(e, { snapToCursor: false })}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Assistive Touch Menu"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-b from-white/90 to-gray-200 grid place-items-center shadow-inner relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-white/20" />
           <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
             <circle cx="12" cy="12" r="6" fill="#0b1220" opacity="0.12"/>
             <circle cx="12" cy="12" r="3.6" fill="#0b1220" opacity="0.18"/>
           </svg>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={radialRef}
            role="menu"
            className="fixed z-[9997]"
            style={{ 
              top: (buttonRef.current?.getBoundingClientRect().top ?? 0) + 32,
              left: (buttonRef.current?.getBoundingClientRect().left ?? 0) + 32,
              transformOrigin: 'center',
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            {actionsConfig.map((action, i) => {
              const angle = startAngle + (i / (actionsConfig.length - 1)) * arc;
              const x = Math.round(Math.cos(angle) * radius);
              const y = Math.round(Math.sin(angle) * -1);

              return (
                 <Link href={action.href} key={action.href} passHref>
                    <motion.div
                        className="absolute -translate-x-1/2 -translate-y-1/2 w-16 h-16 grid place-items-center rounded-2xl bg-black/40 backdrop-blur-sm shadow-xl text-white"
                        role="menuitem"
                        initial={{ x: 0, y: 0, opacity: 0, scale: 0.5 }}
                        animate={{ x, y, opacity: 1, scale: 1 }}
                        exit={{ x: 0, y: 0, opacity: 0, scale: 0.5 }}
                        transition={{ 
                            type: 'spring', 
                            stiffness: 500, 
                            damping: 20, 
                            delay: i * 0.04 
                        }}
                        onClick={handleActionClick}
                    >
                        <action.icon className="w-6 h-6" />
                        <div className="absolute top-full mt-2 text-xs font-medium text-white/90 whitespace-nowrap">{action.label}</div>
                    </motion.div>
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
