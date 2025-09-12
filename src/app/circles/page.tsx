
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
import { Plus, MoreHorizontal, Edit, Trash2, UserX, Users, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';

const initialCircles = [
  { id: 1, name: "Project Team", image: "https://picsum.photos/seed/1/100", members: ["Alice", "Bob", "Charlie"] },
  { id: 2, name: "Close Friends", image: "https://picsum.photos/seed/2/100", members: ["David", "Eve"] },
  { id: 3, name: "Gaming Squad", image: "https://picsum.photos/seed/3/100", members: ["Frank", "Grace", "Heidi"] },
  { id: 4, name: "Family", image: "https://picsum.photos/seed/4/100", members: ["Ivan", "Judy"] },
  { id: 5, name: "Book Club", image: "https://picsum.photos/seed/5/100", members: ["Mallory", "Niaj"] },
  { id: 6, name: "Hiking Group", image: "https://picsum.photos/seed/6/100", members: ["Oscar", "Peggy"] },
];

export default function ConnectionsPage() {
  const [items, setItems] = useState(initialCircles);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [isCircleDetailsOpen, setIsCircleDetailsOpen] = useState(false);
  const [selectedCircle, setSelectedCircle] = useState<any>(null);
  const [isRemovingMembers, setIsRemovingMembers] = useState(false);
  const [membersToRemove, setMembersToRemove] = useState<string[]>([]);
  const [ringOffsets, setRingOffsets] = useState<number[]>([]);

  useEffect(() => {
    // Generate random angle offsets for each ring to break the linear pattern
    setRingOffsets(Array.from({ length: 5 }, () => Math.random() * 2 * Math.PI));
  }, []);


  const ringLimits = [4, 6, 8, 10, 12];

  const rings = useMemo(() => {
    let distributedRings = [];
    let index = 0;
    for (let i = 0; i < ringLimits.length; i++) {
      const slice = items.slice(index, index + ringLimits[i]);
      if (slice.length > 0) {
        distributedRings.push(slice);
      }
      index += ringLimits[i];
    }
    return distributedRings;
  }, [items]);

  const addCircle = () => {
    const newId = (items.length > 0 ? Math.max(...items.map(i => i.id)) : 0) + 1;
    const newCircle = {
      id: newId,
      name: `New Circle ${newId}`,
      image: `https://picsum.photos/seed/${newId}/100`,
      members: ["New Member"],
    };
    setItems([...items, newCircle]);
  };
  
  const removeCircle = (id: number) => {
    setItems(items.filter(item => item.id !== id));
    closeCircleDetails();
  };
  
  const openCircleDetails = (item: any) => {
    setSelectedCircle(item);
    setIsCircleDetailsOpen(true);
  }
  
  const closeCircleDetails = () => {
    setIsCircleDetailsOpen(false);
    setIsRemovingMembers(false);
    setMembersToRemove([]);
    // A small delay to allow the dialog to close before resetting the selected circle
    setTimeout(() => {
        setSelectedCircle(null);
    }, 300);
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

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  
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

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] bg-background overflow-hidden relative">
      <div className="text-center mb-4 z-10 absolute top-0 pt-4">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 pb-2">
          Your Connection Orbit
        </h1>
        <p className="max-w-[600px] text-muted-foreground md:text-xl">
          A dynamic, atomic view of your social universe.
        </p>
      </div>
      
      <div className="relative w-[700px] h-[700px] flex items-center justify-center">
        {/* Central Circle */}
        <motion.div
          className="absolute w-28 h-28 rounded-full flex items-center justify-center bg-card shadow-xl border-4 border-primary/50 z-20 cursor-pointer"
          onClick={toggleCollapse}
          whileHover={{ scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Logo className="h-20 w-20" />
        </motion.div>

        {/* Orbiting Rings */}
        <AnimatePresence>
          {rings.map((ring, ringIndex) => {
            const radius = 120 + ringIndex * 90;
            const size = 80 - ringIndex * 10;

            return (
              <motion.div
                key={ringIndex}
                className="absolute"
                style={{ width: radius * 2, height: radius * 2 }}
              >
                 <motion.div 
                    className="absolute w-full h-full rounded-full border border-dashed border-muted-foreground/30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ opacity: { duration: 1, delay: 0.5 } }}
                 />
                <motion.div className="absolute w-full h-full">
                {ring.map((item, i) => {
                  const ringAngleOffset = ringOffsets[ringIndex] || 0;
                  const angle = ringAngleOffset + (i / ring.length) * 2 * Math.PI;
                  const x = (radius - size / 2) + radius * Math.cos(angle);
                  const y = (radius - size / 2) + radius * Math.sin(angle);
                  
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{
                        width: size,
                        height: size,
                        left: isCollapsed ? '50%' : x,
                        top: isCollapsed ? '50%' : y,
                        marginLeft: isCollapsed ? `-${size/2}px` : '0px',
                        marginTop: isCollapsed ? `-${size/2}px` : '0px',
                        opacity: 1,
                        scale: 1,
                      }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ layout: { type: 'spring', stiffness: 200, damping: 20 }, opacity: { duration: 0.3 } }}
                      whileHover={{ scale: 1.1, zIndex: 20, shadow: "0 0 15px hsl(var(--primary))" }}
                      className="absolute flex items-center justify-center rounded-full border-4 border-primary/30 bg-background shadow-md overflow-hidden cursor-pointer"
                      onClick={() => openCircleDetails(item)}
                    >
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="w-full h-full">
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
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

       <Button onClick={addCircle} className="absolute bottom-8 left-8 z-10">
        <Plus className="mr-2 h-4 w-4" /> Add Circle
      </Button>

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
        
       <Dialog open={isCircleDetailsOpen} onOpenChange={setIsCircleDetailsOpen}>
            <DialogContent className="sm:max-w-md p-0">
                <DialogHeader className="p-6 pb-4 flex flex-row items-start justify-between">
                    <DialogTitle className="text-2xl font-bold">{selectedCircle?.name}</DialogTitle>
                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={openRenameDialog}>
                                    <Edit className="mr-2 h-4 w-4" /> Rename Circle
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setIsRemovingMembers(true)}>
                                    <UserX className="mr-2 h-4 w-4" /> Remove Members
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => removeCircle(selectedCircle.id)} className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" /> Remove Circle
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                         <DialogClose asChild>
                             <Button variant="ghost" size="icon"><X/></Button>
                        </DialogClose>
                    </div>
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
    </div>
  );
}

    