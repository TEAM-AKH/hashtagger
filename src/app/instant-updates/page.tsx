
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bell, ShieldCheck, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

const updates = [
  {
    id: 1,
    icon: ShieldCheck,
    title: "Screenshot in 'Project Team'",
    description: "Alex Starr took a screenshot of your conversation.",
    time: "2m ago",
    color: "text-red-500"
  },
  {
    id: 2,
    icon: Eye,
    title: "Profile View",
    description: "Mia Wong viewed your profile.",
    time: "15m ago",
    color: "text-blue-500"
  },
  {
    id: 3,
    icon: Bell,
    title: "New Circle Invite",
    description: "You've been invited to join the 'Weekend Warriors' circle.",
    time: "1h ago",
    color: "text-primary"
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
  },
};

export default function InstantUpdatesPage() {
  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
                <Bell className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Instant Updates</CardTitle>
              <CardDescription>All your notifications and privacy alerts in one place.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
            <motion.div 
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
            {updates.map(update => (
              <motion.div 
                key={update.id} 
                variants={itemVariants}
                className="flex items-start gap-4 p-4 rounded-lg bg-muted/50"
              >
                  <div className={`mt-1 ${update.color}`}>
                    <update.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-grow">
                      <p className="font-semibold">{update.title}</p>
                      <p className="text-sm text-muted-foreground">{update.description}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">{update.time}</div>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}
