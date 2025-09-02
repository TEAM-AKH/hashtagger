
'use client';

import { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Send, Users } from 'lucide-react';

const clips = [
  { id: 1, src: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", user: "bunny_lover", description: "Big Buck Bunny adventures!" },
  { id: 2, src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", user: "dreamer", description: "Elephants have dreams too." },
  { id: 3, src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", user: "firestarter", description: "Just chilling by the fire." },
  { id: 4, src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", user: "escape_artist", description: "My great escape" },
];

export default function ClipsPage() {
    const containerRef = useRef<HTMLDivElement>(null);

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
                    video.play();
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
        };
    }, []);

    return (
        <div className="flex justify-center">
            <div ref={containerRef} className="h-[calc(100vh-10rem)] w-full max-w-md snap-y snap-mandatory overflow-y-scroll rounded-lg bg-card border">
                {clips.map(clip => (
                    <div key={clip.id} className="relative h-full w-full snap-start flex-shrink-0">
                        <video loop muted playsInline className="h-full w-full object-cover">
                            <source src={clip.src} type="video/mp4" />
                        </video>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white">
                            <div className="font-bold">@{clip.user}</div>
                            <p className="text-sm">{clip.description}</p>
                        </div>
                        <div className="absolute bottom-4 right-4 flex flex-col gap-4">
                            <Button variant="ghost" size="icon" className="text-white hover:text-red-500 rounded-full">
                                <Heart className="h-7 w-7" />
                                <span className="sr-only">Hubb</span>
                            </Button>
                            <Button variant="ghost" size="icon" className="text-white hover:text-blue-400 rounded-full">
                                <MessageCircle className="h-7 w-7" />
                                <span className="sr-only">Express</span>
                            </Button>
                            <Button variant="ghost" size="icon" className="text-white hover:text-green-400 rounded-full">
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
