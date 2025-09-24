
'use client';

import PostCard from "@/components/post-card";
import { motion } from 'framer-motion';

const posts = [
    {
        id: 1,
        author: { name: "Alice", avatar: "https://picsum.photos/seed/1/100", hint: "woman smiling" },
        content: "Just enjoying a beautiful day out! The weather is perfect for a walk in the park. ☀️ #nature #sunny #happy",
        image: { src: "https://picsum.photos/seed/post1/600/375", hint: "landscape nature" },
        likes: 12,
        comments: [
            { id: 1, author: 'Bob', text: 'Looks amazing!'},
            { id: 2, author: 'Charlie', text: 'I wish I was there!'},
        ],
        circles: [{id: 1, name: "Best Friends"}],
        isSaved: false,
    },
    {
        id: 2,
        author: { name: "Bob", avatar: "https://picsum.photos/seed/2/100", hint: "man glasses" },
        content: "My new minimalist workspace setup is finally complete! Loving the clean and focused environment. What do you guys think? #wfh #setup #minimalism",
        image: { src: "https://picsum.photos/seed/post2/600/375", hint: "computer desk" },
        likes: 45,
        comments: [
             { id: 3, author: 'Alice', text: 'So clean! Where did you get that desk?'},
        ],
        circles: [{id: 2, name: "Organization"}, {id: 3, name: "Clubs"}],
        isSaved: true,
    },
    {
        id: 3,
        author: { name: "Charlie", avatar: "https://picsum.photos/seed/3/100", hint: "person nature" },
        content: "Exploring the hidden gems of the city. There's so much history and art in these streets! #citylife #urbanexplorer",
        image: { src: "https://picsum.photos/seed/post3/600/375", hint: "city street art" },
        likes: 23,
        comments: [],
        circles: [],
        isSaved: false,
    },
     {
        id: 4,
        author: { name: "David", avatar: "https://picsum.photos/seed/4/100", hint: "man portrait" },
        content: "Weekend baking project: success! Freshly baked sourdough bread. The smell is incredible. 🍞",
        image: { src: "https://picsum.photos/seed/post4/600/375", hint: "fresh bread" },
        likes: 78,
        comments: [],
        circles: [{id: 4, name: "Family"}],
        isSaved: false,
    },
    {
        id: 5,
        author: { name: "Eve", avatar: "https://picsum.photos/seed/5/100", hint: "woman nature" },
        content: "Morning hike views. Totally worth the early start! #hiking #mountains #sunrise",
        image: { src: "https://picsum.photos/seed/post5/600/375", hint: "mountain sunrise" },
        likes: 102,
        comments: [],
        circles: [],
        isSaved: true,
    },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};


export default function HomePage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
        <style jsx global>{`
            .fireworks {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 1px;
              height: 1px;
            }
            .checked-like-fx {
              position: absolute;
              width: 10px;
              height: 10px;
              border-radius: 50%;
              box-shadow: 0 0 hsl(var(--primary)), 0 0 hsl(var(--primary)), 0 0 hsl(var(--primary)), 0 0 hsl(var(--primary));
              animation:
                fireworks-bang 1s ease-out forwards,
                fireworks-gravity 1s ease-in forwards;
              top: 0;
              left: 0;
            }

            @keyframes fireworks-bang {
              to {
                box-shadow:
                  114px -107px hsl(var(--accent)),
                  197px -6px hsl(var(--primary)),
                  -167px -262px hsl(var(--accent)),
                  81px 42px hsl(var(--primary)),
                  -60px -183px hsl(var(--accent));
              }
            }
            @keyframes fireworks-gravity {
              to { transform: translateY(200px); opacity: 0; }
            }
        `}</style>
      <motion.h1 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-3xl font-bold tracking-tight">Home Feed</motion.h1>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {posts.map(post => (
          <motion.div key={post.id} variants={itemVariants}>
            <PostCard post={post} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
