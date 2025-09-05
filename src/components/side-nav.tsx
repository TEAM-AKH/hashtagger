
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Users,
  Film,
  BrainCircuit,
  Radio,
  History,
  Settings,
  CircleDot,
  Compass,
  User,
  Clapperboard,
  Home,
} from 'lucide-react';
import { Logo } from './logo';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';


const mainNavItems = [
  { href: '/chat', label: 'ChitChat', icon: Users },
  { href: '/clips', label: 'Clips', icon: Clapperboard },
  { href: '/hashflicks', label: 'HASHFLICKS', icon: Film },
];

const secondaryNavItems = [
  { href: '/memory-bank', label: 'Memory Bank', icon: BrainCircuit },
  { href: '/stream', label: 'Stream', icon: Radio },
  { href: '/instant-updates', label: 'Updates', icon: History },
  { href: '/dynamic-feeds', label: 'Dynamic Feeds', icon: Compass },
];

const profileNavItems = [
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/settings', label: 'Settings', icon: Settings },
]

export default function SideNav() {
  const pathname = usePathname();
  const { state } = useSidebar();


  return (
      <Sidebar>
        <SidebarContent>
          <SidebarMenu>
            {mainNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                  size="lg"
                >
                  <Link href={item.href}>
                    <item.icon className="h-6 w-6" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>

          <SidebarMenu>
             <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/home'}
                  tooltip="Home"
                  size="lg"
                  className="h-16 w-16"
                >
                  <Link href="/home">
                    <Logo className="h-10 w-10" />
                    <span className="sr-only">Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
          </SidebarMenu>


           <SidebarMenu>
             {secondaryNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                  size="lg"
                >
                  <Link href={item.href}>
                    <item.icon className="h-6 w-6" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
           </SidebarMenu>

           <SidebarMenu className="mt-auto">
             {profileNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                   size="lg"
                >
                  <Link href={item.href}>
                    <item.icon className="h-6 w-6" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
           </SidebarMenu>
        </SidebarContent>
      </Sidebar>
  );
}
