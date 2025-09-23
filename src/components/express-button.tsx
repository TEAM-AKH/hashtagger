
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  doc,
  deleteDoc,
  updateDoc
} from 'firebase/firestore';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ExpressIcon } from './express-icon';
import { Send, Trash2, Edit, X, Save, Smile } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';

type Comment = {
  id: string;
  text: string;
  createdAt: any;
  author: string;
};

const emojis = [
    'https://i.imgur.com/hV5wD41.png', // happy
    'https://i.imgur.com/Vb2a1aR.png', // love
    'https://i.imgur.com/GZ5sJ9E.png', // laughing
    'https://i.imgur.com/2sS9J9L.png', // surprised
    'https://i.imgur.com/s6v4j9I.png', // sad
    'https://i.imgur.com/qgS4hT1.png', // angry
    'https://i.imgur.com/V2z2fV2.png', // wink
    'https://i.imgur.com/zJp7ZJt.png', // cool
    'https://i.imgur.com/fJb2R4j.png', // thinking
    'https://i.imgur.com/7bA7gM3.png', // sleepy
];

const renderCommentText = (text: string) => {
    const parts = text.split(/(\[img=.*?\])/g);
    return parts.map((part, index) => {
        if (part.startsWith('[img=') && part.endsWith(']')) {
            const url = part.substring(5, part.length - 1);
            return <img key={index} src={url} alt="emoji" className="inline-block w-5 h-5 mx-0.5" />;
        }
        return part;
    });
};

