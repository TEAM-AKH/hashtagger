
'use client';
import type { ReactNode } from 'react';
import Header from '@/components/header';
import SideNav, { SideNavProvider } from './side-nav';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

function Layout({ children }: { children: ReactNode }) {
    const isMobile = useIsMobile();
    const marginLeft = isMobile ? '72px' : '96px';

    return (
        <div className="flex min-h-screen">
            <SideNav />
            <motion.div
                className="flex-1 flex flex-col"
                initial={{ marginLeft: '0px' }}
                animate={{ marginLeft }}
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

    