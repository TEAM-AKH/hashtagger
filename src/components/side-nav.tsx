
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquare, Clapperboard, Film, User, Settings, BrainCircuit, Radio, History, CircleDot } from 'lucide-react';
import { SidebarContent, SidebarFooter, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Logo } from './logo';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const topLinks = [
  { href: '/circles', label: 'Circles', icon: CircleDot },
  { href: '/chat', label: 'Chit Chat', icon: MessageSquare },
  { href: '/clips', label: 'Clips', icon: Clapperboard },
  { href: '/flicks', label: 'Flicks', icon: Film },
];

const bottomLinks = [
    { href: '/memory-bank', label: 'Memory Bank', icon: BrainCircuit },
    { href: '/stream', label: 'Stream', icon: Radio },
    { href: '/instant-updates', label: 'Instant Updates', icon: History },
    { href: '/profile', label: 'Profile', icon: User },
]

export default function SideNav() {
  const pathname = usePathname();

  const menuButton = (link: typeof topLinks[0], isCenter = false) => (
    <SidebarMenuButton
      asChild
      isActive={pathname.startsWith(link.href)}
      className={cn(
        "justify-center transition-transform duration-200 ease-in-out hover:-translate-y-1",
         isCenter ? "h-16 w-16 rounded-full hover:scale-110" : "h-12 w-12 rounded-full"
      )}
    >
      <Link href={link.href} className="flex flex-col items-center justify-center gap-1">
        <link.icon className={isCenter ? "h-8 w-8" : "h-6 w-6"} />
        <span className="text-xs font-medium group-data-[state=collapsed]:hidden">{link.label}</span>
      </Link>
    </SidebarMenuButton>
  )

  return (
    <>
      <SidebarContent>
        <SidebarMenu className="items-center flex-grow justify-center gap-4">
            {topLinks.map((link) => (
              <SidebarMenuItem key={link.href}>
                {menuButton(link)}
              </SidebarMenuItem>
            ))}

            <SidebarMenuItem className="my-4">
              {menuButton({href: '/home', label: 'Home', icon: Logo}, true)}
            </SidebarMenuItem>

            {bottomLinks.map((link) => (
              <SidebarMenuItem key={link.href}>
                {menuButton(link)}
              </SidebarMenuItem>
            ))}
        </SidebarMenu>
      </SidebarContent>

       <SidebarFooter className="items-center">
        <SidebarMenu className="items-center">
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings" asChild className="h-12 w-12 rounded-full justify-center">
               <Link href="/settings">
                <Settings className="h-6 w-6" />
                 <span className="sr-only">Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
