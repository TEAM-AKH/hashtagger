
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Play, Send, Timer, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

const initialFeeds = [
  { id: 1, user: 'nature_lover', image: 'https://picsum.photos/seed/feed1/400/700', duration: 5000 },
  { id: 2, user: 'city_explorer', image: 'https://picsum.photos/seed/feed2/400/700', duration: 5000 },
  { id: 3, user: 'foodie', image: 'https://picsum.photos/seed/feed3/400/700', duration: 5000 },
];

export default function DynamicFeedsPage() {
  const [currentFeedIndex, setCurrentFeedIndex] = useState<number | null>(null);

  const openFeed = (index: number) => {
    setCurrentFeedIndex(index);
  };

  const closeFeed = () => {
    setCurrentFeedIndex(null);
  };

  const nextFeed = () => {
    if (currentFeedIndex !== null) {
      setCurrentFeedIndex((prev) => (prev! + 1) % initialFeeds.length);
    }
  };
  
  const prevFeed = () => {
    if (currentFeedIndex !== null) {
      setCurrentFeedIndex((prev) => (prev! - 1 + initialFeeds.length) % initialFeeds.length);
    }
  };

  const currentFeed = currentFeedIndex !== null ? initialFeeds[currentFeedIndex] : null;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dynamic Feeds</h1>
        <Button>
          <Camera className="mr-2 h-4 w-4" /> Create Feed
        </Button>
      </div>

      <p className="text-muted-foreground mb-6">Ephemeral posts that last for a limited time. Tap to view.</p>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
        {initialFeeds.map((feed, index) => (
          <motion.div
            key={feed.id}
            className="aspect-[9/16] rounded-lg overflow-hidden relative cursor-pointer group"
            onClick={() => openFeed(index)}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <img src={feed.image} alt={`Feed from ${feed.user}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-2 left-2 text-white text-sm font-bold">
              @{feed.user}
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {currentFeed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
            onClick={closeFeed}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative w-full max-w-sm h-[90vh] bg-background rounded-xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={currentFeed.image} alt={`Feed from ${currentFeed.user}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex flex-col">
                <div className="flex-1" onClick={prevFeed}/>
                <div className="flex-1" onClick={nextFeed}/>
              </div>
              <div className="absolute top-0 left-0 right-0 p-4">
                <div className="flex items-center gap-2">
                    <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                        <motion.div 
                            className="bg-white h-full"
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: currentFeed.duration / 1000, ease: 'linear' }}
                            onAnimationComplete={nextFeed}
                        />
                    </div>
                </div>
                 <div className="flex items-center justify-between mt-2 text-white">
                    <p className="font-bold text-sm">@{currentFeed.user}</p>
                    <Button variant="ghost" size="icon" onClick={closeFeed}><X/></Button>
                 </div>
              </div>
               <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-2">
                  <input placeholder="Send a message..." className="w-full bg-black/50 border border-white/30 rounded-full px-4 py-2 text-white placeholder:text-white/70" />
                  <Button variant="ghost" size="icon" className="text-white"><Send /></Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
       <Card className="mt-8">
            <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">How it works</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li><strong className="text-foreground">One-time Watch:</strong> This feed can only be viewed once.</li>
                    <li><strong className="text-foreground">24-hour Limit:</strong> This feed will disappear after 24 hours.</li>
                </ul>
            </CardContent>
        </Card>
    </div>
  );
}
