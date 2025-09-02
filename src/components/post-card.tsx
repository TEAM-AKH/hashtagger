import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Send } from "lucide-react";

type Post = {
    id: number;
    author: { name: string; avatar: string, hint: string };
    content: string;
    image?: { src: string, hint: string, width?: number, height?: number };
    likes: number;
    comments: number;
};

export default function PostCard({ post }: { post: Post }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src={post.author.avatar} alt={post.author.name} data-ai-hint={post.author.hint} width={40} height={40} />
          <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="font-semibold">{post.author.name}</div>
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
                <Heart className="h-5 w-5" />
                <span>Hubb ({post.likes})</span>
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
