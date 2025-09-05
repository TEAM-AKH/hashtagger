
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
  Home,
  Users,
  Film,
  Video,
  BrainCircuit,
  Radio,
  History,
  Settings,
  CircleDot,
  Compass,
  User,
  Clapperboard,
} from 'lucide-react';
import { Logo } from './logo';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';


const mainNavItems = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/circles', label: 'Circles', icon: CircleDot },
  { href: '/chat', label: 'ChitChat', icon: Users },
  { href: '/clips', label: 'Clips', icon: Clapperboard },
  { href: '/hashflicks', label: 'HASHFLICKS', icon: Film },
];

const secondaryNavItems = [
  { href: '/memory-bank', label: 'Memory Bank', icon: BrainCircuit },
  { href: '/stream', label: 'Stream', icon: Radio },
  { href: '/instant-updates', label: 'Updates', icon: History },
];

export default function SideNav() {
  const pathname = usePathname();
  const { state } = useSidebar();


  return (
      <Sidebar
        onMouseEnter={() => {}}
        onMouseLeave={() => {}}
       >
        <SidebarContent>
          <SidebarHeader>
            <Logo />
             <div className={cn("transition-opacity duration-200", state === 'collapsed' ? 'opacity-0' : 'opacity-100')}>
                <h2 className="font-semibold text-lg">Hastagger</h2>
             </div>
          </SidebarHeader>
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

           <SidebarMenu className="mt-auto">
             {secondaryNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
           </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <div className="w-full border-t border-sidebar-border pt-2">
                <SidebarMenuButton asChild tooltip="Profile">
                     <Link href="/profile">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="https://picsum.photos/100" alt="@user" />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <span>Profile</span>
                    </Link>
                </SidebarMenuButton>
            </div>
        </SidebarFooter>
      </Sidebar>
  );
}
