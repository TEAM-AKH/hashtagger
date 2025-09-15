
'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, MoreHorizontal, Edit, Trash2, UserX, Users, X, Calendar, MapPin, Download, Save, ArrowRight } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useMediaQuery } from '@/hooks/use-media-query';
import { events, addEvent } from '@/lib/events-data';
import Link from 'next/link';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

const initialCircles = [
  { id: 1, name: "Project Team", image: "https://picsum.photos/seed/1/100", members: ["Alice", "Bob", "Charlie"], lastVisited: Date.now() - 10000 },
  { id: 2, name: "Close Friends", image: "https://picsum.photos/seed/2/100", members: ["David", "Eve"], lastVisited: Date.now() - 20000 },
  { id: 3, name: "Gaming Squad", image: "https://picsum.photos/seed/3/100", members: ["Frank", "Grace", "Heidi"], lastVisited: Date.now() - 30000 },
  { id: 4, name: "Family", image: "https://picsum.photos/seed/4/100", members: ["Ivan", "Judy"], lastVisited: Date.now() - 40000 },
  { id: 5, name: "Book Club", image: "https://picsum.photos/seed/5/100", members: ["Mallory", "Niaj"], lastVisited: Date.now() - 50000 },
  { id: 6, name: "Hiking Group", image: "https://picsum.photos/seed/6/100", members: ["Oscar", "Peggy"], lastVisited: Date.now() - 60000 },
  { id: 7, name: "Travel Buddies", image: "https://picsum.photos/seed/7/100", members: ["Quentin", "Rachel"], lastVisited: Date.now() - 70000 },
  { id: 8, name: "Movie Buffs", image: "https://picsum.photos/seed/8/100", members: ["Steve", "Tina"], lastVisited: Date.now() - 80000 },
  { id: 9, name: "Coders", image: "https://picsum.photos/seed/9/100", members: ["Ursula", "Vince"], lastVisited: Date.now() - 90000 },
  { id: 10, name: "Musicians", image: "https://picsum.photos/seed/10/100", members: ["Walter", "Xena"], lastVisited: Date.now() - 100000 },
  { id: 11, name: "Foodies", image: "https://picsum.photos/seed/11/100", members: ["Yara", "Zane"], lastVisited: Date.now() - 110000 },
  { id: 12, name: "Artists", image: "https://picsum.photos/seed/12/100", members: ["Amy", "Ben"], lastVisited: Date.now() - 120000 },
  { id: 13, name: "Entrepreneurs", image: "https://picsum.photos/seed/13/100", members: ["Carla", "Dan"], lastVisited: Date.now() - 130000 },
  { id: 14, name: "Volunteers", image: "https://picsum.photos/seed/14/100", members: ["Eli", "Fiona"], lastVisited: Date.now() - 140000 },
  { id: 15, name: "Yoga Class", image: "https://picsum.photos/seed/15/100", members: ["George", "Hannah"], lastVisited: Date.now() - 150000 },
];

const MAX_INNER_RING = 6;
const MAX_OUTER_RING = 8;

