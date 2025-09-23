
'use client';

import Image from "next/image";
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bookmark, Circle, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CirculateButton } from "./circulate-button";
import { VibeButton } from "./vibe-button";
import { ExpressButton } from "./express-button";

type Comment = {
    id: number;
    author: string;
    text: string;
};

type CircleInfo = {
    id: number;
    name: string;
}

type Post = {
    id: number;
    author: { name: string; avatar: string; hint: string };
    content: string;
    image?: { src: string; hint: string };
    likes: number;
    comments: Comment[];
    circles?: CircleInfo[];
    isSaved?: boolean;
};


export default function PostCard({ post }: { post: Post }) {
  const [isSaved, setIsSaved] = useState(post.isSaved || false);
  const [showComments, setShowComments] = useState(false);

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

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
                                </Badge>
                            </motion.div>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto max-w-xs p-2" side="top" align="start">
                            <div className="space-y-2">
                                <h4 className="font-medium leading-none px-2 py-1">Tagged Circles</h4>
                                <div className="flex flex-col gap-1">
                                    {post.circles.map(circle => (
                                        <Link key={circle.id} href="/circles">
                                            <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={`https://picsum.photos/seed/${circle.id}/100`} />
                                                    <AvatarFallback>{circle.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <span className="font-semibold text-sm">{circle.name}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                                <Button variant="link" size="sm" asChild className="w-full justify-center">
                                    <Link href="/circles">Go to Circles</Link>
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                )}
              </div>
            )}
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex justify-around items-center w-full">
            <VibeButton />
            <ExpressButton docId={post.id.toString()} mode="inline" onToggle={() => setShowComments(!showComments)} showBox={showComments} />
            <CirculateButton />
        </div>
      </CardFooter>
      <AnimatePresence>
        {showComments && (
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
            >
                <div className="border-t">
                    <ExpressButton docId={post.id.toString()} mode="inline-content" />
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
