'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Circle, Video, MessageSquare, History, Bookmark, Radio, Gamepad2, Film } from 'lucide-react';
import { SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarContent, SidebarFooter } from '@/components/ui/sidebar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Hash, User, Settings, LogOut } from 'lucide-react';

const mainLinks = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/', label: 'Circles', icon: Circle },
  { href: '/clips', label: 'Clips', icon: Video },
  { href: '/chat', label: 'Chit Chat', icon: MessageSquare },
  { href: '/feeds', label: 'Dynamic Feeds', icon: History },
  { href: '/memory-bank', label: 'Memory Bank', icon: Bookmark },
  { href: '/stream', label: 'Stream', icon: Radio },
  { href: '/fun-arena', label: 'Fun Arena', icon: Gamepad2 },
  { href: '/videos', label: 'Videos', icon: Film },
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
                <DropdownMenuItem asChild><Link href="/home"><Home className="mr-2 h-4 w-4" /><span>Home</span></Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/"><Circle className="mr-2 h-4 w-4" /><span>Circles</span></Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/clips"><Video className="mr-2 h-4 w-4" /><span>Clips</span></Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/chat"><MessageSquare className="mr-2 h-4 w-4" /><span>Chit Chat</span></Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/feeds"><History className="mr-2 h-4 w-4" /><span>Dynamic Feeds</span></Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/memory-bank"><Bookmark className="mr-2 h-4 w-4" /><span>Memory Bank</span></Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/stream"><Radio className="mr-2 h-4 w-4" /><span>Stream</span></Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/fun-arena"><Gamepad2 className="mr-2 h-4 w-4" /><span>Fun Arena</span></Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/videos"><Film className="mr-2 h-4 w-4" /><span>Videos</span></Link></DropdownMenuItem>
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
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Logout">
              <Link href="/logout">
                <LogOut className="h-5 w-5" />
                <span className="group-data-[collapsible=icon]:hidden">Logout</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
