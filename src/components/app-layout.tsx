
import type { ReactNode } from 'react';
import Header from '@/components/header';
import BottomNav from './bottom-nav';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 p-4 lg:p-6 mb-20">{children}</main>
        <BottomNav />
      </div>
  );
}
