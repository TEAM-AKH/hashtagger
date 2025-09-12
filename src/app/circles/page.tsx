
'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, MoreVertical, Edit, Trash2 } from 'lucide-react';

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
  const [selectedCircle, setSelectedCircle] = useState<any>(null);

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
  };

  const handleRenameSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const nameInput = form.elements.namedItem('name') as HTMLInputElement;
    if (nameInput.value && selectedCircle) {
      setItems(items.map(item => item.id === selectedCircle.id ? { ...item, name: nameInput.value } : item));
      setIsRenameDialogOpen(false);
      setSelectedCircle(null);
    }
  };

  const openRenameDialog = (item: any) => {
    setSelectedCircle(item);
    setIsRenameDialogOpen(true);
  }

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
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
            const duration = 20 + ringIndex * 10;
            const direction = ringIndex % 2 === 0 ? 1 : -1;

            return (
              <motion.div
                key={ringIndex}
                className="absolute"
                style={{ width: radius * 2, height: radius * 2 }}
              >
                 {/* Grid Line */}
                 <motion.div 
                    className="absolute w-full h-full rounded-full border border-dashed border-muted-foreground/30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                        opacity: { duration: 1, delay: 0.5 },
                    }}
                 />
                {/* Orbiting Items */}
                <motion.div
                    className="absolute w-full h-full"
                >
                {ring.map((item, i) => {
                  const angle = (i / ring.length) * 2 * Math.PI;
                  const x = (radius - size / 2) + radius * Math.cos(angle);
                  const y = (radius - size / 2) + radius * Math.sin(angle);
                  
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{
                        width: size,
                        height: size,
                        left: '50%',
                        top: '50%',
                        x: '-50%',
                        y: '-50%',
                        opacity: 0,
                      }}
                      animate={{
                        width: size,
                        height: size,
                        left: isCollapsed ? '50%' : x,
                        top: isCollapsed ? '50%' : y,
                        x: isCollapsed ? '-50%' : 0,
                        y: isCollapsed ? '-50%' : 0,
                        opacity: 1,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0,
                        transition: { duration: 0.3 }
                      }}
                      transition={{
                        layout: { type: 'spring', stiffness: 200, damping: 20 },
                        opacity: { duration: 0.3 },
                      }}
                      whileHover={{ scale: 1.1, zIndex: 20, shadow: "0 0 15px hsl(var(--primary))" }}
                       className="absolute flex items-center justify-center rounded-full border-4 border-primary/30 bg-background shadow-md overflow-hidden cursor-pointer"
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <div className="w-full h-full">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                           <DropdownMenuItem onClick={() => openRenameDialog(item)}>
                             <Edit className="mr-2 h-4 w-4" />
                             Rename
                           </DropdownMenuItem>
                           <DropdownMenuItem onClick={() => removeCircle(item.id)} className="text-destructive">
                             <Trash2 className="mr-2 h-4 w-4" />
                             Remove
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit">Save</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    </div>
  );
}
