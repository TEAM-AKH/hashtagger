
import type { ReactNode } from 'react';
import SideNav from '@/components/side-nav';
import Header from '@/components/header';
import { SidebarProvider } from '@/components/ui/sidebar';


export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <SideNav />
        <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
