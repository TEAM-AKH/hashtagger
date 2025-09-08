
'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import PostCard from '@/components/post-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, Film, Clapperboard, Hash } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Mock data - in a real app, you'd fetch this based on the year
const yearData: { [key: string]: any } = {
    '2024': {
        posts: [
            { id: 1, author: { name: "Alice", avatar: "https://picsum.photos/seed/1/100", hint: "woman smiling" }, content: "A beautiful memory from May 2024!", image: { src: "https://picsum.photos/600/375?random=202405", hint: "spring landscape" }, likes: 15, comments: 4, circle: "Best Friends", date: 'May 12, 2024' },
            { id: 2, author: { name: "You", avatar: "https://picsum.photos/seed/user/100", hint: "person selfie" }, content: "January was cold but beautiful.", image: { src: "https://picsum.photos/600/375?random=202401", hint: "winter snow" }, likes: 25, comments: 6, circle: "Family", date: 'Jan 20, 2024' },
        ],
        clips: [
            { id: 1, src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", user: "fun_times", description: "Living my best life in Feb 2024!", date: 'Feb 18, 2024' },
        ],
        hashflicks: [
             { id: 1, title: "Spring Awakening", thumbnail: "https://picsum.photos/seed/flick2024/800/450", user: "nature_lover", date: 'Apr 05, 2024', videoSrc: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" },
        ]
    },
    '2023': {
        posts: [
             { id: 3, author: { name: "You", avatar: "https://picsum.photos/seed/user/100", hint: "person selfie" }, content: "Throwback to Autumn 2023. The colors were amazing.", image: { src: "https://picsum.photos/600/375?random=202311", hint: "autumn leaves" }, likes: 42, comments: 8, circle: "Family", date: 'Nov 02, 2023' },
        ],
        clips: [],
        hashflicks: [
             { id: 2, title: "Summer Blockbuster", thumbnail: "https://picsum.photos/seed/flick2023/800/450", user: "movie_fan", date: 'Jul 21, 2023', videoSrc: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
             { id: 3, title: "Holiday Special", thumbnail: "https://picsum.photos/seed/flick2023-2/800/450", user: "festive_films", date: 'Dec 24, 2023', videoSrc: "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4" },
        ]
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


export default function YearMemoriesPage() {
    const params = useParams();
    const year = params.year as string;
    const data = yearData[year] || { posts: [], clips: [], hashflicks: [] };

    return (
        <motion.div 
            className="container mx-auto p-4 space-y-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.div variants={itemVariants}>
                <Link href="/memory-bank" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back to Memory Bank
                </Link>
                <h1 className="text-4xl font-bold tracking-tight">Memories from {year}</h1>
            </motion.div>

            <motion.div variants={itemVariants}>
                <Tabs defaultValue="posts" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="posts"><Hash className="mr-2 h-4 w-4" />Posts & Hashtags ({data.posts.length})</TabsTrigger>
                        <TabsTrigger value="clips"><Film className="mr-2 h-4 w-4" />Clips ({data.clips.length})</TabsTrigger>
                        <TabsTrigger value="hashflicks"><Clapperboard className="mr-2 h-4 w-4" />HASHFLICKS ({data.hashflicks.length})</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="posts" className="mt-6">
                        {data.posts.length > 0 ? (
                            <div className="space-y-6 max-w-2xl mx-auto">
                                {data.posts.map((post: any) => (
                                    <motion.div key={post.id} variants={itemVariants}>
                                        <PostCard post={post} />
                                    </motion.div>
                                ))}
                            </div>
                        ) : <p className="text-muted-foreground text-center pt-8">No posts saved from {year}.</p>}
                    </TabsContent>

                    <TabsContent value="clips" className="mt-6">
                         {data.clips.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {data.clips.map((clip: any) => (
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
                                                <p className="text-xs text-muted-foreground">{clip.date}</p>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        ) : <p className="text-muted-foreground text-center pt-8">No clips saved from {year}.</p>}
                    </TabsContent>

                     <TabsContent value="hashflicks" className="mt-6">
                         {data.hashflicks.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {data.hashflicks.map((flick: any) => (
                                     <motion.div key={flick.id} variants={itemVariants}>
                                        <Card className="overflow-hidden group">
                                            <div className="relative aspect-video">
                                                <Image src={flick.thumbnail} alt={flick.title} fill className="object-cover" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                            </div>
                                            <CardHeader>
                                                <CardTitle className="text-base truncate">{flick.title}</CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-4 pt-0">
                                                 <p className="text-sm text-muted-foreground">@{flick.user} &bull; {flick.date}</p>
                                            </CardContent>
                                        </Card>
                                     </motion.div>
                                ))}
                            </div>
                        ) : <p className="text-muted-foreground text-center pt-8">No HASHFLICKS saved from {year}.</p>}
                    </TabsContent>
                </Tabs>
            </motion.div>

        </motion.div>
    );
}
