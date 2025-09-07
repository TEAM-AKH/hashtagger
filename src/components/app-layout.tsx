
'use client';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/header';
import SideNav from './side-nav';
import { motion } from 'framer-motion';

const navItems = [
  { href: '/circles', label: 'Circles' },
  { href: '/chat', label: 'ChitChat' },
  { href: '/clips', label: 'Clips' },
  { href: '/hashflicks', label: 'HASHFLICKS' },
  { href: '/home', label: 'Hastagger' },
  { href: '/memory-bank', label: 'Memory Bank' },
  { href: '/stream', label: 'Stream' },
  { href: '/instant-updates', label: 'Updates' },
  { href: '/dynamic-feeds', label: 'Dynamic Feeds' },
  { href: '/profile', label: 'Profile' },
  { href: '/settings', label: 'Settings' },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAnyItemActive = navItems.some(item => item.href === pathname);

  return (
      <div className="flex min-h-screen">
        <SideNav />
        <motion.div 
            className="flex-1 flex flex-col"
            initial={false}
            animate={{ marginLeft: isAnyItemActive ? '180px' : '80px' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <Header />
          <main className="flex-1 p-4 lg:p-6">{children}</main>
        </motion.div>
      </div>
  );
}
