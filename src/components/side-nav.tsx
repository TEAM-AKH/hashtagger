
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Circle, MessageSquare, Video, Bookmark, History, Radio, Compass, Rss, Film, Clapperboard } from 'lucide-react';
import { SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarContent, SidebarFooter } from '@/components/ui/sidebar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Hash, User, Settings } from 'lucide-react';
import { QuickAccessIcon } from './quick-access-icon';

const mainLinks = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/', label: 'Circles', icon: Circle },
  { href: '/chat', label: 'Chit Chat', icon: MessageSquare },
  { href: '/clips', label: 'Clips', icon: Clapperboard },
  { href: '/flicks', label: 'Flicks', icon: Film },
  { href: '/memory-bank', label: 'Memory Bank', icon: Bookmark },
  { href: '/stream', label: 'Stream', icon: Radio },
  { href: '/instant-updates', label: 'Instant Updates', icon: Compass },
];


export default function SideNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarContent>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                 <SidebarHeader>
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                            <Hash className="h-6 w-6 text-primary-foreground"/>
                        </div>
                        <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">Hastagger</span>
                    </div>
                 </SidebarHeader>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start" className="w-56">
                <DropdownMenuItem asChild><Link href="#"><QuickAccessIcon className="mr-2 h-4 w-4" /><span>Quick Access</span></Link></DropdownMenuItem>
                {mainLinks.map(link => (
                    <DropdownMenuItem key={link.href} asChild><Link href={link.href}><link.icon className="mr-2 h-4 w-4" /><span>{link.label}</span></Link></DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>

        <SidebarMenu>
          {mainLinks.map((link) => (
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
      </SidebarContent>

       <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname.startsWith('/profile')} tooltip="Profile">
              <Link href="/profile">
                <User className="h-5 w-5" />
                <span className="group-data-[collapsible=icon]:hidden">Profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
              <Link href="/settings">
                <Settings className="h-5 w-5" />
                <span className="group-data-[collapsible=icon]:hidden">Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
