import type { ReactNode } from 'react';
import Header from '@/components/header';
import BottomNav from './bottom-nav';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="ml-0">
        <Header />
        <main className="p-4 lg:p-6 pb-28">
          {children}
        </main>
      </div>
      <BottomNav />
    </>
  );
}
