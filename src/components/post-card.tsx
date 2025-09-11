
'use client';

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Bookmark, User, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type Comment = {
    author: string;
    text: string;
}

type Post = {
    id: number;
    author: { name: string; avatar: string, hint: string };
    content: string;
    image?: { src: string, hint: string };
    likes: number;
    comments: Comment[];
    circles?: string[];
    isSaved?: boolean;
};

const vibeVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1.2,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 10,
    },
  },
  exit: {
    opacity: 0,
    scale: 0,
    transition: { duration: 0.3 }
  },
};


export default function PostCard({ post }: { post: Post }) {
  const [isSaved, setIsSaved] = useState(post.isSaved || false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments);
  const [newComment, setNewComment] = useState("");
  const [showVibe, setShowVibe] = useState(false);

  const handleSave = () => {
    setIsSaved(!isSaved);
  };
  
  const handleVibe = () => {
    setShowVibe(true);
    setTimeout(() => setShowVibe(false), 1500);
  }

  const handleAddComment = () => {
      if (newComment.trim()) {
          setComments([...comments, { author: 'You', text: newComment.trim() }]);
          setNewComment('');
      }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={post.author.avatar} alt={post.author.name} data-ai-hint={post.author.hint} width={40} height={40} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="font-semibold">{post.author.name}</div>
        </div>
         <Button variant="ghost" size="icon" onClick={handleSave} className="text-muted-foreground hover:text-primary">
            <Bookmark className={cn("h-6 w-6", isSaved && "fill-primary text-primary")} />
            <span className="sr-only">Save</span>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4 pt-0 relative">
        <p className="text-foreground/90">{post.content}</p>
        <div className="relative">
             <AnimatePresence>
                {showVibe && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none overflow-hidden">
                         <motion.div 
                            initial={{ opacity: 0, x: -100, y: 20, rotate: -30 }} 
                            animate={{ opacity: 1, x: -20, y: 0, rotate: 15}} 
                            exit={{ opacity: 0, x: -100, y: 20, rotate: -30}}
                            transition={{ type: 'spring', stiffness: 200, damping: 12}}
                            className="text-6xl drop-shadow-lg"
                         >🥂</motion.div>
                         <motion.div 
                            initial={{ opacity: 0, x: 100, y: 20, rotate: 30 }}
                            animate={{ opacity: 1, x: 20, y: 0, rotate: -15}}
                            exit={{ opacity: 0, x: 100, y: 20, rotate: 30}}
                            transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
                            className="text-6xl drop-shadow-lg"
                        >🥂</motion.div>
                    </div>
                )}
              </AnimatePresence>
            {post.image && (
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border">
                <Image src={post.image.src} alt="Post image" fill style={{ objectFit: 'cover' }} data-ai-hint={post.image.hint} />
                 {post.circles && post.circles.length > 0 && (
                    <Popover>
                        <PopoverTrigger asChild>
                            <motion.div 
                                className="absolute bottom-3 left-3"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <Badge variant="secondary" className="bg-black/60 text-white border-white/40 backdrop-blur-sm cursor-pointer flex items-center gap-1.5 pl-2 pr-3 py-1">
                                    <Circle className="h-4 w-4" />
                                    <span>{post.circles.length}</span>
                                </Badge>
                            </motion.div>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto max-w-xs" side="top" align="start">
                            <div className="space-y-2">
                                <h4 className="font-medium leading-none">Shared in Circles</h4>
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {post.circles.map(circle => (
                                        <Badge key={circle} variant="outline">{circle}</Badge>
                                    ))}
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                )}
              </div>
            )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <div className="flex justify-between items-center w-full">
          <div /> 
          <div className="flex gap-1 sm:gap-2">
              <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-accent-foreground" onClick={handleVibe}>
                  <span>🥂</span>
                  <span>Vibe</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-accent-foreground" onClick={() => setShowComments(!showComments)}>
                  <MessageCircle className="h-5 w-5" />
                  <span>Express</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-accent-foreground">
                  <Send className="h-5 w-5" />
                  <span>Share</span>
              </Button>
          </div>
        </div>
        <AnimatePresence>
          {showComments && (
            <motion.div 
              className="w-full pt-4 space-y-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="space-y-3 text-sm max-h-40 overflow-y-auto pr-2">
                {comments.length === 0 && <p className="text-muted-foreground text-xs text-center py-2">No expressions yet. Be the first!</p>}
                {comments.map((comment, index) => (
                  <div key={index} className="flex gap-2">
                     <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">{comment.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="bg-muted/60 rounded-lg px-3 py-1.5 w-full">
                        <span className="font-semibold text-xs">{comment.author}</span>
                        <p className="text-muted-foreground text-sm">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 pt-2 border-t">
                <Input 
                  placeholder="Add an expression..." 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                  className="bg-muted/50 border-0"
                />
                <Button size="sm" onClick={handleAddComment} disabled={!newComment.trim()}>Post</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardFooter>
    </Card>
  );
}