const CommentArea = ({ docId, onCommentAdded }: { docId: string, onCommentAdded?: () => void }) => {
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState<Comment[]>([]);
    const [editingComment, setEditingComment] = useState<{id: string, text: string} | null>(null);

    useEffect(() => {
        if (!docId) return;
        const q = query(
            collection(db, 'express', docId, 'comments'),
            orderBy('createdAt', 'desc')
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setComments(
            snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                author: doc.data().author || 'Anonymous',
            })) as Comment[]
            );
        });
        return () => unsubscribe();
    }, [docId]);

    const handleEmojiClick = (emoji: string) => {
        setComment(prev => prev + `[img=${emoji}]`);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim() || !docId) return;

        try {
            await addDoc(collection(db, 'express', docId, 'comments'), {
                text: comment,
                author: 'User', // Replace with actual user later
                createdAt: serverTimestamp(),
            });
            setComment('');
            onCommentAdded?.();
        } catch (error) {
            console.error('Error adding comment: ', error);
        }
    };
    
    const handleUpdateComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingComment || !editingComment.text.trim()) return;
        const commentRef = doc(db, 'express', docId, 'comments', editingComment.id);
        try {
            await updateDoc(commentRef, { text: editingComment.text });
            setEditingComment(null);
        } catch (error) {
            console.error("Error updating comment: ", error);
        }
    }

    const handleDeleteComment = async (commentId: string) => {
        const commentRef = doc(db, 'express', docId, 'comments', commentId);
        try {
            await deleteDoc(commentRef);
        } catch (error) {
            console.error("Error deleting comment: ", error);
        }
    }

    return (
        <div className="flex-grow p-4 flex flex-col h-full">
            <h3 className="text-center font-bold mb-4">Expressions</h3>
            <ScrollArea className="flex-grow pr-4 h-64">
                <div className="space-y-4">
                {comments.length === 0 ? (
                    <p className="text-muted-foreground text-sm text-center py-8">
                    No expressions yet.
                    </p>
                ) : (
                    comments.map((c) => (
                    <div key={c.id} className="flex items-start gap-2.5 group">
                        <Avatar className="h-8 w-8">
                        <AvatarFallback>{c.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-grow rounded-md bg-muted/50 px-3 py-2">
                            {editingComment?.id === c.id ? (
                                <form onSubmit={handleUpdateComment} className="flex items-center gap-2">
                                    <Input 
                                        type="text"
                                        value={editingComment.text}
                                        onChange={(e) => setEditingComment({...editingComment, text: e.target.value})}
                                        className="h-8"
                                        autoFocus
                                    />
                                    <Button type="submit" size="icon" className="h-8 w-8"><Save /></Button>
                                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingComment(null)}><X /></Button>
                                </form>
                            ) : (
                                <p className="text-sm text-foreground flex flex-wrap items-center">{renderCommentText(c.text)}</p>
                            )}
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setEditingComment({id: c.id, text: c.text})}><Edit/></Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => handleDeleteComment(c.id)}><Trash2/></Button>
                        </div>
                    </div>
                    ))
                )}
                </div>
            </ScrollArea>

            <form
                onSubmit={handleSubmit}
                className="pt-4 border-t flex items-center gap-2"
            >
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon"><Smile className="h-5 w-5" /></Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2">
                        <div className="grid grid-cols-5 gap-2">
                            {emojis.map((emoji, index) => (
                                <motion.img 
                                    key={index} 
                                    src={emoji} 
                                    alt="emoji" 
                                    className="w-8 h-8 cursor-pointer" 
                                    whileHover={{ scale: 1.2 }}
                                    onClick={() => handleEmojiClick(emoji)}
                                />
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>
                <Input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write an expression..."
                    className="flex-grow"
                />
                <Button type="submit" size="icon" disabled={!comment.trim()}>
                    <Send />
                </Button>
            </form>
        </div>
    );
};


export const ExpressButton = ({ docId, mode = 'inline', onToggle, showBox }: { docId: string, mode?: 'inline' | 'inline-content' | 'overlay', onToggle?: () => void, showBox?: boolean }) => {
  const commentBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        // Check if the click is outside the comment box itself
        if (commentBoxRef.current && !commentBoxRef.current.contains(event.target as Node)) {
            // Check if the click is not on the toggle button (to prevent immediate closing)
            const toggleButton = (event.target as HTMLElement).closest('[data-express-button]');
            if (!toggleButton && showBox && onToggle) {
                onToggle();
            }
        }
    };

    if (showBox && mode === 'overlay') {
        document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showBox, onToggle, mode]);

  if (mode === 'inline-content') {
    return <CommentArea docId={docId} />;
  }

  if (mode === 'overlay') {
     return (
        <div ref={commentBoxRef}>
            <button
                data-express-button="true"
                onClick={onToggle}
                className="relative flex items-center justify-center w-12 h-12 text-sm font-medium text-white"
            >
                <ExpressIcon isStatic />
            </button>
            <AnimatePresence>
                {showBox && (
                    <motion.div
                         initial={{ y: "100%", opacity: 0 }}
                         animate={{ y: 0, opacity: 1 }}
                         exit={{ y: "100%", opacity: 0 }}
                         transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                         className="absolute bottom-0 left-0 right-0 h-1/2 bg-card/80 backdrop-blur-md rounded-t-lg shadow-lg flex flex-col z-20"
                         onClick={(e) => e.stopPropagation()}
                    >
                       <div className="w-12 h-1.5 bg-muted-foreground/50 rounded-full mx-auto my-2 cursor-grab" onMouseDown={onToggle}/>
                       <CommentArea docId={docId} onCommentAdded={() => {
                          // Potentially keep open, or close. For now, keep open.
                       }}/>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
     );
  }

  return (
    <motion.button
        onClick={onToggle}
        whileHover="hover"
        className="relative flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2 px-3 rounded-full"
    >
        <ExpressIcon isHovered={showBox} />
        <motion.span 
            className="font-semibold"
            initial={{ width: 0, opacity: 0, marginLeft: 0 }}
            variants={{
                hover: { width: "auto", opacity: 1, marginLeft: 4 }
            }}
            transition={{ duration: 0.3 }}
        >
            Express
        </motion.span>
    </motion.button>
  );
};
