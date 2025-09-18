
'use client';

import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Flame, MessageCircle, Send, MoreVertical, Upload, Flag, ThumbsUp, ThumbsDown, Wand2, Forward } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from 'framer-motion';

const clips = [
  { id: 1, src: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", user: "bunny_lover", description: "Big Buck Bunny adventures!" },
  { id: 2, src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", user: "dreamer", description: "Elephants have dreams too." },
  { id: 3, src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", user: "firestarter", description: "Just chilling by the fire." },
  { id: 4, src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", user: "escape_artist", description: "My great escape" },
  { id: 5, src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", user: "fun_times", description: "Living my best life!" },
  { id: 6, src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", user: "joy_rider", description: "Cruising into the weekend." },
  { id: 7, src: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", user: "sintel_fan", description: "The journey begins." },
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
    const [handsFreeLoops, setHandsFreeLoops] = useState<string>('default'); // 'default', '1' to '6'
    const [playbackRate, setPlaybackRate] = useState('1');
    const [currentClip, setCurrentClip] = useState<number>(0);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

    useEffect(() => {
        videoRefs.current = videoRefs.current.slice(0, clips.length);
    }, []);
    
    useEffect(() => {
        const currentVideo = videoRefs.current[currentClip];
        if (currentVideo) {
            currentVideo.playbackRate = parseFloat(playbackRate);
        }
    }, [playbackRate, currentClip]);


    const handleLike = (id: number) => {
        setShowLikeAnimation(id);
        setTimeout(() => setShowLikeAnimation(null), 1200);
    };

    const handleScrollToNext = (index: number) => {
        const nextIndex = (index + 1) % clips.length;
        const container = containerRef.current;
        if (container) {
            const nextVideoElement = container.children[nextIndex];
            nextVideoElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setCurrentClip(nextIndex);
        }
    };

    const setupAutoScroll = (video: HTMLVideoElement, index: number) => {
        let loopCount = 0;
        const targetLoops = handsFreeLoops === 'default' ? 2 : parseInt(handsFreeLoops, 10);
        
        if (targetLoops === 0) return; // Hands-free disabled

        const onEnded = () => {
            loopCount++;
            if (loopCount >= targetLoops) {
                handleScrollToNext(index);
            } else {
                video.play();
            }
        };

        video.addEventListener('ended', onEnded);
        return () => video.removeEventListener('ended', onEnded);
    };


    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    const video = entry.target as HTMLVideoElement;
                    const index = videoRefs.current.indexOf(video);
                    
                    if (entry.isIntersecting) {
                        video.playbackRate = parseFloat(playbackRate);
                        video.play().catch(e => console.error("Autoplay failed", e));
                        setCurrentClip(index);
                        const cleanup = setupAutoScroll(video, index);
                        (video as any).cleanupAutoScroll = cleanup;

                    } else {
                        video.pause();
                        if ((video as any).cleanupAutoScroll) {
                            (video as any).cleanupAutoScroll();
                        }
                    }
                });
            },
            { threshold: 0.7 } // At least 70% of the video is visible
        );

        videoRefs.current.forEach(video => {
            if (video) observer.observe(video);
        });

        return () => {
            videoRefs.current.forEach(video => {
                if (video) observer.unobserve(video);
            });
        };
    }, [handsFreeLoops, playbackRate]);
    

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
                {clips.map((clip, index) => (
                    <div key={clip.id} className="relative h-full w-full snap-start flex-shrink-0">
                        <video ref={el => videoRefs.current[index] = el} loop={handsFreeLoops === "0"} muted playsInline className="h-full w-full object-cover">
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
                                    <span className="text-6xl" style={{filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.7))'}}>🤓</span>
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
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>
                                            <Wand2 className="mr-2 h-4 w-4" />
                                            Hands-free
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuRadioGroup value={handsFreeLoops} onValueChange={setHandsFreeLoops}>
                                                <DropdownMenuRadioItem value="default">Default (2 loops)</DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="1">1 loop</DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="2">2 loops</DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="3">3 loops</DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="4">4 loops</DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="5">5 loops</DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="6">6 loops</DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="0">Disabled</DropdownMenuRadioItem>
                                            </DropdownMenuRadioGroup>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuSub>
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>
                                            <Forward className="mr-2 h-4 w-4" />
                                            Pace
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuRadioGroup value={playbackRate} onValueChange={setPlaybackRate}>
                                                <DropdownMenuRadioItem value="2">2x</DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="1.5">1.5x</DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="1">Normal</DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="0.75">0.75x</DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="0.5">0.5x</DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="0.25">0.25x</DropdownMenuRadioItem>
                                            </DropdownMenuRadioGroup>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuSub>
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

    