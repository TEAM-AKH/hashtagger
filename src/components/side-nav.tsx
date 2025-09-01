'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, Share2, Hash } from 'lucide-react';
import { SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

const links = [
  { href: '/home', label: 'Home Feed', icon: Home },
  { href: '/', label: 'Connections', icon: Share2 },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function SideNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader className="group-data-[collapsible=icon]:-ml-1">
        <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Hash className="h-6 w-6 text-primary-foreground"/>
            </div>
            <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">Hastagger</span>
        </div>
      </SidebarHeader>
      <SidebarMenu>
        {links.map((link) => (
          <SidebarMenuItem key={link.label}>
            <SidebarMenuButton
              asChild
              isActive={pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))}
              tooltip={link.label}
            >
              <Link href={link.href}>
                <link.icon className="h-5 w-5" />
                <span className="group-data-[collapsible=icon]:hidden">{link.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </>
  );
}
