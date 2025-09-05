
'use client';

import { useState } from 'react';
import ConnectionCircles from "@/components/connection-circles";
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
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ConnectionsPage() {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    const handleCreateCircle = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Add logic to create a new circle here
        console.log("Creating a new circle...");
        setIsCreateDialogOpen(false);
    };


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
        <ConnectionCircles />
         <div className="absolute bottom-8 left-8">
            <Button onClick={() => setIsCreateDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Circle
            </Button>
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
