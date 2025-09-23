
'use client';

import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { MoreVertical, Upload, Flag, ThumbsUp, ThumbsDown, Wand2, Forward, X } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from 'framer-motion';
import { VibeButton } from '@/components/vibe-button';
import { CirculateButton } from '@/components/circulate-button';
import { ExpressButton } from '@/components/express-button';

const clips = [
  { id: 1, src: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", user: "bunny_lover", description: "Big Buck Bunny adventures!", vibes: 128, expresses: 42, circulates: 18 },
  { id: 2, src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", user: "dreamer", description: "Elephants have dreams too.", vibes: 256, expresses: 89, circulates: 23 },
  { id: 3, src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", user: "firestarter", description: "Just chilling by the fire.", vibes: 512, expresses: 120, circulates: 45 },
  { id: 4, src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", user: "escape_artist", description: "My great escape", vibes: 1024, expresses: 340, circulates: 99 },
  { id: 5, src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", user: "fun_times", description: "Living my best life!", vibes: 2048, expresses: 560, circulates: 150 },
];

const Clip = ({ clip, isVisible, onNext, handsFreeLoops, playbackRate }: { clip: any, isVisible: boolean, onNext: () => void, handsFreeLoops: string, playbackRate: string }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [showComments, setShowComments] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (isVisible) {
            video.playbackRate = parseFloat(playbackRate);
            video.play().catch(e => console.error("Autoplay failed", e));
        } else {
            video.pause();
            video.currentTime = 0;
            setShowComments(false); // Close comments when clip is not visible
        }
    }, [isVisible, playbackRate]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !isVisible) return;
        
        let loopCount = 0;
        const targetLoops = handsFreeLoops === 'default' ? 2 : parseInt(handsFreeLoops, 10);

        if (targetLoops === 0) { // loop is disabled in this case
            video.loop = false;
            return;
        } else {
            video.loop = false;
        }

        const handleEnded = () => {
            loopCount++;
            if (loopCount >= targetLoops) {
                onNext();
            } else {
                video.play();
            }
        };
        
        video.addEventListener('ended', handleEnded);
        return () => video.removeEventListener('ended', handleEnded);

    }, [isVisible, onNext, handsFreeLoops]);
    
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.loop = handsFreeLoops === "0";
        }
    }, [handsFreeLoops]);
    

    return (
        <div className="relative h-full w-full snap-start flex-shrink-0" onClick={() => showComments && setShowComments(false)}>
            <video ref={videoRef} muted playsInline className="h-full w-full object-cover">
                <source src={clip.src} type="video/mp4" />
            </video>
            
            {/* Gradient and Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white pointer-events-none">
                <div className="font-bold">@{clip.user}</div>
                <p className="text-sm">{clip.description}</p>
            </div>

            {/* Top Right Controls */}
            <div className="absolute top-4 right-4 z-20">
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
                                <DropdownMenuRadioGroup value={handsFreeLoops} onValueChange={() => {}}>
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
                                <DropdownMenuRadioGroup value={playbackRate} onValueChange={() => {}}>
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

            {/* Right Side Actions */}
            <div className="absolute bottom-4 right-4 flex flex-col items-center gap-4 z-10">
               <div className="flex flex-col items-center gap-1 text-white">
                    <VibeButton showLabel={false} />
                    <span className="text-xs font-bold">{clip.vibes}</span>
               </div>
                <div className="flex flex-col items-center gap-1 text-white">
                    <ExpressButton
                        docId={clip.id.toString()}
                        onToggle={() => setShowComments(!showComments)}
                        showBox={showComments}
                        showLabel={false}
                    />
                    <span className="text-xs font-bold">{clip.expresses}</span>
                </div>
               <div className="flex flex-col items-center gap-1 text-white">
                    <CirculateButton showLabel={false} />
                    <span className="text-xs font-bold">{clip.circulates}</span>
               </div>
            </div>

            {/* Comment Overlay */}
            <AnimatePresence>
                {showComments && (
                    <motion.div
                         initial={{ y: "100%", opacity: 0.8 }}
                         animate={{ y: "50%", opacity: 1 }}
                         exit={{ y: "100%", opacity: 0.8 }}
                         transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                         className="absolute bottom-0 left-0 right-0 h-full bg-card/80 backdrop-blur-md rounded-t-lg shadow-lg flex flex-col z-20"
                         onClick={(e) => e.stopPropagation()}
                    >
                       <div className="w-12 h-1.5 bg-muted-foreground/50 rounded-full mx-auto my-2 cursor-grab" onPointerDown={() => setShowComments(false)}/>
                       <ExpressButton docId={clip.id.toString()} mode="inline-content" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default function ClipsPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [handsFreeLoops, setHandsFreeLoops] = useState<string>('default');
    const [playbackRate, setPlaybackRate] = useState('1');
    const [currentClipIndex, setCurrentClipIndex] = useState(0);

    const handleScrollToNext = (index: number) => {
        const nextIndex = (index + 1) % clips.length;
        const container = containerRef.current;
        if (container) {
            container.children[nextIndex]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const index = Array.from(container.children).indexOf(entry.target);
                        setCurrentClipIndex(index);
                    }
                });
            },
            { threshold: 0.7 }
        );

        Array.from(container.children).forEach(child => observer.observe(child));

        return () => observer.disconnect();
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
                {clips.map((clip, index) => (
                    <Clip
                        key={clip.id}
                        clip={clip}
                        isVisible={index === currentClipIndex}
                        onNext={() => handleScrollToNext(index)}
                        handsFreeLoops={handsFreeLoops}
                        playbackRate={playbackRate}
                    />
                ))}
            </div>
        </div>
    );
}
