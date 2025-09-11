
'use client';

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Send, Bookmark, Circle, Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";

type Post = {
    id: number;
    author: { name: string; avatar: string, hint: string };
    content: string;
    image?: { src: string, hint: string, width?: number, height?: number };
    likes: number;
    comments: number;
    circle?: string;
    isSaved?: boolean;
};

const circleColors: { [key: string]: string } = {
  "Best Friends": "bg-green-500",
  "Family": "bg-blue-500",
  "Organization": "bg-purple-500",
  "Clubs": "bg-yellow-500",
  "Gaming Squad": "bg-pink-500",
}

export default function PostCard({ post, availableCircles }: { post: Post, availableCircles: string[] }) {
  const [isSaved, setIsSaved] = useState(post.isSaved || false);
  const [sharedCircle, setSharedCircle] = useState(post.circle);

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
        {post.image && (
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border">
            <Image src={post.image.src} alt="Post image" fill style={{ objectFit: 'cover' }} data-ai-hint={post.image.hint} />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
         <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-accent-foreground">
                <Circle className="h-5 w-5" />
                <span className="font-semibold">{sharedCircle}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2">
                <div className="flex flex-col gap-1">
                    <p className="font-medium text-sm px-2 py-1">Share to Circle</p>
                    {availableCircles.map(circle => (
                        <Button 
                            key={circle} 
                            variant="ghost" 
                            className="w-full justify-start gap-2"
                            onClick={() => setSharedCircle(circle)}
                        >
                           <div className={cn("h-2 w-2 rounded-full", circleColors[circle] || "bg-gray-500")} />
                           <span>{circle}</span>
                           {sharedCircle === circle && <Check className="h-4 w-4 ml-auto text-primary"/>}
                        </Button>
                    ))}
                </div>
            </PopoverContent>
          </Popover>
        <div className="flex gap-1 sm:gap-2">
            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-accent-foreground">
                <span>🥂</span>
                <span>Vibe</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-accent-foreground">
                <MessageCircle className="h-5 w-5" />
                <span>Express</span>
            </Button>
             <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-accent-foreground">
                <Send className="h-5 w-5" />
                <span>Share</span>
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
