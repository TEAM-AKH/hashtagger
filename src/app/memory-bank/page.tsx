
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, ChevronLeft, ChevronRight, Bookmark } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PostCard from '@/components/post-card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

const memoryData = [
  { year: 2024, memories: 156, progress: 78 },
  { year: 2023, memories: 234, progress: 90 },
  { year: 2022, memories: 189, progress: 65 },
  { year: 2021, memories: 145, progress: 50 },
  { year: 2020, memories: 98, progress: 30 },
];

const savedPosts = [
    {
        id: 1,
        author: { name: "Alice", avatar: "https://picsum.photos/seed/1/100", hint: "woman smiling" },
        content: "A beautiful memory from May 2024! This was such a great day.",
        image: { src: "https://picsum.photos/600/375?random=202405", hint: "spring landscape" },
        likes: 15,
        comments: 4,
        circle: "Best Friends",
    },
    {
        id: 2,
        author: { name: "You", avatar: "https://picsum.photos/seed/user/100", hint: "person selfie" },
        content: "Throwback to Autumn 2023. The colors were amazing.",
        image: { src: "https://picsum.photos/600/375?random=202311", hint: "autumn leaves" },
        likes: 42,
        comments: 8,
        circle: "Family",
    },
     {
        id: 3,
        author: { name: "You", avatar: "https://picsum.photos/seed/user/100", hint: "person selfie" },
        content: "That epic summer trip in 2022!",
        image: { src: "https://picsum.photos/600/375?random=202207", hint: "summer beach" },
        likes: 78,
        comments: 15,
        circle: "Clubs",
    },
];


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
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
    const [selectedYear, setSelectedYear] = useState(memoryData[0].year);

  return (
    <div className="container mx-auto p-4">
       <motion.div 
         initial="hidden"
         animate="visible"
         variants={containerVariants}
         className="space-y-12"
       >
        <motion.div variants={itemVariants}>
             <Link href="/home" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Home
            </Link>
            <div className="text-center">
                 <motion.h1 
                    className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 pb-2">
                    Memory Bank
                </motion.h1>
                <motion.p 
                    className="max-w-[600px] mx-auto text-muted-foreground md:text-xl">
                    Your collection of precious moments organized by years
                </motion.p>
            </div>
        </motion.div>

        <motion.div variants={itemVariants}>
            <Carousel opts={{
                align: "start",
                loop: false,
            }} className="w-full">
                <CarouselContent className="-ml-4">
                    {memoryData.map((item) => (
                    <CarouselItem key={item.year} className="md:basis-1/2 lg:basis-1/4 pl-4">
                        <Card 
                            className={`cursor-pointer transition-all duration-300 ${selectedYear === item.year ? 'border-primary shadow-lg' : 'border-border hover:shadow-md'}`}
                            onClick={() => setSelectedYear(item.year)}
                        >
                        <CardContent className="flex flex-col items-center justify-center p-6 gap-4">
                            <div className="text-4xl font-bold text-primary">{item.year}</div>
                            <div className="text-sm text-muted-foreground">{item.memories} memories</div>
                            <Progress value={item.progress} className="w-3/4 h-2 bg-gradient-to-r from-blue-400 to-purple-500" />
                        </CardContent>
                        </Card>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </motion.div>

         <motion.div variants={itemVariants} className="space-y-6">
            <div className='flex items-center gap-2'>
                <Bookmark className="h-6 w-6 text-primary"/>
                <h2 className="text-2xl font-bold">Saved Posts for {selectedYear}</h2>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedPosts.map(post => (
                     <motion.div key={post.id} variants={itemVariants}>
                        <PostCard post={post} />
                    </motion.div>
                ))}
            </div>
        </motion.div>
       </motion.div>
    </div>
  );
}
