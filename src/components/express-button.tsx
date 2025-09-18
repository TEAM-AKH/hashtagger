
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ExpressIcon } from './express-icon';

type Comment = {
  id: string;
  text: string;
  createdAt: any;
  author: string;
};

export const ExpressButton = ({ docId }: { docId: string }) => {
  const [showBox, setShowBox] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);

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

  return (
    <div className="relative">
      <button
        onClick={() => setShowBox(!showBox)}
        className="relative flex items-center justify-center p-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors rounded-full"
      >
        <ExpressIcon />
      </button>

      <AnimatePresence>
        {showBox && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute bottom-full mb-2 w-80 min-h-[20rem] max-h-96 bg-card border rounded-xl shadow-lg flex flex-col z-20 left-1/2 -translate-x-1/2"
          >
            <div className="p-4 border-b">
              <h4 className="font-semibold text-center">Expressions</h4>
            </div>

            <ScrollArea className="flex-grow p-4">
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-8">
                    No expressions yet.
                  </p>
                ) : (
                  comments.map((c) => (
                    <div key={c.id} className="flex items-start gap-2.5">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{c.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-grow rounded-md bg-muted/50 px-3 py-2">
                        <p className="text-sm text-foreground">{c.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            <form
              onSubmit={handleSubmit}
              className="p-4 border-t flex items-center gap-2"
            >
              <Input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write an expression..."
                className="flex-grow"
              />
              <Button type="submit" size="sm" disabled={!comment.trim()}>
                Post
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
