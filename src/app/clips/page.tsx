
'use client';

import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Flame, MessageCircle, Send, MoreVertical, Upload, Flag, ThumbsUp, ThumbsDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from 'framer-motion';

const clips = [
  { id: 1, src: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", user: "bunny_lover", description: "Big Buck Bunny adventures!" },
  { id: 2, src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", user: "dreamer", description: "Elephants have dreams too." },
  { id: 3, src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", user: "firestarter", description: "Just chilling by the fire." },
  { id: 4, src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", user: "escape_artist", description: "My great escape" },
];

const bubbleVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.1,
      type: 'spring',
      stiffness: 150,
      damping: 10,
    },
  }),
  exit: {
    opacity: 0,
    scale: 0,
    transition: { duration: 0.3 }
  }
};

export default function ClipsPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [showLikeAnimation, setShowLikeAnimation] = useState<number | null>(null);

    const handleLike = (id: number) => {
        setShowLikeAnimation(id);
        setTimeout(() => setShowLikeAnimation(null), 1200);
    };

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const videos = Array.from(container.getElementsByTagName('video'));
            const containerTop = container.getBoundingClientRect().top;
            const containerHeight = container.clientHeight;

            videos.forEach(video => {
                const videoTop = video.getBoundingClientRect().top;
                const videoHeight = video.clientHeight;
                const isVisible = videoTop >= containerTop && videoTop + videoHeight <= containerTop + containerHeight + 20;

                if (isVisible) {
                    const playPromise = video.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            if (error.name === 'AbortError') {
                                // This is fine, the user scrolled away
                            } else {
                                console.error("Video play failed:", error)
                            }
                        });
                    }
                } else {
                    video.pause();
                }
            });
        };

        container.addEventListener('scroll', handleScroll);
        // Initial check
        handleScroll();

        return () => {
            container.removeEventListener('scroll', handleScroll);
            const videos = Array.from(container.getElementsByTagName('video'));
            videos.forEach(video => video.pause());
        };
    }, []);

    return (
        <div className="flex justify-center relative">
             <motion.div
                initial={{ scale: 0, opacity: 0, right: 16 }}
                animate={{ scale: 1, opacity: 1, right: 48 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="absolute top-0 z-10"
                >
                <Button className="rounded-full shadow-lg">
                    <Upload className="mr-2" />
                    Upload Clip
                </Button>
            </motion.div>
            <div ref={containerRef} className="h-[calc(100vh-10rem)] w-full max-w-md snap-y snap-mandatory overflow-y-scroll rounded-lg bg-card border">
                {clips.map(clip => (
                    <div key={clip.id} className="relative h-full w-full snap-start flex-shrink-0">
                        <video loop muted playsInline className="h-full w-full object-cover">
                            <source src={clip.src} type="video/mp4" />
                        </video>
                         <AnimatePresence>
                          {showLikeAnimation === clip.id && (
                            <motion.div
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              className="absolute inset-0 flex items-center justify-center pointer-events-none"
                            >
                                <motion.div custom={0} variants={bubbleVariants} className="absolute">
                                    <Flame className="h-32 w-32 text-red-500/80" fill="currentColor" />
                                </motion.div>
                                <motion.div custom={1} variants={bubbleVariants} className="absolute" style={{ top: '30%', left: '25%', transform: 'rotate(-20deg)' }}>
                                    <Flame className="h-16 w-16 text-orange-400/80" fill="currentColor" />
                                </motion.div>
                                <motion.div custom={2} variants={bubbleVariants} className="absolute" style={{ bottom: '30%', right: '25%', transform: 'rotate(20deg)' }}>
                                    <Flame className="h-20 w-20 text-yellow-400/80" fill="currentColor" />
                                </motion.div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <div className="absolute top-4 right-4 z-10">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-white rounded-full bg-black/30 hover:bg-black/50">
                                        <MoreVertical className="h-6 w-6" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem><Flag className="mr-2"/>Report</DropdownMenuItem>
                                    <DropdownMenuItem><ThumbsUp className="mr-2"/>Interested</DropdownMenuItem>
                                    <DropdownMenuItem><ThumbsDown className="mr-2"/>Not Interested</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white">
                            <div className="font-bold">@{clip.user}</div>
                            <p className="text-sm">{clip.description}</p>
                        </div>
                        <div className="absolute bottom-4 right-4 flex flex-col gap-4">
                            <Button variant="ghost" size="icon" className="text-white hover:text-red-500 rounded-full bg-black/30 hover:bg-black/50" onClick={() => handleLike(clip.id)}>
                                <Flame className="h-7 w-7" />
                                <span className="sr-only">Lit</span>
                            </Button>
                            <Button variant="ghost" size="icon" className="text-white hover:text-blue-400 rounded-full bg-black/30 hover:bg-black/50">
                                <MessageCircle className="h-7 w-7" />
                                <span className="sr-only">Express</span>
                            </Button>
                            <Button variant="ghost" size="icon" className="text-white hover:text-green-400 rounded-full bg-black/30 hover:bg-black/50">
                                <Send className="h-7 w-7" />
                                <span className="sr-only">Circulate</span>
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
