
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Bookmark, Plus, FolderHeart, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const memoryData = [
  { year: 2024, memories: 156 },
  { year: 2023, memories: 234 },
  { year: 2022, memories: 189 },
  { year: 2021, memories: 145 },
  { year: 2020, memories: 98 },
];

const recentSavedItems = [
    {
        id: 1,
        type: 'post',
        author: { name: "Alice", avatar: "https://picsum.photos/seed/1/100" },
        content: "A beautiful memory from May 2024!",
        image: { src: "https://picsum.photos/600/375?random=202405", hint: "spring landscape" },
    },
    {
        id: 2,
        type: 'clip',
        user: 'dreamer',
        src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    },
    {
        id: 3,
        type: 'hashflick',
        title: "A Journey Through the Alps",
        thumbnail: "https://picsum.photos/seed/flick3/800/450",
    },
    {
        id: 4,
        type: 'post',
        author: { name: "You", avatar: "https://picsum.photos/seed/user/100" },
        content: "Throwback to Autumn 2023. The colors were amazing.",
        image: { src: "https://picsum.photos/600/375?random=202311", hint: "autumn leaves" },
    },
];

const initialTreasures = [
    { id: 1, name: "Vacation Ideas", count: 12, images: ["https://picsum.photos/seed/t1/100", "https://picsum.photos/seed/t2/100", "https://picsum.photos/seed/t3/100", "https://picsum.photos/seed/t4/100"] },
    { id: 2, name: "Project Inspiration", count: 34, images: ["https://picsum.photos/seed/t5/100", "https://picsum.photos/seed/t6/100", "https://picsum.photos/seed/t7/100", "https://picsum.photos/seed/t8/100"] },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100 },
  },
};

export default function MemoryBankPage() {
    const [treasures, setTreasures] = useState(initialTreasures);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    const handleCreateTreasure = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const nameInput = form.elements.namedItem('name') as HTMLInputElement;
        if (nameInput.value) {
            const newTreasure = {
                id: Date.now(),
                name: nameInput.value,
                count: 0,
                images: [],
            };
            setTreasures(prev => [newTreasure, ...prev]);
            setIsCreateDialogOpen(false);
        }
    };

  return (
    <div className="container mx-auto p-4">
       <motion.div 
         initial="hidden"
         animate="visible"
         variants={containerVariants}
         className="space-y-12"
       >
        <motion.div variants={itemVariants}>
            <div className="text-center">
                 <motion.h1 
                    className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 pb-2">
                    Memory Bank
                </motion.h1>
                <motion.p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl">
                    Your personal archive of moments and inspirations. Browse by year or organize into treasures.
                </motion.p>
            </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2"><BrainCircuit className="text-primary"/> Browse by Year</h2>
            <Carousel opts={{ align: "start", loop: false }} className="w-full">
                <CarouselContent className="-ml-4">
                    {memoryData.map((item) => (
                    <CarouselItem key={item.year} className="md:basis-1/2 lg:basis-1/4 pl-4">
                        <Link href={`/memory-bank/${item.year}`}>
                            <Card className="group cursor-pointer transition-all duration-300 hover:border-primary hover:shadow-lg">
                                <CardContent className="flex items-center justify-between p-6">
                                    <div>
                                        <div className="text-3xl font-bold text-primary">{item.year}</div>
                                        <div className="text-sm text-muted-foreground">{item.memories} memories</div>
                                    </div>
                                    <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                </CardContent>
                            </Card>
                        </Link>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4">
             <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center gap-2"><FolderHeart className="text-primary"/> Your Treasures</h2>
                <Button onClick={() => setIsCreateDialogOpen(true)}><Plus className="mr-2 h-4 w-4"/>Create Treasure</Button>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {treasures.map(treasure => (
                    <Card key={treasure.id} className="cursor-pointer group hover:shadow-lg transition-shadow">
                        <CardContent className="p-4 space-y-3">
                            <div className="grid grid-cols-2 grid-rows-2 gap-1 aspect-square rounded-md overflow-hidden mb-2">
                                {[...treasure.images, ...Array(4 - treasure.images.length).fill("https://picsum.photos/seed/placeholder/100")].slice(0, 4).map((img, i) => (
                                    <div key={i} className="relative aspect-square bg-muted">
                                        <Image src={img} alt={`${treasure.name} content ${i+1}`} fill className="object-cover" />
                                    </div>
                                ))}
                            </div>
                            <h3 className="font-bold">{treasure.name}</h3>
                            <p className="text-sm text-muted-foreground">{treasure.count} items</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </motion.div>

         <motion.div variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2"><Bookmark className="text-primary"/> Recently Saved</h2>
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {recentSavedItems.map(item => (
                     <motion.div key={item.id} variants={itemVariants} className="group relative aspect-square">
                        {item.type === 'post' && item.image &&
                            <Image src={item.image.src} alt={item.content} fill className="object-cover rounded-md" data-ai-hint={item.image.hint} />
                        }
                        {item.type === 'clip' && 
                             <video src={item.src} poster={`https://picsum.photos/seed/clip${item.id}/400`} muted loop className="w-full h-full object-cover rounded-md" />
                        }
                        {item.type === 'hashflick' &&
                             <Image src={item.thumbnail} alt={item.title} fill className="object-cover rounded-md" data-ai-hint="movie poster" />
                        }
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                           <Badge>{item.type}</Badge>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
       </motion.div>
       <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Treasure</DialogTitle>
                    <DialogDescription>
                       Give your new collection a name. You can add items to it later.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateTreasure}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input id="name" placeholder="e.g. Summer '24" className="col-span-3" required />
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
