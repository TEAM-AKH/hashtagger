
'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Card, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Send, X, Plus, MoreHorizontal, Trash2, Edit, Share, FolderHeart, PlayCircle, Compass, Clapperboard, Flame, User, Users, Clock, Pause, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PostCard from '@/components/post-card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { VibeButton } from '@/components/vibe-button';
import { ExpressButton } from '@/components/express-button';
import { CirculateButton } from '@/components/circulate-button';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';

const mockContent = {
    forYou: [
        { type: 'post', id: 'post1', data: { id: 1, author: { name: "Alice", avatar: "https://picsum.photos/seed/1/100", hint: "woman smiling" }, content: "Just enjoying a beautiful day out! ☀️ #nature", image: { src: "https://picsum.photos/seed/p1/600/800", hint: "landscape nature" }, likes: 12, comments: [], circles: [{id: 1, name: "Best Friends"}], isSaved: false } },
        { type: 'clip', id: 'clip1', data: { id: 1, src: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", thumbnail: "https://picsum.photos/seed/c1/400/711", user: "bunny_lover", description: "Big Buck Bunny adventures!" } },
        { type: 'post', id: 'post2', data: { id: 2, author: { name: "Bob", avatar: "https://picsum.photos/seed/2/100", hint: "man glasses" }, content: "My new minimalist workspace setup. #wfh", image: { src: "https://picsum.photos/seed/p2/600/400", hint: "computer desk" }, likes: 45, comments: [], circles: [], isSaved: true } },
    ],
    trending: [
        { type: 'post', id: 'post5', data: { id: 5, author: { name: "Eve", avatar: "https://picsum.photos/seed/5/100", hint: "woman nature" }, content: "Morning hike views. #hiking", image: { src: "https://picsum.photos/seed/p5/600/750", hint: "mountain sunrise" }, likes: 102, comments: [], isSaved: true } },
        { type: 'clip', id: 'clip4', data: { id: 4, src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", thumbnail: "https://picsum.photos/seed/c4/400/711", user: "escape_artist", description: "My great escape" } },
        { type: 'post', id: 'post4', data: { id: 4, author: { name: "David", avatar: "https://picsum.photos/seed/4/100", hint: "man portrait" }, content: "Weekend baking project: success! 🍞", image: { src: "https://picsum.photos/seed/p4/600/500", hint: "fresh bread" }, likes: 78, comments: [], circles: [], isSaved: false } },
    ],
    discover: [
        { type: 'clip', id: 'clip2', data: { id: 2, src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", thumbnail: "https://picsum.photos/seed/c2/400/711", user: "dreamer", description: "Elephants have dreams too." } },
        { type: 'post', id: 'post3', data: { id: 3, author: { name: "Charlie", avatar: "https://picsum.photos/seed/3/100", hint: "person nature" }, content: "Exploring the hidden gems of the city. #urbanexplorer", image: { src: "https://picsum.photos/seed/p3/600/900", hint: "city street art" }, likes: 23, comments: [], circles: [], isSaved: false } },
        { type: 'clip', id: 'clip3', data: { id: 3, src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", thumbnail: "https://picsum.photos/seed/c3/400/711", user: "firestarter", description: "Just chilling by the fire." } },
    ],
};
mockContent.following = [...mockContent.forYou].reverse();
mockContent.recent = [...mockContent.discover].reverse();

const initialStories = [
    { id: 'story1', user: 'Your Story', avatar: 'https://picsum.photos/seed/user/100', isLive: false, items: [{id: 1, type: 'image', src: 'https://picsum.photos/seed/s1/1080/1920'}] },
    { id: 'story2', user: 'Alice', avatar: 'https://picsum.photos/seed/1/100', isLive: true, items: [{id: 2, type: 'image', src: 'https://picsum.photos/seed/s2/1080/1920'}, {id: 3, type: 'video', src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}] },
    { id: 'story3', user: 'Bob', avatar: 'https://picsum.photos/seed/2/100', isLive: false, items: [{id: 4, type: 'image', src: 'https://picsum.photos/seed/s3/1080/1920'}] },
    { id: 'story4', user: 'Charlie', avatar: 'https://picsum.photos/seed/3/100', isLive: false, items: [{id: 5, type: 'image', src: 'https://picsum.photos/seed/s4/1080/1920'}] },
    { id: 'story5', user: 'David', avatar: 'https://picsum.photos/seed/4/100', isLive: true, items: [{id: 6, type: 'image', src: 'https://picsum.photos/seed/s5/1080/1920'}] },
    { id: 'story6', user: 'Eve', avatar: 'https://picsum.photos/seed/5/100', isLive: false, items: [{id: 7, type: 'image', src: 'https://picsum.photos/seed/s6/1080/1920'}] },
    { id: 'story7', user: 'Frank', avatar: 'https://picsum.photos/seed/c3/100', isLive: false, items: [{id: 8, type: 'image', src: 'https://picsum.photos/seed/s7/1080/1920'}] },
    { id: 'story8', user: 'Ivan', avatar: 'https://picsum.photos/seed/c4/100', isLive: false, items: [{id: 9, type: 'image', src: 'https://picsum.photos/seed/s8/1080/1920'}] },
];


const feedFilters = [
    { id: 'forYou', label: 'For You', icon: User },
    { id: 'trending', label: 'Trending', icon: Flame },
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'following', label: 'Following', icon: Users },
    { id: 'recent', label: 'Recent', icon: Clock },
];

const MasonryItem = ({ item, onClick, isPostFirstInPair }: { item: any, onClick: () => void, isPostFirstInPair: boolean }) => (
    <motion.div
        layoutId={`item-container-${item.id}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        onClick={onClick}
        className={cn(
            "relative cursor-pointer group rounded-lg overflow-hidden",
            item.type === 'post' && (isPostFirstInPair ? 'row-span-2' : ''),
        )}
    >
        <Image
            src={item.type === 'post' ? item.data.image.src : item.data.thumbnail}
            alt={item.type === 'post' ? item.data.content : item.data.description}
            width={500}
            height={item.type === 'post' ? (isPostFirstInPair ? 800 : 400) : 711}
            className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-2 right-2 text-white bg-black/30 rounded-full p-1">
            {item.type === 'clip' && <Clapperboard className="h-4 w-4" />}
        </div>
    </motion.div>
);

const FeedViewer = ({ items, activeId, onClose, onScrollTo }: { items: any[], activeId: string, onClose: () => void, onScrollTo: (id: string) => void }) => {
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
    }, [onScrollTo, items]);

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
                <Card className="h-full w-full bg-black flex flex-col rounded-lg overflow-hidden">
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
                     <CardFooter className="bg-card">
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
            onClick={onClose}
        >
            <Button onClick={onClose} variant="ghost" size="icon" className="absolute top-4 right-4 z-50 bg-background/50 rounded-full hover:bg-background">
                <X />
            </Button>
            <div ref={containerRef} className="h-full w-full snap-y snap-mandatory overflow-y-scroll">
                {items.map((item) => (
                    <div key={item.id} data-id={item.id} className="h-full w-full snap-start flex items-center justify-center p-4 sm:p-8 md:p-16" onClick={e => e.stopPropagation()}>
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

const DynamicFeedNav = ({ activeFilter, onFilterChange }: { activeFilter: string, onFilterChange: (id: string) => void }) => {
    return (
        <div className="relative flex justify-center">
            <div className="flex items-center gap-2 rounded-full bg-muted/80 backdrop-blur-sm p-1.5 border">
                {feedFilters.map(filter => (
                    <button
                        key={filter.id}
                        onClick={() => onFilterChange(filter.id)}
                        className={cn(
                            "relative flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors",
                            activeFilter === filter.id ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {activeFilter === filter.id && (
                            <motion.div
                                layoutId="active-filter-bubble"
                                className="absolute inset-0 bg-primary z-0"
                                style={{ borderRadius: 9999 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            />
                        )}
                        <filter.icon className="relative z-10 h-4 w-4" />
                        <span className="relative z-10">{filter.label}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}

const StoryViewer = ({ stories, activeStoryId, onClose, onStorySeen }: { stories: any[], activeStoryId: string, onClose: () => void, onStorySeen: (storyId: string, itemId: number) => void }) => {
    const [currentUserIndex, setCurrentUserIndex] = useState(stories.findIndex(s => s.id === activeStoryId));
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    
    const currentUser = stories[currentUserIndex];
    const currentItem = currentUser.items[currentItemIndex];

    useEffect(() => {
        onStorySeen(currentUser.id, currentItem.id);
    }, [currentUser, currentItem, onStorySeen]);

    useEffect(() => {
        if (isPaused) return;
        const timer = setTimeout(() => {
            handleNextItem();
        }, currentItem.type === 'video' ? 15000 : 5000);
        return () => clearTimeout(timer);
    }, [currentItemIndex, currentUserIndex, isPaused]);

    const handleNextUser = () => {
        if (currentUserIndex < stories.length - 1) {
            setCurrentUserIndex(currentUserIndex + 1);
            setCurrentItemIndex(0);
        } else {
            onClose();
        }
    };

    const handlePrevUser = () => {
        if (currentUserIndex > 0) {
            setCurrentUserIndex(currentUserIndex - 1);
            setCurrentItemIndex(0);
        }
    };
    
    const handleNextItem = () => {
        if (currentItemIndex < currentUser.items.length - 1) {
            setCurrentItemIndex(currentItemIndex + 1);
        } else {
            handleNextUser();
        }
    };

    const handlePrevItem = () => {
        if (currentItemIndex > 0) {
            setCurrentItemIndex(currentItemIndex - 1);
        } else {
            handlePrevUser();
        }
    };
    
    const handlePointerDown = () => setIsPaused(true);
    const handlePointerUp = () => setIsPaused(false);
    
    const handleTap = (e: any) => {
        const { clientX, target } = e;
        const { left, width } = target.getBoundingClientRect();
        const tapPosition = (clientX - left) / width;
        if (tapPosition > 0.3) {
            handleNextItem();
        } else {
            handlePrevItem();
        }
    };

    return (
        <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-lg z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="relative w-[320px] h-[570px] bg-muted rounded-2xl overflow-hidden shadow-2xl"
                layoutId={`story-container-${activeStoryId}`}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                onClick={e => e.stopPropagation()}
                onTap={handleTap}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
            >
                {/* Progress Bars */}
                <div className="absolute top-2 left-2 right-2 flex gap-1 z-10">
                    {currentUser.items.map((item: any, index: number) => (
                        <div key={item.id} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                           <AnimatePresence>
                            {index <= currentItemIndex && (
                                <motion.div 
                                    className="h-full bg-white" 
                                    initial={{ width: index < currentItemIndex ? '100%' : '0%' }}
                                    animate={{ width: isPaused ? '100%' : '100%' }}
                                    transition={{ duration: index === currentItemIndex ? (currentItem.type === 'video' ? 15 : 5) : 0, ease: 'linear' }}
                                />
                            )}
                           </AnimatePresence>
                        </div>
                    ))}
                </div>

                {/* Header */}
                 <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                    <Image src={currentUser.avatar} width={40} height={40} className="rounded-full border-2 border-white" alt={currentUser.user} />
                    <p className="text-white font-bold text-sm">{currentUser.user}</p>
                </div>
                 <Button onClick={onClose} variant="ghost" size="icon" className="absolute top-2 right-2 z-10 text-white hover:bg-white/20">
                     <X />
                 </Button>

                {/* Content */}
                <AnimatePresence initial={false}>
                    <motion.div
                        key={`${currentUser.id}-${currentItem.id}`}
                        className="absolute inset-0"
                        initial={{ x: 320, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -320, opacity: 0 }}
                        transition={{type: 'spring', stiffness: 400, damping: 40}}
                    >
                         {currentItem.type === 'image' && (
                             <Image src={currentItem.src} alt="story content" layout="fill" objectFit="cover" />
                         )}
                         {currentItem.type === 'video' && (
                             <video src={currentItem.src} className="w-full h-full object-cover" autoPlay muted playsInline onEnded={handleNextItem} />
                         )}
                    </motion.div>
                </AnimatePresence>
            </motion.div>
             <button onClick={handlePrevUser} className="absolute left-4 text-white/50 hover:text-white transition-colors p-4"><ArrowLeft size={32} /></button>
             <button onClick={handleNextUser} className="absolute right-4 text-white/50 hover:text-white transition-colors p-4"><ArrowRight size={32} /></button>
        </motion.div>
    );
};

const StoriesTray = ({ stories, onStoryClick, seenStories }: { stories: any[], onStoryClick: (id: string) => void, seenStories: { [key: string]: number[] } }) => {
    
    const isStorySeen = (story: any) => {
        const seenItems = seenStories[story.id] || [];
        return seenItems.length === story.items.length;
    };
    
    const mainStory = stories[0];
    const topStories = stories.slice(1, 3);
    const bottomStories = stories.slice(3, 8);

    const trianglePositions = [
        // Main
        { top: '50%', left: '0', x: '0%', y: '-50%' }, 
        // Top two
        { top: '0%', left: '50%', x: '-50%', y: '0%' },
        { top: '100%', left: '50%', x: '-50%', y: '-100%' },
        // right side
        { top: '25%', left: '100%', x: '-100%', y: '0%' },
        { top: '75%', left: '100%', x: '-100%', y: '-100%' },
    ];
    
    const StoryItem = ({ story, layoutId, onClick, style }: { story: any, layoutId: string, onClick: () => void, style?: any }) => (
         <motion.div
            layoutId={layoutId}
            onClick={onClick}
            style={style}
            className="absolute group cursor-pointer"
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
         >
             <div className="relative">
                <div className={cn("absolute -inset-1 rounded-full bg-gradient-to-tr from-yellow-400 to-primary", { "animate-pulse": !isStorySeen(story), "from-gray-400 to-gray-600": isStorySeen(story) })} />
                <div className="relative w-16 h-16 bg-background p-1 rounded-full">
                    <Image
                        src={story.avatar}
                        alt={story.user}
                        width={60}
                        height={60}
                        className="rounded-full"
                    />
                </div>
                 {story.isLive && (
                    <Badge className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs scale-90" variant="destructive">LIVE</Badge>
                )}
            </div>
             <p className="text-xs font-medium text-muted-foreground truncate w-16 text-center mt-1.5 group-hover:text-foreground">{story.user}</p>
        </motion.div>
    );

    return (
        <div className="relative h-48 w-full flex items-center justify-center my-8">
            <StoryItem story={stories[0]} layoutId={`story-container-${stories[0].id}`} onClick={() => onStoryClick(stories[0].id)} style={{...trianglePositions[0]}} />
            <StoryItem story={stories[1]} layoutId={`story-container-${stories[1].id}`} onClick={() => onStoryClick(stories[1].id)} style={{...trianglePositions[1]}} />
            <StoryItem story={stories[2]} layoutId={`story-container-${stories[2].id}`} onClick={() => onStoryClick(stories[2].id)} style={{...trianglePositions[2]}} />
            <StoryItem story={stories[3]} layoutId={`story-container-${stories[3].id}`} onClick={() => onStoryClick(stories[3].id)} style={{...trianglePositions[3]}} />
            <StoryItem story={stories[4]} layoutId={`story-container-${stories[4].id}`} onClick={() => onStoryClick(stories[4].id)} style={{...trianglePositions[4]}} />
        </div>
    )
}

export default function DynamicFeedsPage() {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [scrolledId, setScrolledId] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState('forYou');
    const [activeStoryId, setActiveStoryId] = useState<string | null>(null);
    const [stories, setStories] = useState(initialStories);
    const [seenStories, setSeenStories] = useState<{ [key: string]: number[] }>({});
    
    const items = useMemo(() => mockContent[activeFilter as keyof typeof mockContent] || [], [activeFilter]);
    let postPairTracker = true;

    const handleStorySeen = useCallback((storyId: string, itemId: number) => {
        setSeenStories(prev => {
            const storySeenItems = prev[storyId] || [];
            if (!storySeenItems.includes(itemId)) {
                return {
                    ...prev,
                    [storyId]: [...storySeenItems, itemId]
                };
            }
            return prev;
        });
    }, []);

    return (
        <div className="container mx-auto p-4 space-y-8">
             <div className="space-y-6">
                <AnimatePresence>
                    {activeStoryId && (
                        <StoryViewer 
                            stories={stories} 
                            activeStoryId={activeStoryId} 
                            onClose={() => setActiveStoryId(null)} 
                            onStorySeen={handleStorySeen}
                        />
                    )}
                </AnimatePresence>
                <StoriesTray stories={stories} onStoryClick={setActiveStoryId} seenStories={seenStories} />
                <DynamicFeedNav activeFilter={activeFilter} onFilterChange={setActiveFilter} />
            </div>

             <motion.div
                key={activeFilter}
                layout
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gridAutoFlow: 'dense',
                    gridAutoRows: '200px',
                    gap: '12px',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <AnimatePresence>
                {items.map((item, index) => {
                    let isPostFirstInPair = false;
                     if (item.type === 'post') {
                         const postIndex = items.filter(it => it.type === 'post').findIndex(it => it.id === item.id);
                         isPostFirstInPair = postIndex % 2 === 0;
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
                </AnimatePresence>
            </motion.div>

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

    

    

    