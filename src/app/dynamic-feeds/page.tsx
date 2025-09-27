
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Send, X, Plus, MoreHorizontal, Trash2, Edit, Share, FolderHeart, PlayCircle, Compass, Clapperboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PostCard from '@/components/post-card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { VibeButton } from '@/components/vibe-button';
import { ExpressButton } from '@/components/express-button';
import { CirculateButton } from '@/components/circulate-button';

const mockContent = [
    { type: 'post', id: 'post1', data: { id: 1, author: { name: "Alice", avatar: "https://picsum.photos/seed/1/100", hint: "woman smiling" }, content: "Just enjoying a beautiful day out! ☀️ #nature", image: { src: "https://picsum.photos/seed/p1/600/800", hint: "landscape nature" }, likes: 12, comments: [], circles: [{id: 1, name: "Best Friends"}], isSaved: false } },
    { type: 'clip', id: 'clip1', data: { id: 1, src: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", thumbnail: "https://picsum.photos/seed/c1/400/711", user: "bunny_lover", description: "Big Buck Bunny adventures!" } },
    { type: 'post', id: 'post2', data: { id: 2, author: { name: "Bob", avatar: "https://picsum.photos/seed/2/100", hint: "man glasses" }, content: "My new minimalist workspace setup. #wfh", image: { src: "https://picsum.photos/seed/p2/600/400", hint: "computer desk" }, likes: 45, comments: [], circles: [], isSaved: true } },
    { type: 'clip', id: 'clip2', data: { id: 2, src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", thumbnail: "https://picsum.photos/seed/c2/400/711", user: "dreamer", description: "Elephants have dreams too." } },
    { type: 'post', id: 'post3', data: { id: 3, author: { name: "Charlie", avatar: "https://picsum.photos/seed/3/100", hint: "person nature" }, content: "Exploring the hidden gems of the city. #urbanexplorer", image: { src: "https://picsum.photos/seed/p3/600/900", hint: "city street art" }, likes: 23, comments: [], circles: [], isSaved: false } },
    { type: 'clip', id: 'clip3', data: { id: 3, src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", thumbnail: "https://picsum.photos/seed/c3/400/711", user: "firestarter", description: "Just chilling by the fire." } },
    { type: 'post', id: 'post4', data: { id: 4, author: { name: "David", avatar: "https://picsum.photos/seed/4/100", hint: "man portrait" }, content: "Weekend baking project: success! 🍞", image: { src: "https://picsum.photos/seed/p4/600/500", hint: "fresh bread" }, likes: 78, comments: [], circles: [], isSaved: false } },
    { type: 'post', id: 'post5', data: { id: 5, author: { name: "Eve", avatar: "https://picsum.photos/seed/5/100", hint: "woman nature" }, content: "Morning hike views. #hiking", image: { src: "https://picsum.photos/seed/p5/600/750", hint: "mountain sunrise" }, likes: 102, comments: [], isSaved: true } },
    { type: 'clip', id: 'clip4', data: { id: 4, src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", thumbnail: "https://picsum.photos/seed/c4/400/711", user: "escape_artist", description: "My great escape" } },
];


const MasonryItem = ({ item, onClick, isPostFirstInPair }: { item: any, onClick: () => void, isPostFirstInPair: boolean }) => (
    <motion.div
        layoutId={`item-container-${item.id}`}
        onClick={onClick}
        className={cn(
            "relative cursor-pointer group",
            item.type === 'post' && (isPostFirstInPair ? 'row-span-2' : ''),
        )}
        whileHover={{ scale: 1.02 }}
    >
        <Image
            src={item.type === 'post' ? item.data.image.src : item.data.thumbnail}
            alt={item.type === 'post' ? item.data.content : item.data.description}
            width={500}
            height={item.type === 'post' ? (isPostFirstInPair ? 800 : 400) : 711}
            className="w-full h-full object-cover rounded-lg"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-2 right-2 text-white">
            {item.type === 'clip' && <Clapperboard className="h-5 w-5" />}
        </div>
    </motion.div>
);


const FeedViewer = ({ items, activeId, onClose, onScrollTo }: { items: any[], activeId: string, onClose: () => void, onScrollTo: (id: string) => void }) => {
    const activeIndex = useMemo(() => items.findIndex(item => item.id === activeId), [items, activeId]);
    const containerRef = useRef<HTMLDivElement>(null);
    const [showComments, setShowComments] = useState<string | null>(null);

     useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = (entry.target as HTMLElement).dataset.id;
                        if (id) {
                            onScrollTo(id);
                        }
                    }
                });
            },
            { threshold: 0.5 }
        );

        const elements = containerRef.current?.querySelectorAll('[data-id]');
        elements?.forEach(el => observer.observe(el));

        return () => elements?.forEach(el => observer.unobserve(el));
    }, [onScrollTo]);

    useEffect(() => {
        const element = containerRef.current?.querySelector(`[data-id="${activeId}"]`);
        element?.scrollIntoView({ behavior: 'auto' });
    }, [activeId]);

    const renderItemContent = (item: any) => {
        if (item.type === 'post') {
            return <PostCard post={item.data} />;
        }
        if (item.type === 'clip') {
            return (
                <Card className="h-full w-full bg-black flex flex-col">
                    <div className="relative flex-grow">
                         <video
                            src={item.data.src}
                            className="w-full h-full object-contain"
                            autoPlay
                            loop
                            muted
                            playsInline
                        />
                         <div className="absolute bottom-0 left-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white w-full">
                            <p className="font-bold">@{item.data.user}</p>
                            <p className="text-sm">{item.data.description}</p>
                        </div>
                    </div>
                     <CardFooter>
                        <div className="flex justify-around items-center w-full">
                           <VibeButton />
                           <ExpressButton docId={item.id.toString()} mode="inline" onToggle={() => setShowComments(prev => prev === item.id ? null : item.id)} showBox={showComments === item.id}/>
                           <CirculateButton />
                        </div>
                    </CardFooter>
                     <AnimatePresence>
                        {showComments === item.id && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1, maxHeight: '40%' }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden border-t bg-card"
                            >
                                <ExpressButton docId={item.id.toString()} mode="inline-content" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Card>
            );
        }
        return null;
    };


    return (
        <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <Button onClick={onClose} variant="ghost" size="icon" className="absolute top-4 right-4 z-50 bg-background/50 rounded-full hover:bg-background">
                <X />
            </Button>
            <div ref={containerRef} className="h-full w-full snap-y snap-mandatory overflow-y-scroll">
                {items.map((item) => (
                    <div key={item.id} data-id={item.id} className="h-full w-full snap-start flex items-center justify-center p-4 sm:p-8 md:p-16">
                         <motion.div
                            layoutId={`item-container-${item.id}`}
                            className="w-full max-w-lg h-full"
                        >
                            {renderItemContent(item)}
                        </motion.div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

export default function DynamicFeedsPage() {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [scrolledId, setScrolledId] = useState<string | null>(null);
    const [items, setItems] = useState(mockContent);

    const postItems = items.filter(item => item.type === 'post');
    let postPairTracker = true;

    return (
        <div className="container mx-auto p-4 space-y-8">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Discover</h1>
                <Button variant="outline" size="sm">
                    <Compass className="mr-2 h-4 w-4" /> Filter
                </Button>
            </div>

             <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                    gridAutoRows: '150px',
                    gap: '8px',
                }}
            >
                {items.map((item) => {
                    let isPostFirstInPair = false;
                    if (item.type === 'post') {
                        isPostFirstInPair = postPairTracker;
                        postPairTracker = !postPairTracker;
                    }

                    return (
                        <MasonryItem
                            key={item.id}
                            item={item}
                            isPostFirstInPair={isPostFirstInPair}
                            onClick={() => {
                                setSelectedId(item.id);
                                setScrolledId(item.id);
                            }}
                        />
                    );
                })}
            </div>

            <AnimatePresence>
                {selectedId && (
                    <FeedViewer
                        items={items}
                        activeId={scrolledId || selectedId}
                        onClose={() => setSelectedId(null)}
                        onScrollTo={setScrolledId}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
