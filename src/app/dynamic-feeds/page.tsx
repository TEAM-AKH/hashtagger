
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Send, X, Plus, MoreHorizontal, Trash2, Edit, Share, FolderHeart, PlayCircle, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import PostCard from '@/components/post-card';
import { Badge } from '@/components/ui/badge';

const initialFeeds = [
  { id: 1, user: 'nature_lover', image: 'https://picsum.photos/seed/feed1/400/700', duration: 5000 },
  { id: 2, user: 'city_explorer', image: 'https://picsum.photos/seed/feed2/400/700', duration: 7000 },
  { id: 3, user: 'foodie', image: 'https://picsum.photos/seed/feed3/400/700', duration: 6000 },
  { id: 4, user: 'dev_guru', image: 'https://picsum.photos/seed/feed4/400/700', duration: 5000 },
  { id: 5, user: 'travel_bug', image: 'https://picsum.photos/seed/feed5/400/700', duration: 8000 },
  { id: 6, user: 'art_enthusiast', image: 'https://picsum.photos/seed/feed6/400/700', duration: 5500 },
];

const mockContent = {
  'For You': [
    { type: 'post', data: { id: 1, author: { name: "Alice", avatar: "https://picsum.photos/seed/1/100", hint: "woman smiling" }, content: "Just enjoying a beautiful day out! ☀️ #nature", image: { src: "https://picsum.photos/seed/post1/600/375", hint: "landscape nature" }, likes: 12, comments: [], circles: [{id: 1, name: "Best Friends"}], isSaved: false } },
    { type: 'clip', data: { id: 1, src: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", thumbnail: "https://picsum.photos/seed/clip1/400/711", user: "bunny_lover", description: "Big Buck Bunny adventures!" } },
    { type: 'post', data: { id: 2, author: { name: "Bob", avatar: "https://picsum.photos/seed/2/100", hint: "man glasses" }, content: "My new minimalist workspace setup. #wfh", image: { src: "https://picsum.photos/seed/post2/600/375", hint: "computer desk" }, likes: 45, comments: [], circles: [], isSaved: true } },
    { type: 'clip', data: { id: 2, src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", thumbnail: "https://picsum.photos/seed/clip2/400/711", user: "dreamer", description: "Elephants have dreams too." } },
  ],
  'Trending': [
     { type: 'clip', data: { id: 3, src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", thumbnail: "https://picsum.photos/seed/clip3/400/711", user: "firestarter", description: "Just chilling by the fire." } },
     { type: 'post', data: { id: 3, author: { name: "Charlie", avatar: "https://picsum.photos/seed/3/100", hint: "person nature" }, content: "Exploring the hidden gems of the city. #urbanexplorer", image: { src: "https://picsum.photos/seed/post3/600/375", hint: "city street art" }, likes: 23, comments: [], circles: [], isSaved: false } },
  ],
  'Following': [
     { type: 'post', data: { id: 4, author: { name: "David", avatar: "https://picsum.photos/seed/4/100", hint: "man portrait" }, content: "Weekend baking project: success! 🍞", image: { src: "https://picsum.photos/seed/post4/600/375", hint: "fresh bread" }, likes: 78, comments: [], circles: [], isSaved: false } },
  ],
   'Recent': [
    { type: 'post', data: { id: 5, author: { name: "Eve", avatar: "https://picsum.photos/seed/5/100", hint: "woman nature" }, content: "Morning hike views. #hiking", image: { src: "https://picsum.photos/seed/post5/600/375", hint: "mountain sunrise" }, likes: 102, comments: [], isSaved: true } },
  ],
   'Discover': [
    { type: 'clip', data: { id: 4, src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", thumbnail: "https://picsum.photos/seed/clip4/400/711", user: "escape_artist", description: "My great escape" } },
    { type: 'clip', data: { id: 5, src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", thumbnail: "https://picsum.photos/seed/clip5/400/711", user: "fun_times", description: "Living my best life!" } },
  ]
};

const tabs = ['For You', 'Trending', 'Following', 'Recent', 'Discover'];

export default function DynamicFeedsPage() {
  const [feeds, setFeeds] =useState(initialFeeds);
  const [currentFeedIndex, setCurrentFeedIndex] = useState<number | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [selectedClip, setSelectedClip] = useState<any>(null);

  const openFeed = (index: number) => setCurrentFeedIndex(index);
  const closeFeed = () => setCurrentFeedIndex(null);

  const nextFeed = () => {
    if (currentFeedIndex !== null) {
      setCurrentFeedIndex(prev => (prev! + 1) % feeds.length);
    }
  };
  
  const prevFeed = () => {
    if (currentFeedIndex !== null) {
      setCurrentFeedIndex(prev => (prev! - 1 + feeds.length) % feeds.length);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setPreviewImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleCreateFeed = () => {
    if (previewImage) {
        const newFeed = {
            id: Date.now(),
            user: 'your_username',
            image: previewImage,
            duration: 5000,
        };
        setFeeds([newFeed, ...feeds]);
        setIsCreateDialogOpen(false);
        setPreviewImage(null);
    }
  };

  const currentFeed = currentFeedIndex !== null ? feeds[currentFeedIndex] : null;

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div>
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Dynamic Feeds</h1>
            <Button variant="outline" size="sm" onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create
            </Button>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {feeds.map((feed, index) => (
            <motion.div
                key={feed.id}
                layoutId={`feed-card-story-${feed.id}`}
                className="aspect-[9/16] rounded-lg overflow-hidden relative cursor-pointer group ring-2 ring-transparent hover:ring-primary transition-all"
                onClick={() => openFeed(index)}
                whileHover={{ scale: 1.05 }}
            >
                <img src={feed.image} alt={`Feed from ${feed.user}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 left-2 text-white text-xs font-bold">
                @{feed.user}
                </div>
            </motion.div>
            ))}
        </div>
      </div>
      
      <div className="sticky top-16 bg-background/90 backdrop-blur-sm py-3 z-30">
          <div className="bg-muted p-1.5 rounded-full flex items-center justify-between gap-1">
              {tabs.map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`relative w-full rounded-full py-2 text-sm font-semibold transition-colors ${activeTab === tab ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                      {activeTab === tab && <motion.div layoutId="bubble" className="absolute inset-0 bg-primary rounded-full z-0" />}
                      <span className="relative z-10">{tab}</span>
                  </button>
              ))}
          </div>
      </div>

       <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {(mockContent[activeTab as keyof typeof mockContent] || []).map((item, index) => (
             item.type === 'post' ? (
                 <PostCard key={`post-${item.data.id}-${index}`} post={item.data} />
             ) : (
                 <Card key={`clip-${item.data.id}-${index}`} className="overflow-hidden cursor-pointer group" onClick={() => setSelectedClip(item.data)}>
                    <div className="relative aspect-[9/16] bg-muted">
                       <img src={item.data.thumbnail} alt={item.data.description} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-center justify-center">
                            <PlayCircle className="h-16 w-16 text-white/70 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                        </div>
                         <div className="absolute bottom-0 left-0 p-4 text-white">
                             <p className="font-bold">@{item.data.user}</p>
                             <p className="text-sm">{item.data.description}</p>
                         </div>
                    </div>
                 </Card>
             )
          ))}
      </motion.div>

      <AnimatePresence>
        {currentFeed && currentFeedIndex !== null && (
          <motion.div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
            onClick={closeFeed}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              layoutId={`feed-card-story-${currentFeed.id}`}
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
                     <div className='flex items-center gap-1'>
                        <Button variant="ghost" size="icon" onClick={closeFeed} className="text-white hover:bg-white/20"><X/></Button>
                    </div>
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

       <AnimatePresence>
          {selectedClip && (
               <motion.div
                className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
                onClick={() => setSelectedClip(null)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                >
                    <motion.div 
                        className="relative w-full max-w-md h-[90vh] bg-black rounded-lg overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                        layoutId={`clip-card-${selectedClip.id}`}
                    >
                        <video src={selectedClip.src} className="w-full h-full object-contain" autoPlay controls />
                        <Button variant="ghost" size="icon" onClick={() => setSelectedClip(null)} className="absolute top-4 right-4 text-white bg-black/30 hover:bg-black/50 rounded-full"><X/></Button>
                    </motion.div>
                </motion.div>
          )}
       </AnimatePresence>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a New Feed</DialogTitle>
                    <DialogDescription>Upload an image or video to share with your friends for 24 hours.</DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div 
                        className="w-full aspect-[9/16] rounded-md border-2 border-dashed flex flex-col items-center justify-center cursor-pointer bg-muted"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {previewImage ? (
                            <div className="w-full h-full relative">
                                <img src={previewImage} alt="Preview" className="w-full h-full object-cover"/>
                                <Button variant="destructive" size="icon" className="absolute top-2 right-2" onClick={(e) => { e.stopPropagation(); setPreviewImage(null)}}><X className="h-4 w-4"/></Button>
                            </div>
                        ) : (
                           <>
                               <Camera className="h-16 w-16 text-muted-foreground/50 mb-2"/>
                               <p className="text-muted-foreground">Tap to select image</p>
                           </>
                        )}
                    </div>
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
