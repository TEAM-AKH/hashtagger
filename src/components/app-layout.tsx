import type { ReactNode } from 'react';
import SideNav from '@/components/side-nav';
import Header from '@/components/header';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SideNav />
      <div className="ml-0 md:ml-24">
        <Header />
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </>
  );
}
