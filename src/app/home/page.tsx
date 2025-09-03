
'use client';

import PostCard from "@/components/post-card";
import { motion } from 'framer-motion';

const posts = [
    {
        id: 1,
        author: { name: "Alice", avatar: "https://picsum.photos/seed/1/100", hint: "woman smiling" },
        content: "Just enjoying a beautiful day out! The weather is perfect for a walk in the park. ☀️ #nature #sunny #happy",
        image: { src: "https://picsum.photos/600/375?random=1", hint: "landscape nature" },
        likes: 12,
        comments: 3,
        circle: "Best Friends",
    },
    {
        id: 2,
        author: { name: "Bob", avatar: "https://picsum.photos/seed/2/100", hint: "man glasses" },
        content: "My new minimalist workspace setup is finally complete! Loving the clean and focused environment. What do you guys think? #wfh #setup #minimalism",
        image: { src: "https://picsum.photos/600/375?random=2", hint: "computer desk" },
        likes: 45,
        comments: 12,
        circle: "Organization",
    },
    {
        id: 3,
        author: { name: "Charlie", avatar: "https://picsum.photos/seed/3/100", hint: "person nature" },
        content: "Exploring the hidden gems of the city. There's so much history and art in these streets! #citylife #urbanexplorer",
        likes: 23,
        comments: 5,
        circle: "Clubs",
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
