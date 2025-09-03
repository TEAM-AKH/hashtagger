
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
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import {
  CircleDot,
  MessageSquare,
  Clapperboard,
  Film,
  BrainCircuit,
  Radio,
  History,
  User,
  Settings,
} from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { href: '/circles', label: 'Circles', icon: CircleDot },
  { href: '/chat', label: 'Chit Chat', icon: MessageSquare },
  { href: '/clips', label: 'Clips', icon: Clapperboard },
  { href: '/flicks', label: 'Flicks', icon: Film },
  { href: '/home', label: 'Home', icon: Logo, isHome: true },
  { href: '/memory-bank', label: 'Memory Bank', icon: BrainCircuit },
  { href: '/stream', label: 'Stream', icon: Radio },
  { href: '/instant-updates', label: 'Instant Updates', icon: History },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function SideNav() {
  const pathname = usePathname();

  return (
      <div className="flex flex-col h-full">
        <SidebarHeader className="p-4">
            <Logo />
        </SidebarHeader>
        <SidebarContent className="flex-grow">
            <SidebarMenu>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href) && !item.isHome || pathname === item.href;
              
              if (item.isHome) {
                return (
                  <SidebarMenuItem key={item.href} className="my-4">
                    <TooltipWrapper label={item.label}>
                       <Link href={item.href}>
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 10 }}
                          whileTap={{ scale: 0.9 }}
                          className={`
                            relative mx-auto flex h-16 w-16 items-center justify-center rounded-full
                             bg-primary text-primary-foreground shadow-lg
                          `}
                        >
                            <Icon className="h-10 w-10" />
                        </motion.div>
                      </Link>
                    </TooltipWrapper>
                  </SidebarMenuItem>
                );
              }

              return (
                <SidebarMenuItem key={item.href}>
                  <TooltipWrapper label={item.label}>
                    <Link href={item.href} className="flex flex-col items-center">
                      <motion.div
                        whileHover={{ y: -4 }}
                        className="relative"
                      >
                         <div className={`
                            absolute -inset-2 rounded-full transition-all duration-300
                            ${isActive ? 'bg-primary/20 scale-100' : 'scale-0 group-hover:scale-100'}
                         `}/>
                         <div className={`
                           relative flex h-12 w-12 items-center justify-center rounded-full
                           transition-colors duration-300
                           ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'}
                         `}>
                          <Icon className="h-6 w-6" />
                        </div>
                      </motion.div>
                      <span className="mt-2 text-xs font-medium text-foreground/80 group-hover:text-primary">
                        {item.label}
                      </span>
                    </Link>
                  </TooltipWrapper>
                </SidebarMenuItem>
              );
            })}
            </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
             <SidebarMenu>
                 <SidebarMenuItem>
                      <TooltipWrapper label="Settings">
                         <Link href="/settings" className="flex flex-col items-center">
                             <motion.div
                                whileHover={{ y: -4 }}
                                className="relative"
                             >
                                 <div className={`
                                   relative flex h-12 w-12 items-center justify-center rounded-full
                                   bg-muted/50 text-muted-foreground transition-colors duration-300
                                   group-hover:bg-primary/10 group-hover:text-primary
                                 `}>
                                     <Settings className="h-6 w-6"/>
                                 </div>
                             </motion.div>
                              <span className="mt-2 text-xs font-medium text-foreground/80 group-hover:text-primary">
                                Settings
                              </span>
                         </Link>
                      </TooltipWrapper>
                 </SidebarMenuItem>
             </SidebarMenu>
        </SidebarFooter>
      </div>
  );
}

const TooltipWrapper = ({ label, children }: { label: string, children: React.ReactNode }) => {
    return (
        <div className="group relative flex justify-center">
            {children}
        </div>
    )
}
