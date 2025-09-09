
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AtomicConnectionCircles from '@/components/atomic-connection-circles';

const initialCircles = [
  { id: 1, name: "Alice", image: "https://picsum.photos/seed/1/100", members: ["Dave", "Eli", "George"] },
  { id: 2, name: "Bob", image: "https://picsum.photos/seed/2/100", members: ["Frank", "Grace"] },
  { id: 3, name: "Charlie", image: "https://picsum.photos/seed/3/100", members: ["Heidi", "Ivan", "Judy"] },
  { id: 4, name: "Diana", image: "https://picsum.photos/seed/4/100", members: ["Karl", "Liam"] },
  { id: 5, name: "Eve", image: "https://picsum.photos/seed/5/100", members: ["Mona", "Nate", "Olivia"] },
  { id: 6, name: "Frank", image: "https://picsum.photos/seed/6/100", members: ["Pam", "Quinn"] },
  { id: 7, name: "Grace", image: "https://picsum.photos/seed/7/100", members: ["Rachel", "Steve"] },
  { id: 8, name: "Hank", image: "https://picsum.photos/seed/8/100", members: ["Trent", "Ursula"] },
  { id: 9, name: "Ivy", image: "https://picsum.photos/seed/9/100", members: ["Vince", "Wendy"] },
  { id: 10, name: "Jack", image: "https://picsum.photos/seed/10/100", members: ["Xavier", "Yara", "Zane"] },
  { id: 11, name: "Karen", image: "https://picsum.photos/seed/11/100", members: ["Aaron", "Betty"] },
];

export default function ConnectionsPage() {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [circles, setCircles] = useState(initialCircles);
    const [newCircleName, setNewCircleName] = useState('');

    const handleAddCircle = () => {
        if (newCircleName) {
            const newCircle = {
                id: Date.now(),
                name: newCircleName,
                image: `https://picsum.photos/seed/${Date.now()}/100`,
                members: [],
            };
            setCircles(prevCircles => [...prevCircles, newCircle]);
            setIsCreateDialogOpen(false);
            setNewCircleName('');
        }
    };
    
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[calc(100vh-12rem)] relative overflow-hidden bg-background">
        <div className="text-center mb-8 z-10">
            <div className="flex items-center justify-center gap-4 mb-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 pb-2">
                    Your Connections
                </h1>
            </div>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
                A dynamic, atomic view of your social circle. Click the nucleus to see your universe breathe.
            </p>
        </div>
        
        <AtomicConnectionCircles circles={circles} setCircles={setCircles} />

         <div className="absolute bottom-8 left-8 z-20">
             <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Connection
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add New Connection</DialogTitle>
                        <DialogDescription>
                            Enter the name for your new connection.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input id="name" value={newCircleName} onChange={(e) => setNewCircleName(e.target.value)} placeholder="e.g. Walter" className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="button" onClick={handleAddCircle}>Add</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    </div>
  );
}