export default function ConnectionsPage() {
  const [items, setItems] = useState(initialCircles);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isCircleDetailsOpen, setIsCircleDetailsOpen] = useState(false);
  const [selectedCircle, setSelectedCircle] = useState<any>(null);
  const [isRemovingMembers, setIsRemovingMembers] = useState(false);
  const [membersToRemove, setMembersToRemove] = useState<string[]>([]);

  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => b.lastVisited - a.lastVisited);
  }, [items]);

  const { rings, sidebarItems, ringLayouts } = useMemo(() => {
    const innerRingItems = sortedItems.slice(0, MAX_INNER_RING);
    const outerRingItems = sortedItems.slice(MAX_INNER_RING, MAX_INNER_RING + MAX_OUTER_RING);
    const sidebarItems = sortedItems.slice(MAX_INNER_RING + MAX_OUTER_RING);

    const baseOuterRadius = isSmallScreen ? 180 : 320;
    const baseInnerRadius = isSmallScreen ? 90 : 160;
    
    const baseOuterSize = isSmallScreen ? 60 : 90;
    const baseInnerSize = isSmallScreen ? 45 : 70;

    const ringLayouts = [
      { radius: baseInnerRadius, size: baseInnerSize },
      { radius: baseOuterRadius, size: baseOuterSize }
    ];

    return { rings: [innerRingItems, outerRingItems], sidebarItems, ringLayouts };
  }, [sortedItems, isSmallScreen]);

  const handleCreateCircleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const nameInput = form.elements.namedItem('circleName') as HTMLInputElement;
    if (nameInput.value) {
        const newId = (items.length > 0 ? Math.max(...items.map(i => i.id)) : 0) + 1;
        const newCircle = {
          id: newId,
          name: nameInput.value,
          image: `https://picsum.photos/seed/${newId}/100`,
          members: ["You"],
          lastVisited: Date.now(),
        };
        setItems(prevItems => [newCircle, ...prevItems].sort((a,b) => b.lastVisited - a.lastVisited));
        setIsCreateDialogOpen(false);
    }
  };
  
  const removeCircle = (id: number) => {
    setItems(items.filter(item => item.id !== id));
    closeCircleDetails();
  };
  
  const openCircleDetails = (item: any) => {
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, lastVisited: Date.now() } : i));
    setSelectedCircle(item);
    setIsCircleDetailsOpen(true);
  }
  
  const closeCircleDetails = () => {
    setIsCircleDetailsOpen(false);
    setIsRemovingMembers(false);
    setMembersToRemove([]);
    setTimeout(() => setSelectedCircle(null), 300);
  }

  const handleRenameSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const nameInput = form.elements.namedItem('name') as HTMLInputElement;
    if (nameInput.value && selectedCircle) {
      const newName = nameInput.value;
      setItems(items.map(item => item.id === selectedCircle.id ? { ...item, name: newName } : item));
      setSelectedCircle((prev: any) => ({ ...prev, name: newName }));
      setIsRenameDialogOpen(false);
    }
  };
  
  const handleAddMemberSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const nameInput = form.elements.namedItem('memberName') as HTMLInputElement;
    if (nameInput.value && selectedCircle) {
        const newMemberName = nameInput.value;
        const updatedMembers = [...selectedCircle.members, newMemberName];
        setItems(items.map(item =>
            item.id === selectedCircle.id
                ? { ...item, members: updatedMembers }
                : item
        ));
        setSelectedCircle((prev: any) => ({ ...prev, members: updatedMembers }));
        setIsAddMemberDialogOpen(false);
    }
};

  const openRenameDialog = () => {
    setIsRenameDialogOpen(true);
  }
  
  const handleMemberSelection = (member: string) => {
    setMembersToRemove(prev => 
        prev.includes(member) 
            ? prev.filter(m => m !== member)
            : [...prev, member]
    );
  };

  const confirmRemoveMembers = () => {
    if (!selectedCircle) return;
    const updatedMembers = selectedCircle.members.filter((m: string) => !membersToRemove.includes(m));
    
    setItems(items.map(item => 
        item.id === selectedCircle.id 
            ? { ...item, members: updatedMembers } 
            : item
    ));
    
    setSelectedCircle((prev: any) => ({ ...prev, members: updatedMembers }));
    
    setIsRemovingMembers(false);
    setMembersToRemove([]);
  };

  const handleCreateEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newEvent = {
        id: Date.now(),
        name: formData.get('event-name') as string,
        location: formData.get('event-location') as string,
        startDate: formData.get('start-date') as string,
        startTime: formData.get('start-time') as string,
        endDate: formData.get('end-date') as string,
        endTime: formData.get('end-time') as string,
        attendees: [],
        status: 'ongoing',
    };
    addEvent(newEvent);
    setIsEventDialogOpen(false);
  }


  return (
    <div className="flex justify-between items-start min-h-[calc(100vh-8rem)] bg-background overflow-hidden relative p-4 gap-4">
      <div className="flex-grow flex flex-col items-center justify-center relative w-full h-full">
          <div className="text-center mb-4 z-10 absolute top-0 pt-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 pb-2">
              Your Connection Orbit
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              A dynamic view of your social universe.
            </p>
          </div>
          
          <div className="relative w-full h-full flex items-center justify-center min-w-[400px] min-h-[400px] md:min-w-[800px] md:min-h-[800px]">
            {/* Central Circle */}
            <motion.div
              className="absolute w-28 h-28 rounded-full flex items-center justify-center bg-card shadow-xl border-4 border-primary/50 z-20"
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Logo className="h-20 w-20" />
            </motion.div>

            {/* Orbiting Rings */}
            <AnimatePresence>
              {rings.map((ring, ringIndex) => {
                if (!ringLayouts[ringIndex]) return null;
                const { radius, size } = ringLayouts[ringIndex];

                return (
                  <motion.div
                    key={`ring-${ringIndex}`}
                    className="absolute rounded-full border border-dashed border-muted-foreground/30"
                    style={{ width: radius * 2, height: radius * 2 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ opacity: { duration: 1, delay: 0.5 } }}
                  >
                    {ring.map((item, i) => {
                      const angle = (i / ring.length) * 2 * Math.PI;
                      const x = (radius - size / 2) + radius * Math.cos(angle);
                      const y = (radius - size / 2) + radius * Math.sin(angle);
                      
                      return (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, scale: 0, x: radius, y: radius, rotate: 0 }}
                           animate={{
                              left: x,
                              top: y,
                              width: size,
                              height: size,
                              opacity: 1,
                              scale: 1,
                              rotate: [0, 360],
                              x:0,
                              y:0
                            }}
                          exit={{ opacity: 0, scale: 0, x: radius, y: radius, rotate: 0, transition: { duration: 0.5 } }}
                          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                          whileHover={{ scale: 1.1, zIndex: 20, boxShadow: "0 0 15px hsl(var(--primary))" }}
                          className="absolute flex items-center justify-center rounded-full border-4 border-primary/30 bg-background shadow-md overflow-hidden cursor-pointer"
                          onClick={() => openCircleDetails(item)}
                        >
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="w-full h-full rounded-full">
                                  <Image src={item.image} alt={item.name} fill className="object-cover rounded-full" />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{item.name}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <Button onClick={() => setIsCreateDialogOpen(true)} className="absolute bottom-8 left-8 z-10">
            <Plus className="mr-2 h-4 w-4" /> Add Circle
          </Button>

          <Button onClick={() => setIsEventDialogOpen(true)} className="absolute bottom-8 right-8 z-10">
            <Calendar className="mr-2 h-4 w-4" /> Create Event
          </Button>
      </div>

      <aside className="w-80 h-[calc(100vh-9rem)] sticky top-20 flex-shrink-0">
          <Card className="h-full w-full overflow-y-auto">
              <CardHeader>
                  <CardTitle>Events & Circles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">Ongoing Events</h3>
                   {events.filter(e => e.status === 'ongoing').length > 0 ? (
                      <div className="space-y-2">
                        {events.filter(e => e.status === 'ongoing').map(event => (
                           <Link href={`/events/${event.id}`} key={event.id}>
                              <div className="p-3 rounded-md border hover:bg-muted cursor-pointer">
                                 <p className="font-semibold">{event.name}</p>
                                 <p className="text-xs text-muted-foreground">Ends: {new Date(event.endDate).toLocaleDateString()}</p>
                                  <div className="flex items-center gap-1.5 text-green-500 mt-1">
                                      <div className="h-2 w-2 rounded-full bg-green-500"/>
                                      <span className="text-xs font-semibold">Current</span>
                                  </div>
                              </div>
                           </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground text-center py-4">No ongoing events.</p>
                    )}
                     <Button variant="link" size="sm" asChild className="w-full mt-2">
                        <Link href="/events">View All Events</Link>
                    </Button>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">More Circles</h3>
                   {sidebarItems.length > 0 ? (
                      <div className="space-y-2">
                        {sidebarItems.map(item => (
                          <div key={item.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer" onClick={() => openCircleDetails(item)}>
                              <Avatar className="h-8 w-8">
                                  <AvatarImage src={item.image} />
                                  <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-sm">{item.name}</span>
                              <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground"/>
                          </div>
                        ))}
                      </div>
                   ) : (
                      <p className="text-xs text-muted-foreground text-center py-4">All your circles are in orbit.</p>
                   )}
                </div>
              </CardContent>
          </Card>
      </aside>

       <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Circle</DialogTitle>
                    <DialogDescription>Give your new circle a name to get started.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateCircleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="circleName" className="text-right">Name</Label>
                            <Input id="circleName" placeholder="e.g. Hiking Crew" className="col-span-3" required />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="secondary" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                        <Button type="submit">Create</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>

       <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Rename Circle</DialogTitle>
                    <DialogDescription>
                       Give this circle a new name.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleRenameSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input id="name" defaultValue={selectedCircle?.name} className="col-span-3" required />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="secondary" onClick={() => setIsRenameDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">Save</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>

        <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Member</DialogTitle>
                    <DialogDescription>Enter the name of the new member to add to this circle.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddMemberSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="memberName" className="text-right">Name</Label>
                            <Input id="memberName" placeholder="e.g. John Doe" className="col-span-3" required />
                        </div>
                    </div>
                    <DialogFooter>
                         <Button type="button" variant="secondary" onClick={() => setIsAddMemberDialogOpen(false)}>Cancel</Button>
                         <Button type="submit">Add Member</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
        
       <Dialog open={isCircleDetailsOpen} onOpenChange={closeCircleDetails}>
            <DialogContent className="sm:max-w-md p-0">
                <DialogHeader className="p-6 pb-4 flex flex-row items-start justify-between">
                    <div className="flex items-center gap-4">
                        <DialogTitle className="text-2xl font-bold">{selectedCircle?.name}</DialogTitle>
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                <DropdownMenuItem onClick={openRenameDialog}>
                                    <Edit className="mr-2 h-4 w-4" /> Rename Circle
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setIsRemovingMembers(true)}>
                                    <UserX className="mr-2 h-4 w-4" /> Remove Members
                                </DropdownMenuItem>
                                 <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                                          <Trash2 className="mr-2 h-4 w-4" /> Remove Circle
                                      </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>This action will permanently delete the "{selectedCircle?.name}" circle.</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => removeCircle(selectedCircle.id)}>Confirm</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                     <DialogClose asChild>
                         <Button variant="ghost" size="icon"><X/></Button>
                    </DialogClose>
                </DialogHeader>
                <div className="px-6 pb-6 space-y-4 max-h-[50vh] overflow-y-auto">
                    <h3 className="flex items-center gap-2 font-semibold text-muted-foreground"><Users className="h-5 w-5" /> Members ({selectedCircle?.members?.length})</h3>
                    <ul className="space-y-3">
                      {selectedCircle?.members.map((member: string) => (
                        <li key={member} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${member}`} />
                                <AvatarFallback>{member.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{member}</span>
                          </div>
                          {isRemovingMembers && <Checkbox checked={membersToRemove.includes(member)} onCheckedChange={() => handleMemberSelection(member)} />}
                        </li>
                      ))}
                    </ul>
                </div>
                <DialogFooter className="p-4 border-t bg-muted/50 flex justify-between w-full">
                    {isRemovingMembers ? (
                        <>
                            <Button variant="secondary" onClick={() => { setIsRemovingMembers(false); setMembersToRemove([]); }}>Cancel</Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" disabled={membersToRemove.length === 0}>
                                        Remove {membersToRemove.length} Member{membersToRemove.length !== 1 && 's'}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will permanently remove {membersToRemove.length} member{membersToRemove.length !== 1 && 's'} from this circle. This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={confirmRemoveMembers}>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </>
                    ) : (
                        <>
                            <Button variant="outline" onClick={() => setIsAddMemberDialogOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Member</Button>
                            <Button onClick={closeCircleDetails}>Close</Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Create a New Event</DialogTitle>
                    <DialogDescription>Organize a get-together for your circles and friends.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateEvent}>
                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="event-name">Event Name</Label>
                            <Input id="event-name" name="event-name" placeholder="e.g. Summer BBQ" required />
                        </div>
                        <div className="space-y-2">
                            <Label>Convene People or Circles</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start font-normal">
                                        <Plus className="mr-2 h-4 w-4"/> Add Members or Circles
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[300px]">
                                    <p className="p-4 text-center text-sm text-muted-foreground">Functionality to add members and circles coming soon.</p>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="start-date">Start Date</Label>
                                <Input id="start-date" name="start-date" type="date" required/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="start-time">Start Time</Label>
                                <Input id="start-time" name="start-time" type="time" required/>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="end-date">End Date</Label>
                                <Input id="end-date" name="end-date" type="date" required/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="end-time">End Time</Label>
                                <Input id="end-time" name="end-time" type="time" required/>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="event-location">Location</Label>
                            <div className="relative">
                                <Input id="event-location" name="event-location" placeholder="e.g. Central Park" required/>
                                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 pt-2">
                            <Checkbox id="live-location-check" />
                            <label htmlFor="live-location-check" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Automatically check-in attendees via live location
                            </label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="secondary" onClick={() => setIsEventDialogOpen(false)}>Cancel</Button>
                        <Button type="submit">Create Event</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    </div>
  );
}
