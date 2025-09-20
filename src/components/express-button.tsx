
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
import { Send, Trash2, Edit, X, Save } from 'lucide-react';

type Comment = {
  id: string;
  text: string;
  createdAt: any;
  author: string;
};

export const ExpressButton = ({ docId, mode = 'inline' }: { docId: string, mode?: 'inline' | 'overlay' }) => {
  const [showBox, setShowBox] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [editingComment, setEditingComment] = useState<{id: string, text: string} | null>(null);

  const commentBoxRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (commentBoxRef.current && !commentBoxRef.current.contains(event.target as Node)) {
        setShowBox(false);
        setEditingComment(null);
      }
    };

    if (showBox) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showBox]);

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

  const renderCommentBox = () => (
    <div className="flex-grow p-4 flex flex-col h-full">
        <h3 className="text-center font-bold mb-4">Comments</h3>
        <ScrollArea className="flex-grow pr-4">
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
                             <p className="text-sm text-foreground">{c.text}</p>
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

  if (mode === 'overlay') {
     return (
        <div ref={commentBoxRef}>
            <button
                onClick={() => setShowBox(!showBox)}
                className="relative flex items-center justify-center w-9 h-9 text-sm font-medium text-white"
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
                         className="absolute bottom-0 left-0 right-0 h-1/2 bg-card/80 backdrop-blur-md rounded-t-2xl shadow-lg flex flex-col z-20"
                    >
                       <div className="w-12 h-1.5 bg-muted-foreground/50 rounded-full mx-auto my-2 cursor-grab" onClick={() => setShowBox(false)}/>
                       {renderCommentBox()}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
     )
  }

  return (
    <div className="relative" ref={commentBoxRef}>
        <motion.button
            onClick={() => setShowBox(!showBox)}
            className="relative flex items-center justify-center w-9 h-9 text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2 px-3 rounded-full"
            >
            <ExpressIcon isHovered={showBox}/>
        </motion.button>
        <AnimatePresence>
             {showBox && (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="absolute left-1/2 -translate-x-1/2 mt-2 w-80 sm:w-96 bg-card border rounded-lg shadow-lg z-10"
                >
                    <div className="h-80">
                         {renderCommentBox()}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
};
