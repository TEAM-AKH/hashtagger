
'use client';

import { Search, Bell, CircleUser } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { ModeToggle } from './dark-mode-toggle';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      <div className="relative ml-auto flex-1 md:grow-0">
         <div id="halo-search">
              <div className="aurora-glow"></div>
              <div className="outer-ring"></div>
              <div className="outer-ring"></div>
              <div className="outer-ring"></div>
              <div className="inner-glow"></div>
              <div className="main-border"></div>
              <div id="search-wrapper">
                <input
                    placeholder="Search..."
                    type="text"
                    name="text"
                    className="search-field"
                  />
                  <div className="absolute top-1/2 right-3 -translate-y-1/2 z-[2]">
                     <Search className="h-5 w-5 text-muted-foreground" />
                  </div>
              </div>
          </div>
      </div>
      <ModeToggle />
      <Button variant="ghost" size="icon" className="rounded-full">
        <Bell className="h-5 w-5" />
        <span className="sr-only">Notifications</span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://picsum.photos/100" alt="@user" data-ai-hint="person selfie"/>
              <AvatarFallback>
                 <CircleUser className="h-5 w-5 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
             <span className="sr-only">User menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild><Link href="/profile">Profile</Link></DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
