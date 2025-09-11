
'use client';

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';

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
  hidden: { opacity: 0, scale: 0.5, rotate: -30 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1.2,
    rotate: i === 0 ? 15 : -15,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 15,
      delay: i * 0.1,
    },
  }),
  exit: {
    opacity: 0,
    scale: 0,
    transition: { duration: 0.4 }
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
                    <motion.div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none overflow-hidden">
                         <motion.div variants={vibeVariants} initial="hidden" animate="visible" exit="exit" custom={0} className="text-6xl drop-shadow-lg origin-bottom-left" style={{ x: '-50%' }}>🥂</motion.div>
                         <motion.div variants={vibeVariants} initial="hidden" animate="visible" exit="exit" custom={1} className="text-6xl drop-shadow-lg origin-bottom-right" style={{ x: '50%' }}>🥂</motion.div>
                    </motion.div>
                )}
              </AnimatePresence>
            {post.image && (
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border">
                <Image src={post.image.src} alt="Post image" fill style={{ objectFit: 'cover' }} data-ai-hint={post.image.hint} />
                {post.circles && post.circles.length > 0 && (
                    <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
                        {post.circles.map(circle => (
                            <Badge key={circle} variant="secondary" className="bg-black/60 text-white border-white/40 backdrop-blur-sm">
                                {circle}
                            </Badge>
                        ))}
                    </div>
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
              <div className="space-y-2 text-sm max-h-32 overflow-y-auto pr-2">
                {comments.map((comment, index) => (
                  <div key={index}>
                    <span className="font-semibold">{comment.author}</span>
                    <span className="ml-2 text-muted-foreground">{comment.text}</span>
                  </div>
                ))}
                {comments.length === 0 && <p className="text-muted-foreground text-xs">No expressions yet.</p>}
              </div>
              <div className="flex items-center gap-2 pt-2 border-t">
                <Input 
                  placeholder="Add an expression..." 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <Button size="sm" onClick={handleAddComment}>Post</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardFooter>
    </Card>
  );
}
