
'use client';
import type { ReactNode } from 'react';
import Header from '@/components/header';
import SideNav from './side-nav';
import { AssistiveTouch } from './assistive-touch';

function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen">
            <SideNav />
            <div
                className="flex-1 flex flex-col pl-20"
            >
                <Header />
                <main className="flex-1 p-4 lg:p-6">{children}</main>
            </div>
            <AssistiveTouch />
        </div>
    )
}

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <Layout>{children}</Layout>
  );
}

    