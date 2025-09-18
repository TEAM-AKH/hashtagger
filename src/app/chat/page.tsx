
'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Bell, Bot, Settings, Smile, Mic, Camera, Phone, Video, X, User, BellOff, ShieldAlert, History, Languages, MoreVertical, ChevronLeft, ChevronRight, ThumbsUp, Heart, Laugh } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChitChatIcon } from '@/components/chitchat-icon';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';

const initialCircles = [
    { id: 1, name: "Project Team", image: "https://picsum.photos/seed/1/100", members: ["Alice", "Bob", "Charlie"], lastVisited: Date.now() - 10000, online: true, lastMessage: 'Hey, are you free for a call?', time: '10:45 AM', status: 'seen' },
    { id: 2, name: "Close Friends", image: "https://picsum.photos/seed/2/100", members: ["David", "Eve"], lastVisited: Date.now() - 20000, online: false, lastMessage: 'Haha, that\'s hilarious!', time: 'Yesterday', status: 'sent'},
    { id: 3, name: "Gaming Squad", image: "https://picsum.photos/seed/3/100", members: ["Frank", "Grace", "Heidi"], lastVisited: Date.now() - 30000, online: true, lastMessage: 'Don\'t forget the meeting at 11.', time: '9:15 AM', status: 'delivered', unread: true },
    { id: 4, name: "Family", image: "https://picsum.photos/seed/4/100", members: ["Ivan", "Judy"], lastVisited: Date.now() - 40000, online: false, lastMessage: 'Let\'s catch up next week.', time: 'Sunday', status: 'sent' },
    { id: 5, name: "Book Club", image: "https://picsum.photos/seed/5/100", members: ["Mallory", "Niaj"], lastVisited: Date.now() - 50000, online: false, lastMessage: 'I saw that movie you recommended!', time: 'Friday', status: 'seen' },
    { id: 6, name: "Hiking Group", image: "https://picsum.photos/seed/6/100", members: ["Oscar", "Peggy"], lastVisited: Date.now() - 60000, online: false, lastMessage: 'Can you send me the files?', time: '8:30 AM', status: 'delivered' },
    { id: 7, name: "Travel Buddies", image: "https://picsum.photos/seed/7/100", members: ["Quentin", "Rachel"], lastVisited: Date.now() - 70000, online: true, lastMessage: 'Typing...', time: '7:55 AM', typing: true, status: 'seen'},
    { id: 8, name: "Movie Buffs", image: "https://picsum.photos/seed/8/100", members: ["Steve", "Tina"], lastVisited: Date.now() - 80000, online: false, lastMessage: 'Sounds good!', time: 'Yesterday', status: 'seen'},
    { id: 9, name: "Coders", image: "https://picsum.photos/seed/9/100", members: ["Ursula", "Vince"], lastVisited: Date.now() - 90000, online: true, lastMessage: 'Just pushed the latest commit.', time: '11:00 AM', status: 'delivered' },
];

const initialMessages: Record<number, { from: 'me' | 'other'; text: string; time: string; status?: 'sent' | 'delivered' | 'seen', reactions?: string[] }[]> = {
  1: [
    { from: 'other', text: 'Hey! Did you check the new post on The Hashtagger?', time: '10:40 AM', reactions: ['👍'] },
    { from: 'me', text: 'Yes, looks great! Let\'s catch up later today.', time: '10:42 AM', status: 'seen' },
    { from: 'other', text: 'Hey, are you free for a call?', time: '10:45 AM' },
  ],
  2: [
    { from: 'other', text: 'Haha, that\'s hilarious!', time: 'Yesterday', reactions: ['😂'] },
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
  ],
   8: [
    { from: 'other', text: 'Sounds good!', time: 'Yesterday' },
  ],
  9: [
    { from: 'other', text: 'Just pushed the latest commit.', time: '11:00 AM' },
  ]
};

