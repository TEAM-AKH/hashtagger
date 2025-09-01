import type { ReactNode } from 'react';
import { Sidebar, SidebarInset } from '@/components/ui/sidebar';
import SideNav from '@/components/side-nav';
import Header from '@/components/header';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Sidebar>
        <SideNav />
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </SidebarInset>
    </>
  );
}
