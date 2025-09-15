
'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Bell, Bot, Search, Settings, Smile, Mic, Camera, Phone, Video, X, User, BellOff, ShieldAlert, History, Languages, MoreVertical, Timer } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const chats = [
  { id: 1, name: 'Alex Starr', lastMessage: 'Hey, are you free for a call?', time: '10:45 AM', online: true },
  { id: 2, name: 'Mia Wong', lastMessage: 'Haha, that\'s hilarious!', time: 'Yesterday', online: false },
  { id: 3, name: 'Project Team', lastMessage: 'Don\'t forget the meeting at 11.', time: '9:15 AM', online: false, unread: true },
  { id: 4, name: 'David Chen', lastMessage: 'Let\'s catch up next week.', time: 'Sunday', online: false },
  { id: 5, name: 'Sophia Loren', lastMessage: 'I saw that movie you recommended!', time: 'Friday', online: false },
  { id: 6, name: 'Emily Clark', lastMessage: 'Can you send me the files?', time: '8:30 AM', online: false },
  { id: 7, name: 'Chris Evans', lastMessage: 'Typing...', time: '7:55 AM', online: true, typing: true },
];

const messages: Record<number, { from: 'me' | 'other'; text: string; time: string }[]> = {
  1: [
    { from: 'other', text: 'Hey! Did you check the new post on The Hashtagger?', time: '10:40 AM' },
    { from: 'me', text: 'Yes, looks great! Let\'s catch up later today.', time: '10:42 AM' },
    { from: 'other', text: 'Hey, are you free for a call?', time: '10:45 AM' },
  ],
  2: [
    { from: 'other', text: 'Haha, that\'s hilarious!', time: 'Yesterday' },
  ],
  3: [
    { from: 'other', text: 'Don\'t forget the meeting at 11.', time: '9:15 AM' },
  ],
  4: [
    { from: 'other', text: 'Let\'s catch up next week.', time: 'Sunday' },
  ],
  5: [
    { from: 'other', text: 'I saw that movie you recommended!', time: 'Friday' },
  ],
  6: [
     { from: 'other', text: 'Can you send me the files?', time: '8:30 AM' },
  ],
  7: [
    { from: 'other', text: 'Typing...', time: '7:55 AM' },
  ]
};


export default function ChitChatPage() {
  const [selectedChatId, setSelectedChatId] = useState<number | null>(1);

  const selectedChat = chats.find(c => c.id === selectedChatId);
  const chatMessages = selectedChatId ? messages[selectedChatId as keyof typeof messages] || [] : [];

  const openChat = (id: number) => {
    setSelectedChatId(id);
  }

  const closeChat = () => {
    setSelectedChatId(null);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[calc(100vh-8rem)] relative">
      {/* Center: Chat Window or Logo */}
      <div className="md:col-span-8 flex flex-col items-center justify-center bg-card/50 border rounded-lg overflow-hidden">
        <AnimatePresence>
          {selectedChat ? (
             <motion.div 
              key={selectedChat.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full h-full flex flex-col bg-card"
            >
              <div className="flex items-center p-4 border-b">
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="flex items-center cursor-pointer group">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`https://picsum.photos/seed/${selectedChat.id}/100`} alt={selectedChat.name} />
                        <AvatarFallback>{selectedChat.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="ml-4">
                        <p className="font-semibold group-hover:text-primary">{selectedChat.name}</p>
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2">
                      <div className="flex flex-col gap-1">
                        <Button variant="ghost" className="justify-start px-2"><User className="mr-2" /> View Profile</Button>
                        <Button variant="ghost" className="justify-start px-2"><BellOff className="mr-2" /> Mute</Button>
                        <Button variant="ghost" className="justify-start px-2"><ShieldAlert className="mr-2" /> Block</Button>
                        <Button variant="ghost" className="justify-start px-2"><Timer className="mr-2" /> Disappearing Messages</Button>
                      </div>
                  </PopoverContent>
                </Popover>

                <div className="ml-auto flex items-center gap-2">
                  <Button variant="ghost" size="icon"><History className="h-5 w-5"/></Button>
                  <Button variant="ghost" size="icon"><Phone className="h-5 w-5"/></Button>
                  <Button variant="ghost" size="icon"><Video className="h-5 w-5"/></Button>
                  <Button variant="ghost" size="icon" onClick={closeChat}><X className="h-5 w-5" /></Button>
                </div>
              </div>
              <div className="flex-grow p-4 space-y-4 overflow-y-auto bg-muted/20">
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 rounded-lg max-w-xs lg:max-w-md ${msg.from === 'me' ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
                      <p>{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.from === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t flex items-center gap-2 bg-background">
                <Button variant="ghost" size="icon"><Smile className="h-5 w-5" /></Button>
                 <Button variant="ghost" size="icon" title="Dragomen"><Languages className="h-5 w-5" /></Button>
                <Input placeholder="Write a message..." className="flex-grow" />
                <Button variant="ghost" size="icon"><Mic className="h-5 w-5" /></Button>
                <Button variant="ghost" size="icon"><Camera className="h-5 w-5" /></Button>
                <Button size="sm">Send</Button>
              </div>
            </motion.div>
          ) : (
             <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Logo className="h-24 w-24 mb-4" />
                <p>Select a chat to start messaging</p>
             </div>
          )}
        </AnimatePresence>
      </div>

      {/* Right: Chat List */}
      <div className="md:col-span-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
           <h2 className="text-xl font-bold">Chats</h2>
           <div className="flex items-center gap-1">
             <Button variant="ghost" size="icon"><Bot className="h-5 w-5"/></Button>
             <Button variant="ghost" size="icon"><Settings className="h-5 w-5" /></Button>
             <Button variant="ghost" size="icon"><Bell className="h-5 w-5"/></Button>
           </div>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search chats" className="pl-8" />
        </div>
        <Card className="flex-grow overflow-hidden">
          <CardContent className="p-0 h-full overflow-y-auto">
            <div className="flex flex-col">
              {chats.map(chat => (
                <div 
                  key={chat.id} 
                  className={`flex items-center p-4 cursor-pointer hover:bg-muted/50 border-b ${selectedChatId === chat.id ? 'bg-muted' : ''}`}
                  onClick={() => openChat(chat.id)}
                >
                  <Avatar className="h-10 w-10 relative">
                    <AvatarImage src={`https://picsum.photos/seed/${chat.id}/100`} alt={chat.name} />
                    <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                    {chat.online && <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-card" />}
                  </Avatar>
                  <div className="ml-4 flex-grow">
                    <p className="font-semibold">{chat.name}</p>
                    <p className={`text-sm text-muted-foreground truncate ${chat.typing ? 'italic text-primary' : ''}`}>{chat.lastMessage}</p>
                  </div>
                  <div className="text-xs text-muted-foreground text-right">
                    <p>{chat.time}</p>
                    {chat.unread && <div className="h-2 w-2 bg-primary rounded-full ml-auto mt-1" />}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
