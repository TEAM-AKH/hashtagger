
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquare, Clapperboard, Film, User, Settings } from 'lucide-react';
import { SidebarContent, SidebarFooter, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Logo } from './logo';
import { cn } from '@/lib/utils';

const topLinks = [
  { href: '/chat', label: 'Chit Chat', icon: MessageSquare },
  { href: '/clips', label: 'Clips', icon: Clapperboard },
];

const bottomLinks = [
    { href: '/flicks', label: 'Flicks', icon: Film },
    { href: '/profile', label: 'Profile', icon: User },
]


export default function SideNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarContent>
        <SidebarMenu className="items-center flex-grow justify-center">
            <div className="flex flex-col items-center gap-4">
              {topLinks.map((link) => (
                <SidebarMenuItem key={link.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(link.href)}
                    tooltip={link.label}
                    className="h-12 w-12 rounded-full justify-center transition-transform duration-200 ease-in-out hover:-translate-y-1"
                  >
                    <Link href={link.href}>
                      <link.icon className="h-6 w-6" />
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </div>

            <SidebarMenuItem className="my-4">
               <SidebarMenuButton
                asChild
                isActive={pathname === '/home' || pathname === '/'}
                tooltip="Home"
                className="h-16 w-16 rounded-full justify-center transition-transform duration-200 ease-in-out hover:scale-110"
              >
                <Link href="/home">
                  <Logo className="h-8 w-8" />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <div className="flex flex-col items-center gap-4">
              {bottomLinks.map((link) => (
                <SidebarMenuItem key={link.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(link.href)}
                    tooltip={link.label}
                    className="h-12 w-12 rounded-full justify-center transition-transform duration-200 ease-in-out hover:-translate-y-1"
                  >
                     <Link href={link.href}>
                      <link.icon className="h-6 w-6" />
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </div>
        </SidebarMenu>
      </SidebarContent>

       <SidebarFooter className="items-center">
        <SidebarMenu className="items-center">
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings" className="h-12 w-12 rounded-full justify-center">
               <Link href="/settings">
                <Settings className="h-6 w-6" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
