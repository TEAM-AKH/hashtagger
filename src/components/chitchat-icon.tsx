
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const SentIcon = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <motion.path 
        d="M22 12C19.3333 16 16 18 12 18C8 18 4.66667 16 2 12"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
    />
  </svg>
);

const DeliveredIcon = (props: any) => (
  <div {...props} className={cn("flex items-center", props.className)}>
    <motion.div initial={{ x: 5 }} animate={{ x: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
        <EyeOff className="h-full w-full" />
    </motion.div>
    <motion.div initial={{ x: -5 }} animate={{ x: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
        <EyeOff className="h-full w-full" />
    </motion.div>
  </div>
);

const SeenIcon = (props: any) => (
  <div {...props} className={cn("flex items-center", props.className)}>
     <motion.div 
        initial={{ scale: 0.5, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0, type: 'spring', stiffness: 300, damping: 15 }}
     >
        <Eye className="h-full w-full text-primary" />
     </motion.div>
     <motion.div 
        className="ml-[-0.5em]"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 15 }}
     >
        <Eye className="h-full w-full text-primary" />
    </motion.div>
  </div>
);

export function ChitChatIcon({ className, type = 'sent' }: { className?: string, type: 'sent' | 'delivered' | 'seen' }) {
    const iconMap = {
        sent: <SentIcon className={cn("h-6 w-6", className)} />,
        delivered: <DeliveredIcon className={cn("h-6 w-6", className)} />,
        seen: <SeenIcon className={cn("h-6 w-6", className)} />,
    };

    return iconMap[type] || null;
}
