
'use client';

import { useState } from 'react';
import AtomicConnectionCircles from "@/components/atomic-connection-circles";
import { Button } from "@/components/ui/button";
import { PlusCircle, MinusCircle } from "lucide-react";
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

const initialCircles = [
  { id: 1, name: "Alice", image: "https://picsum.photos/seed/1/100" },
  { id: 2, name: "Bob", image: "https://picsum.photos/seed/2/100" },
  { id: 3, name: "Charlie", image: "https://picsum.photos/seed/3/100" },
  { id: 4, name: "Diana", image: "https://picsum.photos/seed/4/100" },
  { id: 5, name: "Eve", image: "https://picsum.photos/seed/5/100" },
  { id: 6, name: "Frank", image: "https://picsum.photos/seed/6/100" },
  { id: 7, name: "Grace", image: "https://picsum.photos/seed/7/100" },
  { id: 8, name: "Heidi", image: "https://picsum.photos/seed/8/100" },
  { id: 9, name: "Ivan", image: "https://picsum.photos/seed/9/100" },
  { id: 10, name: "Judy", image: "https://picsum.photos/seed/10/100" },
  { id: 11, name: "Mallory", image: "https://picsum.photos/seed/11/100" },
];


export default function ConnectionsPage() {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [circles, setCircles] = useState(initialCircles);
    const [selectedCircle, setSelectedCircle] = useState<any>(null);
    const [newCircleName, setNewCircleName] = useState('');
    const [circleToRemove, setCircleToRemove] = useState<any>(null);

    const handleAddCircle = () => {
        if (newCircleName) {
            const newCircle = {
                id: Date.now(),
                name: newCircleName,
                image: `https://picsum.photos/seed/${Date.now()}/100`,
            };
            setCircles(prevCircles => [...prevCircles, newCircle]);
            setIsCreateDialogOpen(false);
            setNewCircleName('');
        }
    };

    const handleRemoveCircle = (circleId: number) => {
        setCircles(prevCircles => prevCircles.filter(c => c.id !== circleId));
        setCircleToRemove(null);
    }


  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[calc(100vh-12rem)] relative overflow-hidden bg-[#111827]">
        <div className="text-center mb-8 z-10 text-white">
            <div className="flex items-center justify-center gap-4 mb-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-400 pb-2">
                    Your Connections
                </h1>
            </div>
            <p className="max-w-[600px] text-gray-400 md:text-xl">
                Click on the nucleus to expand your connections. Each connection is an electron in your social atom.
            </p>
        </div>
        
        <AtomicConnectionCircles circles={circles} onCircleSelect={setSelectedCircle} />

         <div className="absolute bottom-8 left-8">
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

         <div className="absolute bottom-8 right-8">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="destructive-outline">
                        <MinusCircle className="mr-2 h-4 w-4" />
                        Remove Connection
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Select a connection to remove</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-2 py-4 max-h-60 overflow-y-auto">
                        {circles.map(circle => (
                             <DialogClose key={circle.id} asChild>
                                <Button variant="outline" onClick={() => handleRemoveCircle(circle.id)}>
                                    {circle.name}
                                </Button>
                            </DialogClose>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    </div>
  );
}
