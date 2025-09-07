
import type { ReactNode } from 'react';
import Header from '@/components/header';
import SideNav from './side-nav';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
      <div className="flex min-h-screen">
        <SideNav />
        <div className="flex-1 flex flex-col ml-20">
          <Header />
          <main className="flex-1 p-4 lg:p-6">{children}</main>
        </div>
      </div>
  );
}
