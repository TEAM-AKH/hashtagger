
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Users,
  Film,
  BrainCircuit,
  Radio,
  History,
  Settings,
  User,
  Clapperboard,
  Home,
  Compass,
  Circle,
} from 'lucide-react';
import { motion } from 'framer-motion';

const topNavItems = [
  { href: '/chat', label: 'ChitChat', icon: Users },
  { href: '/clips', label: 'Clips', icon: Clapperboard },
  { href: '/hashflicks', label: 'HASHFLICKS', icon: Film },
  { href: '/circles', label: 'Circles', icon: Circle },
];

const bottomNavItems = [
  { href: '/memory-bank', label: 'Memory Bank', icon: BrainCircuit },
  { href: '/stream', label: 'Stream', icon: Radio },
  { href: '/instant-updates', label: 'Updates', icon: History },
  { href: '/dynamic-feeds', label: 'Dynamic Feeds', icon: Compass },
];

const profileNavItems = [
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/settings', label: 'Settings', icon: Settings },
]

const FADE_IN_VARIANTS = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export default function SideNav() {
  const pathname = usePathname();
  const { state } = useSidebar();


  return (
      <Sidebar>
        <SidebarContent>
          <motion.div 
            initial="initial"
            animate={state === 'expanded' ? 'animate' : 'exit'}
            variants={{
                animate: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
            }}
            className="flex flex-col items-center w-full"
          >
            <SidebarMenu>
                {topNavItems.map((item) => (
                <motion.div key={item.href} variants={FADE_IN_VARIANTS} className="w-full">
                    <SidebarMenuItem>
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
                 </motion.div>
                ))}
            </SidebarMenu>

            <SidebarMenu>
                <motion.div variants={FADE_IN_VARIANTS} className="w-full">
                    <SidebarMenuItem>
                        <SidebarMenuButton
                        asChild
                        isActive={pathname === '/home'}
                        tooltip="Hastagger"
                        size="lg"
                        className="h-16 w-16"
                        >
                        <Link href="/home">
                            <Home className="h-10 w-10" />
                            <span className="sr-only">Hastagger</span>
                        </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </motion.div>
            </SidebarMenu>


            <SidebarMenu>
                {bottomNavItems.map((item) => (
                    <motion.div key={item.href} variants={FADE_IN_VARIANTS} className="w-full">
                        <SidebarMenuItem>
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
                    </motion.div>
                ))}
            </SidebarMenu>

            <SidebarMenu className="mt-auto">
                {profileNavItems.map((item) => (
                <motion.div key={item.href} variants={FADE_IN_VARIANTS} className="w-full">
                    <SidebarMenuItem>
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
                    </motion.div>
                ))}
            </SidebarMenu>
          </motion.div>
        </SidebarContent>
      </Sidebar>
  );
}
