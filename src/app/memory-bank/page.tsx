
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, ChevronDown, Clapperboard, Film, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PostCard from '@/components/post-card';
import Image from 'next/image';

const memoryData = {
  "2024": {
    photos: [
      { id: 1, type: 'post', date: new Date('2024-05-15T10:30:00'), data: {
          id: 101,
          author: { name: "You", avatar: "https://picsum.photos/seed/user/100", hint: "person selfie" },
          content: "A beautiful memory from May 2024!",
          image: { src: "https://picsum.photos/600/375?random=202405", hint: "spring landscape" },
          likes: 15,
          comments: 4,
          circle: "Best Friends",
      }},
    ],
    clips: [
        { id: 1, type: 'clip', date: new Date('2024-03-20T18:00:00'), data: { id: 201, src: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", user: "You", description: "Remember this fun clip from March?" } },
    ],
    hashflicks: [],
  },
  "2023": {
    photos: [
       { id: 2, type: 'post', date: new Date('2023-11-01T12:00:00'), data: {
          id: 102,
          author: { name: "You", avatar: "https://picsum.photos/seed/user/100", hint: "person selfie" },
          content: "Throwback to Autumn 2023.",
          image: { src: "https://picsum.photos/600/375?random=202311", hint: "autumn leaves" },
          likes: 42,
          comments: 8,
          circle: "Family",
      }},
    ],
    clips: [],
    hashflicks: [
      { id: 1, type: 'hashflick', date: new Date('2023-08-10T20:15:00'), data: { id: 301, videoSrc: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", title: "Summer Movie Night 2023", user: "You", thumbnail: "https://picsum.photos/seed/flick2023/800/450" } },
    ],
  }
};

const categoryIcons = {
    photos: <ImageIcon className="h-5 w-5 mr-2" />,
    clips: <Film className="h-5 w-5 mr-2" />,
    hashflicks: <Clapperboard className="h-5 w-5 mr-2" />,
}

const categoryTitles = {
    photos: "Photos & Hashtags",
    clips: "Short Videos - Clips",
    hashflicks: "Short Videos - HASHFLICKS",
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
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

export default function MemoryBankPage() {
    const [expandedYear, setExpandedYear] = useState<string | null>(Object.keys(memoryData)[0]);
    const [expandedCategory, setExpandedCategory] = useState<{year: string, category: string} | null>(null);

    const toggleYear = (year: string) => {
        setExpandedYear(prev => (prev === year ? null : year));
        setExpandedCategory(null);
    }
    
    const toggleCategory = (year: string, category: string) => {
        setExpandedCategory(prev => (prev?.year === year && prev.category === category ? null : { year, category }));
    }

    const formatDate = (date: Date) => {
        return `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()} at ${date.toLocaleTimeString()}`;
    }

  return (
    <div className="container mx-auto p-4">
        <div className="text-center mb-12">
            <motion.div 
                initial={{ scale: 0.5, opacity: 0}} 
                animate={{ scale: 1, opacity: 1}}
                transition={{ type: 'spring', damping: 10, stiffness: 100}}
                className="inline-block bg-primary/10 p-4 rounded-full mb-4"
            >
                <BrainCircuit className="h-16 w-16 text-primary" />
            </motion.div>
            <motion.h1 
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 pb-2">
                Memory Bank
            </motion.h1>
            <motion.p 
                 variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{delay: 0.1}}
                className="max-w-[600px] mx-auto text-muted-foreground md:text-xl">
                A browsable history of your digital life. Revisit your posts, photos, and videos.
            </motion.p>
        </div>

      <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
        {Object.keys(memoryData).map(year => (
          <motion.div key={year} variants={itemVariants} className="border rounded-lg overflow-hidden bg-card">
            <button onClick={() => toggleYear(year)} className="w-full p-4 flex justify-between items-center text-left bg-card hover:bg-muted/50 transition-colors">
              <h2 className="text-2xl font-bold">{year}</h2>
              <motion.div animate={{ rotate: expandedYear === year ? 180 : 0 }}>
                <ChevronDown />
              </motion.div>
            </button>
            <AnimatePresence>
            {expandedYear === year && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-4 pb-4 space-y-3"
              >
                {Object.keys(memoryData[year as keyof typeof memoryData]).map(category => {
                    const items = memoryData[year as keyof typeof memoryData][category as keyof typeof memoryData['2024']];
                    if (items.length === 0) return null;

                    return (
                        <div key={category}>
                             <Button variant="outline" className="w-full justify-start" onClick={() => toggleCategory(year, category)}>
                                {categoryIcons[category as keyof typeof categoryIcons]}
                                {categoryTitles[category as keyof typeof categoryTitles]}
                                <Badge variant="secondary" className="ml-auto">{items.length}</Badge>
                            </Button>
                            <AnimatePresence>
                            {expandedCategory?.year === year && expandedCategory.category === category && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="pt-4 space-y-4"
                                >
                                    {items.map(item => (
                                        <Card key={item.id} className="overflow-hidden">
                                            <CardContent className="p-4">
                                                {item.type === 'post' && <PostCard post={item.data} />}
                                                {item.type === 'clip' && (
                                                    <video controls muted playsInline className="h-full w-full object-cover rounded-lg">
                                                        <source src={item.data.src} type="video/mp4" />
                                                    </video>
                                                )}
                                                {item.type === 'hashflick' && (
                                                     <video controls poster={item.data.thumbnail} className="w-full h-auto aspect-video rounded-lg">
                                                        <source src={item.data.videoSrc} type="video/mp4" />
                                                    </video>
                                                )}
                                            </CardContent>
                                            <CardHeader className="pt-0">
                                                 <p className="text-xs text-muted-foreground">{formatDate(item.date)}</p>
                                            </CardHeader>
                                        </Card>
                                    ))}
                                </motion.div>
                            )}
                            </AnimatePresence>
                        </div>
                    )
                })}
              </motion.div>
            )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
