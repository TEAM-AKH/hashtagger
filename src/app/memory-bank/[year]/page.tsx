
'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import PostCard from '@/components/post-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, Film, Clapperboard, Hash, Upload, Download, CalendarDays, SortAsc, SortDesc } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { events } from '@/lib/events-data';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useState } from 'react';

// Mock data - in a real app, you'd fetch this based on the year
const yearData: { [key: string]: any } = {
    '2024': {
        posts: [
            { id: 2, author: { name: "You", avatar: "https://picsum.photos/seed/user/100", hint: "person selfie" }, content: "January was cold but beautiful.", image: { src: "https://picsum.photos/600/375?random=202401", hint: "winter snow" }, likes: 25, comments: 6, circle: "Family", date: '2024-01-20' },
            { id: 1, author: { name: "Alice", avatar: "https://picsum.photos/seed/1/100", hint: "woman smiling" }, content: "A beautiful memory from May 2024!", image: { src: "https://picsum.photos/600/375?random=202405", hint: "spring landscape" }, likes: 15, comments: 4, circle: "Best Friends", date: '2024-05-12' },
        ],
        clips: [
            { id: 1, src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", user: "fun_times", description: "Living my best life in Feb 2024!", date: '2024-02-18' },
        ],
        hashflicks: [
             { id: 1, title: "Spring Awakening", thumbnail: "https://picsum.photos/seed/flick2024/800/450", user: "nature_lover", date: '2024-04-05', videoSrc: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" },
        ],
        events: events.filter(e => new Date(e.endDate).getFullYear() === 2024)
    },
    '2023': {
        posts: [
             { id: 3, author: { name: "You", avatar: "https://picsum.photos/seed/user/100", hint: "person selfie" }, content: "Throwback to Autumn 2023. The colors were amazing.", image: { src: "https://picsum.photos/600/375?random=202311", hint: "autumn leaves" }, likes: 42, comments: 8, circle: "Family", date: '2023-11-02' },
        ],
        clips: [],
        hashflicks: [
             { id: 2, title: "Summer Blockbuster", thumbnail: "https://picsum.photos/seed/flick2023/800/450", user: "movie_fan", date: '2023-07-21', videoSrc: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
             { id: 3, title: "Holiday Special", thumbnail: "https://picsum.photos/seed/flick2023-2/800/450", user: "festive_films", date: '2023-12-24', videoSrc: "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4" },
        ],
        events: events.filter(e => new Date(e.endDate).getFullYear() === 2023)
    }
};

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

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function YearMemoriesPage() {
    const params = useParams();
    const year = params.year as string;
    const [sort, setSort] = useState<{ by: 'month' | 'date', direction: 'asc' | 'desc' }>({ by: 'date', direction: 'desc' });
    
    const data = yearData[year] || { posts: [], clips: [], hashflicks: [], events: [] };

    const sortData = (arr: any[]) => {
        return arr.sort((a, b) => {
            const dateA = new Date(a.date || a.endDate).getTime();
            const dateB = new Date(b.date || b.endDate).getTime();
            if (sort.direction === 'asc') {
                return dateA - dateB;
            }
            return dateB - dateA;
        });
    }

    const sortedData = {
        posts: sortData([...data.posts]),
        clips: sortData([...data.clips]),
        hashflicks: sortData([...data.hashflicks]),
        events: sortData([...data.events]),
    };

    const groupedByMonth = (items: any[]) => {
        return items.reduce((acc, item) => {
            const month = new Date(item.date || item.endDate).getMonth();
            if (!acc[month]) {
                acc[month] = [];
            }
            acc[month].push(item);
            return acc;
        }, {} as {[key: number]: any[]});
    }

    return (
        <motion.div 
            className="container mx-auto p-4 space-y-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.div variants={itemVariants} className="flex justify-between items-center">
                <div>
                    <Link href="/memory-bank" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Back to Memory Bank
                    </Link>
                    <h1 className="text-4xl font-bold tracking-tight">Memories from {year}</h1>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            {sort.direction === 'asc' ? <SortAsc className="mr-2"/> : <SortDesc className="mr-2"/>}
                            Sort by {sort.by.charAt(0).toUpperCase() + sort.by.slice(1)}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setSort({by: 'date', direction: 'desc'})}>Newest First</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSort({by: 'date', direction: 'asc'})}>Oldest First</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSort({by: 'month', direction: 'desc'})}>Group by Month (Newest)</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSort({by: 'month', direction: 'asc'})}>Group by Month (Oldest)</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </motion.div>

            <motion.div variants={itemVariants}>
                <Card>
                    <CardHeader>
                        <CardTitle>Your Memories</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="posts" className="w-full">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="posts"><Hash className="mr-2 h-4 w-4" />Posts ({data.posts.length})</TabsTrigger>
                                <TabsTrigger value="clips"><Film className="mr-2 h-4 w-4" />Clips ({data.clips.length})</TabsTrigger>
                                <TabsTrigger value="hashflicks"><Clapperboard className="mr-2 h-4 w-4" />HASHFLICKS ({data.hashflicks.length})</TabsTrigger>
                                <TabsTrigger value="events"><CalendarDays className="mr-2 h-4 w-4" />Events ({data.events.length})</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="posts" className="mt-6">
                                {data.posts.length > 0 ? (
                                    <div className="space-y-6 max-w-2xl mx-auto">
                                        {sort.by === 'month' ? (
                                            Object.entries(groupedByMonth(sortedData.posts))
                                            .sort(([a], [b]) => sort.direction === 'desc' ? Number(b) - Number(a) : Number(a) - Number(b))
                                            .map(([month, items]) => (
                                            <div key={month}>
                                                <h3 className="text-xl font-bold mb-4">{months[Number(month)]}</h3>
                                                <div className="space-y-6">
                                                    {items.map((post: any) => <motion.div key={post.id} variants={itemVariants}><PostCard post={post} /></motion.div>)}
                                                </div>
                                            </div>
                                            ))
                                        ) : (
                                            sortedData.posts.map((post: any) => <motion.div key={post.id} variants={itemVariants}><PostCard post={post} /></motion.div>)
                                        )}
                                    </div>
                                ) : <p className="text-muted-foreground text-center pt-8">No posts from this year.</p>}
                            </TabsContent>
                            <TabsContent value="clips" className="mt-6">
                                {data.clips.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {sortedData.clips.map((clip: any) => (
                                            <motion.div key={clip.id} variants={itemVariants}>
                                                <Card className="overflow-hidden group">
                                                    <div className="relative aspect-[9/16]">
                                                        <video src={clip.src} poster={`https://picsum.photos/seed/clip${clip.id}/400/711`} muted loop className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                                        <div className="absolute bottom-0 p-2 text-white">
                                                            <p className="text-xs font-semibold">@{clip.user}</p>
                                                        </div>
                                                    </div>
                                                    <CardContent className="p-2">
                                                        <p className="text-xs text-muted-foreground">{new Date(clip.date).toLocaleDateString()}</p>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : <p className="text-muted-foreground text-center pt-8">No clips from this year.</p>}
                            </TabsContent>
                            <TabsContent value="hashflicks" className="mt-6">
                                {data.hashflicks.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {sortedData.hashflicks.map((flick: any) => (
                                             <motion.div key={flick.id} variants={itemVariants}>
                                                <Card className="overflow-hidden group">
                                                    <div className="relative aspect-video">
                                                        <Image src={flick.thumbnail} alt={flick.title} fill className="object-cover" />
                                                    </div>
                                                    <CardHeader>
                                                        <CardTitle className="text-base truncate">{flick.title}</CardTitle>
                                                        <CardDescription className="text-sm text-muted-foreground">@{flick.user} &bull; {new Date(flick.date).toLocaleDateString()}</CardDescription>
                                                    </CardHeader>
                                                </Card>
                                             </motion.div>
                                        ))}
                                    </div>
                                ) : <p className="text-muted-foreground text-center pt-8">No HASHFLICKS from this year.</p>}
                            </TabsContent>
                            <TabsContent value="events" className="mt-6">
                                {data.events.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {sortedData.events.map((event: any) => (
                                            <Link href={`/events/${event.id}`} key={event.id}>
                                                <Card className="hover:border-primary transition-colors h-full">
                                                    <CardHeader>
                                                        <CardTitle>{event.name}</CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <p className="text-sm text-muted-foreground">Ended: {new Date(event.endDate).toLocaleDateString()}</p>
                                                    </CardContent>
                                                </Card>
                                            </Link>
                                        ))}
                                    </div>
                                ) : <p className="text-muted-foreground text-center pt-8">No events from this year.</p>}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </motion.div>

        </motion.div>
    );
}

    