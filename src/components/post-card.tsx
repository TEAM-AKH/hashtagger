
'use client';

import Image from "next/image";
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Bookmark, Circle, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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

const ShareButtonWithTooltip = () => {
    return (
        <div className="relative inline-block group">
            {/* Main Share Button */}
            <div className="flex items-center justify-center bg-gradient-to-br from-primary to-accent text-primary-foreground py-2 px-5 rounded-full cursor-pointer">
                <span className="text-sm font-medium mr-2">Share</span>
                <svg
                    className="fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width={20}
                    height={20}
                >
                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z" />
                </svg>
            </div>

            {/* Tooltip Popup */}
            <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 origin-bottom-center bg-card border rounded-lg shadow-lg p-4 invisible group-hover:visible">
                <div className="flex gap-3">
                    {/* WhatsApp */}
                    <a href="#" className="social-icon h-10 w-10 rounded-full bg-muted flex items-center justify-center transition-transform duration-300 hover:scale-110 hover:text-white hover:bg-[#25d366]">
                        <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width={20} height={20}><path d="M380.9 97.1C339-5.8 208.1-31.6 115.3 26.3 51.9 66.7 19.1 139.8 30.3 213.5l-26.1 95.4c-2.2 8.1 2.3 16.6 10.3 18.7l95.2 26c71.2 48.5 169.6 51.2 241.4 5.9 93.2-57.8 117.4-187.2 52.1-262.4zm-80.9 212.9c-10.1 10.1-26.4 10.9-38.2 1.8-10.6-8-22.6-15.1-35.8-20.7-8.2-3.6-14.1-6.3-21.2-2.6-6.6 3.4-15.2 18.3-20.7 25.1-5.6 6.8-11.5 7.1-20.3 4-52.3-19-86.6-63.5-90.5-117.5-.4-6.3 4.1-11.9 10.5-13.1l23.7-4.4c6.3-1.2 13.1.5 17.7 5l14.7 15.3c4.4 4.5 5.9 11.3 3.7 17.3l-6.7 18.6c-.6 1.7-.1 3.5 1.3 4.8l0 0c19.2 19.1 41.7 29.9 68.6 32.4 1.7.2 3.3-.7 3.9-2.2l7.4-17.6c2.2-5.3 7.4-8.7 13.1-8.7 12.5 0 24.6 5.3 34.5 14.9 10.2 9.9 10.9 26.2 1.7 36.4z" /></svg>
                    </a>
                    {/* Instagram */}
                    <a href="#" className="social-icon h-10 w-10 rounded-full bg-muted flex items-center justify-center transition-transform duration-300 hover:scale-110 hover:text-white" style={{background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fd5949 45%, #d6249f 60%, #285aeb 90%)'}}>
                       <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width={20} height={20}><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9 114.9-51.3 114.9-114.9S287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7-74.7zm146.4-194.3c0 14.9-12 26.9-26.9 26.9s-26.9-12-26.9-26.9 12-26.9 26.9-26.9 26.9 12 26.9 26.9zM398.8 80c-22.2-22.2-52.1-34.4-83.2-34.4H132.4c-31.1 0-61 12.2-83.2 34.4C27 102.2 14.8 132.1 14.8 163.2v183.2c0 31.1 12.2 61 34.4 83.2 22.2 22.2 52.1 34.4 83.2 34.4h183.2c31.1 0 61-12.2 83.2-34.4 22.2-22.2 34.4-52.1 34.4-83.2V163.2c0-31.1-12.2-61-34.4-83.2zM224.1 338c-63.6 0-114.9-51.3-114.9-114.9s51.3-114.9 114.9-114.9 114.9 51.3 114.9 114.9S287.7 338 224.1 338z" /></svg>
                    </a>
                    {/* Snapchat */}
                    <a href="#" className="social-icon h-10 w-10 rounded-full bg-muted flex items-center justify-center transition-transform duration-300 hover:scale-110 text-black hover:text-black hover:bg-[#fffc00]">
                       <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={20} height={20}><path d="M256 32c-77.4 0-140.3 62.9-140.3 140.3 0 10.7.6 21.2 1.8 31.6-11.3 4.9-20.3 15.8-20.3 28.7 0 11.3 5.6 21.4 14.6 27.5-3.2 33.6-16.5 65.1-38.4 89.6-5.8 6.4-7.2 15.6-3.5 23.3s11.5 12.6 20 12.6h82.8c0 22.5 18.3 40.8 40.8 40.8h128c22.5 0 40.8-18.3 40.8-40.8h82.8c8.5 0 16.5-4.9 20-12.6s2.2-16.9-3.5-23.3c-21.9-24.6-35.2-56.1-38.4-89.6 9-6.1 14.6-16.2 14.6-27.5 0-12.9-9-23.8-20.3-28.7 1.2-10.4 1.8-20.9 1.8-31.6C396.3 94.9 333.4 32 256 32z" /></svg>
                    </a>
                </div>
            </div>
        </div>
    );
};


export default function PostCard({ post }: { post: Post }) {
  const [isSaved, setIsSaved] = useState(post.isSaved || false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>(post.comments);
  const [newComment, setNewComment] = useState("");
  const [showVibe, setShowVibe] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  const handleSave = () => {
    setIsSaved(!isSaved);
  };
  
  const handleVibe = () => {
    setShowVibe(true);
    setTimeout(() => setShowVibe(false), 1500);
  }

  const handleAddComment = () => {
      if (newComment.trim()) {
          const newCommentObj = { 
              id: Date.now(), 
              author: 'You', 
              text: newComment.trim() 
          };
          setComments([...comments, newCommentObj]);
          setNewComment('');
      }
  };

  const handleEditComment = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditingText(comment.text);
  };

  const handleUpdateComment = () => {
    if (editingCommentId === null) return;
    setComments(comments.map(c => 
        c.id === editingCommentId ? { ...c, text: editingText } : c
    ));
    setEditingCommentId(null);
    setEditingText("");
  };

  const handleDeleteComment = (commentId: number) => {
    setComments(comments.filter(c => c.id !== commentId));
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
      <CardFooter className="flex flex-col items-start">
        <div className="flex justify-between items-center w-full">
          <div /> 
          <div className="flex gap-1 sm:gap-2">
              <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-accent-foreground" onClick={handleVibe}>
                  <span>🥂</span>
                  <span>Vibe</span>
              </Button>
              <ShareButtonWithTooltip />
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
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-2 items-start group">
                     <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">{comment.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="bg-muted/60 rounded-lg px-3 py-1.5 w-full">
                        {editingCommentId === comment.id ? (
                            <div className="flex items-center gap-2">
                                <Input 
                                    value={editingText}
                                    onChange={(e) => setEditingText(e.target.value)}
                                    className="h-8"
                                    onKeyDown={(e) => e.key === 'Enter' && handleUpdateComment()}
                                />
                                <Button size="sm" onClick={handleUpdateComment}>Save</Button>
                                <Button size="sm" variant="ghost" onClick={() => setEditingCommentId(null)}>Cancel</Button>
                            </div>
                        ) : (
                            <>
                                <span className="font-semibold text-xs">{comment.author}</span>
                                <p className="text-muted-foreground text-sm">{comment.text}</p>
                            </>
                        )}
                    </div>
                     {comment.author === 'You' && editingCommentId !== comment.id && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => handleEditComment(comment)}>
                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteComment(comment.id)} className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
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
