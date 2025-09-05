
'use client';

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, MessageCircle, Send, Circle } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

type Post = {
    id: number;
    author: { name: string; avatar: string, hint: string };
    content: string;
    image?: { src: string, hint: string, width?: number, height?: number };
    likes: number;
    comments: number;
    circle?: string;
};

const circleColors: { [key: string]: string } = {
  "Best Friends": "bg-green-500",
  "Family": "bg-blue-500",
  "Organization": "bg-purple-500",
  "Clubs": "bg-yellow-500",
}

export default function PostCard({ post }: { post: Post }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src={post.author.avatar} alt={post.author.name} data-ai-hint={post.author.hint} width={40} height={40} />
          <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <div className="font-semibold">{post.author.name}</div>
        </div>
         {post.circle && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
          >
            <Badge variant="outline" className="flex items-center gap-2">
                <div className={cn("h-2 w-2 rounded-full", circleColors[post.circle] || "bg-gray-500")} />
                {post.circle}
            </Badge>
          </motion.div>
        )}
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <p className="text-foreground/90">{post.content}</p>
        {post.image && (
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border">
            <Image src={post.image.src} alt="Post image" fill style={{ objectFit: 'cover' }} data-ai-hint={post.image.hint} />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-1 sm:gap-2">
            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-accent-foreground">
                <Flame className="h-5 w-5" />
                <span>Lit ({post.likes})</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-accent-foreground">
                <MessageCircle className="h-5 w-5" />
                <span>Express ({post.comments})</span>
            </Button>
        </div>
        <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-accent-foreground">
            <Send className="h-5 w-5" />
            <span>Circulate</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