const ChatView = ({ chat, messages, onSendMessage, onClose, onAddReaction }: { chat: any, messages: any[], onSendMessage: (text: string) => void, onClose: () => void, onAddReaction: (msgIndex: number, reaction: string) => void }) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if(newMessage.trim()) {
        onSendMessage(newMessage.trim());
        setNewMessage('');
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        handleSend();
    }
  }

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
                <AvatarImage src={chat.image || `https://picsum.photos/seed/${chat.id}/100`} alt={chat.name} />
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
          <Button variant="ghost" size="icon"><Phone className="h-5 w-5"/></Button>
          <Button variant="ghost" size="icon"><Video className="h-5 w-5"/></Button>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-5 w-5" /></Button>
        </div>
      </div>
      <div className="flex-grow p-4 space-y-2 overflow-y-auto bg-muted/20">
        {messages.map((msg, index) => (
          <div key={index} className={`flex flex-col ${msg.from === 'me' ? 'items-end' : 'items-start'}`}>
            <ContextMenu>
                <ContextMenuTrigger>
                    <div className={`p-3 rounded-lg max-w-xs lg:max-w-md ${msg.from === 'me' ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
                        <p>{msg.text}</p>
                         <div className={`flex items-center justify-end gap-1 text-xs mt-1 ${msg.from === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                            <span>{msg.time}</span>
                            {msg.from === 'me' && msg.status && index === messages.length - 1 && (
                            <ChitChatIcon type={msg.status} className="h-4 w-4" />
                            )}
                        </div>
                    </div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                    <ContextMenuItem onClick={() => onAddReaction(index, '👍')}>React <ThumbsUp className="ml-auto"/></ContextMenuItem>
                    <ContextMenuItem onClick={() => onAddReaction(index, '❤️')}>React <Heart className="ml-auto"/></ContextMenuItem>
                    <ContextMenuItem onClick={() => onAddReaction(index, '😂')}>React <Laugh className="ml-auto"/></ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
             {msg.reactions && msg.reactions.length > 0 && (
                <div className="flex gap-1 mt-1 -mb-1 z-10">
                    {msg.reactions.map((reaction, rIndex) => (
                        <motion.div 
                            key={rIndex}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: rIndex * 0.1 }}
                            className="text-xs bg-muted border rounded-full px-2 py-0.5"
                        >
                            {reaction}
                        </motion.div>
                    ))}
                </div>
            )}
          </div>
        ))}
      </div>
      <div className="p-4 border-t flex items-center gap-2 bg-background">
        <Button variant="ghost" size="icon"><Smile className="h-5 w-5" /></Button>
         <Button variant="ghost" size="icon" title="Dragomen"><Languages className="h-5 w-5" /></Button>
        <Input 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a message..." 
          className="flex-grow" 
        />
        <Button variant="ghost" size="icon"><Mic className="h-5 w-5" /></Button>
        <Button variant="ghost" size="icon"><Camera className="h-5 w-5" /></Button>
        <Button size="sm" onClick={handleSend} disabled={!newMessage.trim()}>Send</Button>
      </div>
    </motion.div>
  );
};

