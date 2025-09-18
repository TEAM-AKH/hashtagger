
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
import { CirculateButton } from "./circulate-button";
import { VibeButton } from "./vibe-button";

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
  const [comments, setComments] = useState<Comment[]>(post.comments);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

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
          <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => setShowComments(!showComments)}>
              <MessageCircle className="mr-2" />
              {comments.length} Expressions
          </Button>
          <div className="flex gap-1 sm:gap-2">
              <VibeButton />
              <CirculateButton />
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
