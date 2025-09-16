
'use client';

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Bell, Bot, Search, Settings, Smile, Mic, Camera, Phone, Video, X, User, BellOff, ShieldAlert, History, Languages, MoreVertical } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChitChatIcon } from '@/components/chitchat-icon';
import { useMediaQuery } from '@/hooks/use-media-query';

const chats = [
  { id: 1, name: 'Alex Starr', lastMessage: 'Hey, are you free for a call?', time: '10:45 AM', online: true, status: 'seen' },
  { id: 2, name: 'Mia Wong', lastMessage: 'Haha, that\'s hilarious!', time: 'Yesterday', online: false, status: 'sent' },
  { id: 3, name: 'Project Team', lastMessage: 'Don\'t forget the meeting at 11.', time: '9:15 AM', online: true, status: 'delivered', unread: true },
  { id: 4, name: 'David Chen', lastMessage: 'Let\'s catch up next week.', time: 'Sunday', online: false, status: 'sent' },
  { id: 5, name: 'Sophia Loren', lastMessage: 'I saw that movie you recommended!', time: 'Friday', online: false, status: 'seen' },
  { id: 6, name: 'Emily Clark', lastMessage: 'Can you send me the files?', time: '8:30 AM', online: false, status: 'delivered' },
  { id: 7, name: 'Chris Evans', lastMessage: 'Typing...', time: '7:55 AM', online: true, typing: true, status: 'seen' },
];

const messages: Record<number, { from: 'me' | 'other'; text: string; time: string; status?: 'sent' | 'delivered' | 'seen' }[]> = {
  1: [
    { from: 'other', text: 'Hey! Did you check the new post on The Hashtagger?', time: '10:40 AM' },
    { from: 'me', text: 'Yes, looks great! Let\'s catch up later today.', time: '10:42 AM', status: 'seen' },
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

const ChatView = ({ chat, messages, onClose }: { chat: any, messages: any[], onClose: () => void }) => {
  return (
    <motion.div 
      key={chat.id}
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
                <AvatarImage src={`https://picsum.photos/seed/${chat.id}/100`} alt={chat.name} />
                <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-4">
                <p className="font-semibold group-hover:text-primary">{chat.name}</p>
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2">
              <div className="flex flex-col gap-1">
                <Button variant="ghost" className="justify-start px-2"><User className="mr-2" /> View Profile</Button>
                <Button variant="ghost" className="justify-start px-2"><BellOff className="mr-2" /> Mute</Button>
                <Button variant="ghost" className="justify-start px-2"><ShieldAlert className="mr-2" /> Block</Button>
              </div>
          </PopoverContent>
        </Popover>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon"><History className="h-5 w-5"/></Button>
          <Button variant="ghost" size="icon"><Phone className="h-5 w-5"/></Button>
          <Button variant="ghost" size="icon"><Video className="h-5 w-5"/></Button>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-5 w-5" /></Button>
        </div>
      </div>
      <div className="flex-grow p-4 space-y-4 overflow-y-auto bg-muted/20">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-lg max-w-xs lg:max-w-md ${msg.from === 'me' ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
              <p>{msg.text}</p>
              <div className={`flex items-center justify-end gap-1 text-xs mt-1 ${msg.from === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                <span>{msg.time}</span>
                {msg.from === 'me' && msg.status && (
                  <ChitChatIcon type={msg.status} className="h-4 w-4" />
                )}
              </div>
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
  );
};

const ChatList = ({ onChatSelect, selectedChatId }: { onChatSelect: (id: number) => void, selectedChatId: number | null }) => {
  return (
    <div className="flex flex-col gap-4 h-full">
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
                onClick={() => onChatSelect(chat.id)}
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
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{chat.time}</p>
                  <div className="flex items-center justify-end gap-1.5 mt-1">
                      {chat.unread && <div className="h-2 w-2 bg-primary rounded-full" />}
                      <ChitChatIcon type={chat.status as any} className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


export default function ChitChatPage() {
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const selectedChat = chats.find(c => c.id === selectedChatId);
  const chatMessages = selectedChatId ? messages[selectedChatId as keyof typeof messages] || [] : [];

  const openChat = (id: number) => {
    setSelectedChatId(id);
  }

  const closeChat = () => {
    setSelectedChatId(null);
  }

  const showChatList = isMobile ? selectedChatId === null : true;
  const showChatView = isMobile ? selectedChatId !== null : true;


  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[calc(100vh-8rem)] relative">
      <AnimatePresence>
        {isMobile && selectedChatId !== null && (
          <motion.div
            key="chat-view-mobile"
            className="md:col-span-12"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
             {selectedChat && <ChatView chat={selectedChat} messages={chatMessages} onClose={closeChat} />}
          </motion.div>
        )}
      </AnimatePresence>

      {!isMobile && (
        <>
          <div className="md:col-span-8 flex flex-col items-center justify-center bg-card/50 border rounded-lg overflow-hidden">
            <AnimatePresence mode="wait">
              {selectedChat ? (
                 <ChatView key="chat-view-desktop" chat={selectedChat} messages={chatMessages} onClose={closeChat} />
              ) : (
                 <motion.div 
                    key="placeholder"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center justify-center h-full text-muted-foreground"
                  >
                    <Logo className="h-24 w-24 mb-4" />
                    <p>Select a chat to start messaging</p>
                 </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="md:col-span-4">
             <ChatList onChatSelect={openChat} selectedChatId={selectedChatId} />
          </div>
        </>
      )}

      {isMobile && selectedChatId === null && (
         <div className="md:col-span-12">
            <ChatList onChatSelect={openChat} selectedChatId={selectedChatId} />
         </div>
      )}
    </div>
  );
}