const ChatList = ({ chats, onChatSelect, selectedChatId }: { chats: any[], onChatSelect: (id: number) => void, selectedChatId: number | null }) => {
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
        <div id="halo-search">
            <div id="search-wrapper">
                <input
                    placeholder="Search..."
                    type="text"
                    name="text"
                    className="search-field"
                />
            </div>
        </div>
      </div>
      <Card className="flex-grow overflow-hidden">
        <CardContent className="p-0 h-full overflow-y-auto">
          <div className="flex flex-col">
            {chats.map(chat => (
              <motion.div
                key={chat.id}
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className={`flex items-center p-4 cursor-pointer hover:bg-muted/50 border-b ${selectedChatId === chat.id ? 'bg-muted' : ''}`}
                onClick={() => onChatSelect(chat.id)}
              >
                <Avatar className="h-10 w-10 relative">
                  <AvatarImage src={chat.image || `https://picsum.photos/seed/${chat.id}/100`} alt={chat.name} />
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
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


export default function ChitChatPage() {
  const [chats, setChats] = useState(initialCircles);
  const [messages, setMessages] = useState(initialMessages);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [api, setApi] = useState<CarouselApi>()
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const onSelect = useCallback((api: CarouselApi) => {
    if (!api) {
      return
    }
    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())
  }, []);
  
  useEffect(() => {
    if (!api) {
      return
    }
 
    onSelect(api)
    api.on("reInit", onSelect)
    api.on("select", onSelect)

    return () => {
      api.off("reInit", onSelect)
      api.off("select", onSelect)
    }
  }, [api, onSelect])

  const sortedChats = useMemo(() => {
    return [...chats].sort((a, b) => b.lastVisited - a.lastVisited);
  }, [chats]);
  
  const selectedChat = chats.find(c => c.id === selectedChatId);
  const chatMessages = selectedChatId ? messages[selectedChatId as keyof typeof messages] || [] : [];

  const openChat = (id: number) => {
    setChats(prev => prev.map(c => c.id === id ? { ...c, lastVisited: Date.now() } : c));
    setSelectedChatId(id);
  }

  const closeChat = () => {
    setSelectedChatId(null);
  }

  const handleSendMessage = (text: string) => {
    if (!selectedChatId) return;

    const newMessage = {
        from: 'me' as const,
        text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sent' as const,
    };
    
    setMessages(prev => {
        const newMessagesForChat = [...(prev[selectedChatId] || []), newMessage];
        return { ...prev, [selectedChatId]: newMessagesForChat };
    });

     setChats(prev => prev.map(chat => 
        chat.id === selectedChatId 
            ? { ...chat, lastMessage: text, time: newMessage.time, status: 'sent' } 
            : chat
    ));
    
    // Simulate status change
    setTimeout(() => {
        setMessages(prev => {
            const currentChatMessages = prev[selectedChatId] || [];
            if (!currentChatMessages) return prev;
            const updatedMessages = currentChatMessages.map((msg, index) => 
                index === currentChatMessages.length - 1 ? { ...msg, status: 'delivered' } : msg
            );
            return { ...prev, [selectedChatId]: updatedMessages };
        });
        setChats(prev => prev.map(chat => 
            chat.id === selectedChatId ? { ...chat, status: 'delivered' } : chat
        ));
    }, 1500);

    setTimeout(() => {
        setMessages(prev => {
            const currentChatMessages = prev[selectedChatId] || [];
            if (!currentChatMessages) return prev;
            const updatedMessages = currentChatMessages.map((msg, index) => 
                index === currentChatMessages.length - 1 ? { ...msg, status: 'seen' } : msg
            );
            return { ...prev, [selectedChatId]: updatedMessages };
        });
        setChats(prev => prev.map(chat => 
            chat.id === selectedChatId ? { ...chat, status: 'seen' } : chat
        ));
    }, 3000);
  }

  const handleAddReaction = (msgIndex: number, reaction: string) => {
    if (!selectedChatId) return;

    setMessages(prev => {
        const currentChatMessages = prev[selectedChatId] || [];
        if (!currentChatMessages) return prev;

        const updatedMessages = currentChatMessages.map((msg, index) => {
            if (index === msgIndex) {
                const newReactions = msg.reactions ? [...msg.reactions] : [];
                if (!newReactions.includes(reaction)) {
                    newReactions.push(reaction);
                }
                return { ...msg, reactions: newReactions };
            }
            return msg;
        });

        return { ...prev, [selectedChatId]: updatedMessages };
    });
  }
  
  const ActiveChatRecents = () => (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="w-full px-12 py-3 border-b bg-card/50"
    >
        <Carousel setApi={setApi} opts={{ align: "start", dragFree: true }} className="w-full">
          <CarouselContent className="-ml-6">
            {sortedChats.map((chat, index) => (
              <CarouselItem key={index} className="basis-auto pl-6">
                <motion.div 
                  className="w-16 flex flex-col items-center gap-1.5 cursor-pointer group"
                  onClick={() => openChat(chat.id)}
                   whileHover={{ y: -5, scale: 1.1 }}
                   transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                    <Avatar className={`h-14 w-14 border-2 transition-all duration-300 ${selectedChatId === chat.id ? 'border-primary shadow-lg shadow-primary/30' : 'border-transparent group-hover:border-primary/50'}`}>
                        <AvatarImage src={chat.image || `https://picsum.photos/seed/${chat.id}/100`} alt={chat.name} />
                        <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <p className="text-xs truncate text-muted-foreground transition-colors group-hover:text-foreground">{chat.name.split(' ')[0]}</p>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {canScrollPrev && <CarouselPrevious className="bg-background/80 backdrop-blur-sm" />}
          {canScrollNext && <CarouselNext className="bg-background/80 backdrop-blur-sm"/>}
        </Carousel>
    </motion.div>
  );


  if (isMobile) {
    return (
       <div className="h-[calc(100vh-8rem)] relative overflow-hidden">
        <AnimatePresence>
            {selectedChatId !== null && selectedChat ? (
                <motion.div
                    key="chat-view-mobile"
                    className="absolute inset-0 bg-background"
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                    <ChatView chat={selectedChat} messages={chatMessages} onSendMessage={handleSendMessage} onClose={closeChat} onAddReaction={handleAddReaction} />
                </motion.div>
            ) : (
                 <motion.div
                    key="chat-list-mobile"
                    className="absolute inset-0"
                    initial={{ x: 0 }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                 >
                    <ChatList chats={sortedChats} onChatSelect={openChat} selectedChatId={selectedChatId} />
                 </motion.div>
            )}
        </AnimatePresence>
       </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-6 h-[calc(100vh-8rem)]">
        <div className="col-span-8">
            <AnimatePresence mode="wait">
                {selectedChat ? (
                    <motion.div 
                        key="chat-view"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-full flex flex-col items-center bg-card/50 border rounded-lg overflow-hidden"
                    >
                        <ActiveChatRecents />
                        <div className="w-full flex-grow">
                            <ChatView chat={selectedChat} messages={chatMessages} onSendMessage={handleSendMessage} onClose={closeChat} onAddReaction={handleAddReaction} />
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="no-chat-view"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-full flex flex-col items-center justify-center bg-card/50 border rounded-lg"
                    >
                        <Logo className="h-24 w-24 mb-4" />
                        <p className="text-muted-foreground">Select a chat to start messaging</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
        
        <div className="col-span-4">
            <AnimatePresence>
                <motion.div 
                    key="chat-list"
                    initial={{ opacity: 1, x: 0 }}
                    animate={{ opacity: selectedChat ? 0 : 1, x: selectedChat ? 50 : 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                >
                    <ChatList chats={sortedChats} onChatSelect={openChat} selectedChatId={selectedChatId} />
                </motion.div>
            </AnimatePresence>
        </div>
    </div>
  );
}
