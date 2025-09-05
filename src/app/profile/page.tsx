

import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PostCard from '@/components/post-card';
import { Badge } from '@/components/ui/badge';
import { UserCircle, LogOut, PlusCircle, Gem, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const userPosts = [
    {
        id: 4,
        author: { name: "Your Name", avatar: "https://picsum.photos/seed/user/100", hint: "person selfie" },
        content: "Just set up my Hastagger profile! Excited to connect with everyone here. #newbeginnings #social",
        likes: 5,
        comments: 2,
        circle: "Family",
    },
    {
        id: 5,
        author: { name: "Your Name", avatar: "https://picsum.photos/seed/user/100", hint: "person selfie" },
        content: "Throwback to that amazing trip to the mountains! Can't wait for the next adventure. 🏔️",
        image: { src: "https://picsum.photos/600/375?random=3", hint: "travel landscape" },
        likes: 31,
        comments: 7,
        circle: "Best Friends",
    },
];

const userCircles = [
  { id: 1, name: "Close Friends", members: 6, image: "https://picsum.photos/400/300?random=4" },
  { id: 2, name: "Work Colleagues", members: 12, image: "https://picsum.photos/400/300?random=5" },
  { id: 3, name: "Gaming Squad", members: 8, image: "https://picsum.photos/400/300?random=6" },
  { id: 4, name: "Book Club", members: 15, image: "https://picsum.photos/400/300?random=7" },
]

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="relative h-48 w-full bg-muted">
            <Image src="https://picsum.photos/1200/400" alt="Profile banner" fill style={{ objectFit: 'cover' }} data-ai-hint="abstract pattern"/>
        </div>
        <CardContent className="relative -mt-16 flex flex-col items-center p-6 text-center sm:flex-row sm:items-start sm:text-left">
            <Avatar className="h-32 w-32 border-4 border-card shadow-md">
                <AvatarImage src="https://picsum.photos/seed/user/128" alt="User" data-ai-hint="person selfie"/>
                 <AvatarFallback>
                    <Gem className="h-12 w-12 text-muted-foreground" />
                </AvatarFallback>
            </Avatar>
            <div className='sm:ml-6 mt-4 sm:mt-16 w-full'>
              <div className="sm:flex items-baseline justify-between">
                <div>
                  <h1 className="text-3xl font-bold">Your Name</h1>
                  <p className="text-muted-foreground">@yourusername</p>
                </div>
                <div className="mt-2 sm:mt-0 flex items-center justify-center sm:justify-start gap-2">
                    <Gem className="h-4 w-4 text-accent-foreground/80" />
                    <span className="font-medium text-muted-foreground">Zodiac: Scorpio</span>
                </div>
              </div>
              <p className="mt-4 max-w-xl text-center sm:text-left mx-auto sm:mx-0">
                  Lover of coffee, code, and cats. Exploring the world one step at a time. Let's connect and share stories!
              </p>
            </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="circles">Circles</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-6 space-y-6 max-w-2xl mx-auto">
          {userPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </TabsContent>

        <TabsContent value="circles" className="mt-6">
           <div className="mb-4 flex justify-end">
               <Button><PlusCircle className="mr-2"/>Create Circle</Button>
           </div>
           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {userCircles.map(circle => (
              <Card key={circle.id} className="group relative overflow-hidden aspect-[4/3]">
                <Image src={circle.image} alt={circle.name} fill style={{objectFit: 'cover'}} className="transition-transform duration-300 group-hover:scale-105" data-ai-hint="group people"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <CardHeader className="relative text-white p-4">
                  <CardTitle className="text-lg">{circle.name}</CardTitle>
                  <Badge variant="secondary" className="w-fit">{circle.members} members</Badge>
                </CardHeader>
              </Card>
            ))}
           </div>
        </TabsContent>

        <TabsContent value="details" className="mt-6 max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>More about You</CardTitle>
                    <CardDescription>Your personal information and interests.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className='space-y-2 text-sm text-muted-foreground'>
                    <li><strong>Joined:</strong> January 2024</li>
                    <li><strong>Location:</strong> San Francisco, CA</li>
                    <li><strong>Website:</strong> <a href="#" className="text-primary hover:underline">your.website.com</a></li>
                    <li><strong>Interests:</strong> #tech #travel #photography #foodie</li>
                  </ul>
                </CardContent>
            </Card>
        </TabsContent>
         <TabsContent value="settings" className="mt-6 max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your account preferences.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full mt-6">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
