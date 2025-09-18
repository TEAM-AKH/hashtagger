
'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Send, X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const initialFeeds = [
  { id: 1, user: 'nature_lover', image: 'https://picsum.photos/seed/feed1/400/700', duration: 5000 },
  { id: 2, user: 'city_explorer', image: 'https://picsum.photos/seed/feed2/400/700', duration: 7000 },
  { id: 3, user: 'foodie', image: 'https://picsum.photos/seed/feed3/400/700', duration: 6000 },
  { id: 4, user: 'dev_guru', image: 'https://picsum.photos/seed/feed4/400/700', duration: 5000 },
];

export default function DynamicFeedsPage() {
  const [feeds, setFeeds] = useState(initialFeeds);
  const [currentFeedIndex, setCurrentFeedIndex] = useState<number | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openFeed = (index: number) => {
    setCurrentFeedIndex(index);
  };

  const closeFeed = () => {
    setCurrentFeedIndex(null);
  };

  const nextFeed = () => {
    if (currentFeedIndex !== null) {
      if (currentFeedIndex === feeds.length - 1) {
        closeFeed();
      } else {
        setCurrentFeedIndex((prev) => prev! + 1);
      }
    }
  };
  
  const prevFeed = () => {
    if (currentFeedIndex !== null) {
        if (currentFeedIndex === 0) return;
        setCurrentFeedIndex((prev) => prev! - 1);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateFeed = () => {
    if (previewImage) {
        const newFeed = {
            id: Date.now(),
            user: 'your_username',
            image: previewImage,
            duration: 5000, // Default duration
        };
        setFeeds([newFeed, ...feeds]);
        setIsCreateDialogOpen(false);
        setPreviewImage(null);
    }
  };

  const currentFeed = currentFeedIndex !== null ? feeds[currentFeedIndex] : null;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dynamic Feeds</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Camera className="mr-2 h-4 w-4" /> Create Feed
        </Button>
      </div>

      <p className="text-muted-foreground mb-6">Ephemeral posts that last for a limited time. Tap to view.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <motion.div
            className="aspect-[9/16] rounded-lg border-2 border-dashed border-muted-foreground/50 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:text-primary transition-colors"
            onClick={() => setIsCreateDialogOpen(true)}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
        >
            <Plus className="h-12 w-12 text-muted-foreground/50"/>
            <p className="mt-2 text-sm font-semibold">Add Yours</p>
        </motion.div>

        {feeds.map((feed, index) => (
          <motion.div
            key={feed.id}
            layoutId={`feed-card-${feed.id}`}
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
        {currentFeed && currentFeedIndex !== null &&(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
            onClick={closeFeed}
          >
            <motion.div
              layoutId={`feed-card-${currentFeed.id}`}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative w-full max-w-sm h-[90vh] bg-background rounded-xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={currentFeed.image} alt={`Feed from ${currentFeed.user}`} className="w-full h-full object-cover" />
              <div className="absolute inset-x-0 top-0 h-1/2" onClick={prevFeed}/>
              <div className="absolute inset-x-0 bottom-0 h-1/2" onClick={nextFeed}/>

              <div className="absolute top-0 left-0 right-0 p-4">
                <div className="flex items-center gap-2">
                    {feeds.map((_, index) => (
                        <div key={index} className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                           {index < currentFeedIndex && <div className="bg-white h-full w-full" />}
                           {index === currentFeedIndex && (
                                <motion.div 
                                    className="bg-white h-full"
                                    initial={{ width: '0%' }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: currentFeed.duration / 1000, ease: 'linear' }}
                                    onAnimationComplete={nextFeed}
                                />
                           )}
                        </div>
                    ))}
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
                    <li><strong className="text-foreground">One-time Watch:</strong> Feeds can only be viewed once. Re-watching is not allowed.</li>
                    <li><strong className="text-foreground">24-hour Limit:</strong> Feeds will disappear after 24 hours.</li>
                </ul>
            </CardContent>
        </Card>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a New Feed</DialogTitle>
                    <DialogDescription>Upload an image or video to share with your friends for 24 hours.</DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <AnimatePresence>
                    {previewImage ? (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="w-full aspect-[9/16] rounded-md bg-muted flex items-center justify-center relative overflow-hidden"
                        >
                            <img src={previewImage} alt="Preview" className="w-full h-full object-cover"/>
                            <Button variant="destructive" size="icon" className="absolute top-2 right-2" onClick={() => setPreviewImage(null)}><X className="h-4 w-4"/></Button>
                        </motion.div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, height: 'auto' }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, height: 0 }}
                            className="w-full aspect-[9/16] rounded-md border-2 border-dashed flex flex-col items-center justify-center cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        >
                           <Camera className="h-16 w-16 text-muted-foreground/50 mb-2"/>
                           <p className="text-muted-foreground">Tap to select image</p>
                        </motion.div>
                    )}
                    </AnimatePresence>
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                </div>
                <DialogFooter>
                    <Button variant="secondary" onClick={() => {setIsCreateDialogOpen(false); setPreviewImage(null)}}>Cancel</Button>
                    <Button onClick={handleCreateFeed} disabled={!previewImage}>Post Feed</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  );
}

    