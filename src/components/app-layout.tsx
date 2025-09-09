
'use client';
import type { ReactNode } from 'react';
import Header from '@/components/header';
import SideNav, { useSideNav, SideNavProvider } from './side-nav';
import { motion } from 'framer-motion';

function Layout({ children }: { children: ReactNode }) {
    const { isExpanded } = useSideNav();

    return (
        <div className="flex min-h-screen">
            <SideNav />
            <motion.div
                className="flex-1 flex flex-col"
                initial={false}
                animate={{ marginLeft: isExpanded ? '180px' : '80px' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
                <Header />
                <main className="flex-1 p-4 lg:p-6">{children}</main>
            </motion.div>
        </div>
    )
}

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SideNavProvider>
        <Layout>{children}</Layout>
    </SideNavProvider>
  );
}
