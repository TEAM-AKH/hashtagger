
'use client';

import { useState } from 'react';
import ConnectionCircles from "@/components/connection-circles";
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
  { id: 1, name: "Best Friends", image: "https://picsum.photos/seed/bf/200", hint: "group friends", members: [
      { name: "Alice", avatar: "https://picsum.photos/seed/1/100" },
      { name: "Bob", avatar: "https://picsum.photos/seed/2/100" },
      { name: "Charlie", avatar: "https://picsum.photos/seed/3/100" },
  ]},
  { id: 2, name: "Family", image: "https://picsum.photos/seed/fam/200", hint: "family picture", members: [
      { name: "Diana", avatar: "https://picsum.photos/seed/4/100" },
      { name: "Eve", avatar: "https://picsum.photos/seed/5/100" },
  ]},
  { id: 3, name: "Organization", image: "https://picsum.photos/seed/org/200", hint: "office building", members: [
      { name: "Frank", avatar: "https://picsum.photos/seed/6/100" },
      { name: "Grace", avatar: "https://picsum.photos/seed/7/100" },
      { name: "Heidi", avatar: "https://picsum.photos/seed/8/100" },
      { name: "Ivan", avatar: "https://picsum.photos/seed/9/100" },
  ]},
  { id: 4, name: "Clubs", image: "https://picsum.photos/seed/club/200", hint: "people hobby", members: [
       { name: "Judy", avatar: "https://picsum.photos/seed/10/100" },
       { name: "Mallory", avatar: "https://picsum.photos/seed/11/100" },
  ]},
];


export default function ConnectionsPage() {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [circles, setCircles] = useState(initialCircles);
    const [selectedCircle, setSelectedCircle] = useState<any>(null);

    const handleCreateCircle = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const nameInput = form.elements.namedItem('name') as HTMLInputElement;
        const newCircleName = nameInput.value;
        if (newCircleName) {
            const newCircle = {
                id: Date.now(),
                name: newCircleName,
                image: `https://picsum.photos/seed/${Date.now()}/200`,
                hint: "new circle",
                members: [],
            };
            setCircles(prevCircles => [...prevCircles, newCircle]);
            setIsCreateDialogOpen(false);
        }
    };

    const handleRemoveCircle = (circleId: number) => {
        setCircles(prevCircles => prevCircles.filter(c => c.id !== circleId));
        setSelectedCircle(null);
    }


  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[calc(100vh-12rem)] relative">
        <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-foreground/80 to-accent-foreground/70 pb-2">
                    Your Circles
                </h1>
            </div>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Click on your profile to see your circles. Discover new connections and see what your friends are up to.
            </p>
        </div>
        <ConnectionCircles circles={circles} onCircleSelect={setSelectedCircle} />
         <div className="absolute bottom-8 left-8">
            <Button onClick={() => setIsCreateDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Circle
            </Button>
        </div>
         <div className="absolute bottom-8 right-8">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="destructive-outline">
                        <MinusCircle className="mr-2 h-4 w-4" />
                        Remove a Circle
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Select a circle to remove</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-2 py-4">
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
         <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Circle</DialogTitle>
                    <DialogDescription>
                        Give your new circle a name. You can add members later.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateCircle}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input id="name" placeholder="e.g. Book Club" className="col-span-3" required />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit">Create</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    </div>
  );
}
