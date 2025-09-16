
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const SentIcon = (props: any) => (
  <motion.div 
    {...props}
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
  >
    <Eye className="h-full w-full" />
  </motion.div>
);

const DeliveredIcon = (props: any) => (
  <div {...props} className={cn("flex items-center -space-x-2", props.className)}>
    <motion.div
        initial={{ x: 5, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
    >
        <EyeOff className="h-full w-full" />
    </motion.div>
    <motion.div
        initial={{ x: -5, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
        <EyeOff className="h-full w-full" />
    </motion.div>
  </div>
);

const SeenIcon = (props: any) => (
  <div {...props} className={cn("flex items-center -space-x-2", props.className)}>
     <motion.div 
        initial={{ scale: 0.5, opacity: 0, x: 5 }} 
        animate={{ scale: 1, opacity: 1, x: 0 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 15 }}
     >
        <Eye className="h-full w-full text-primary" />
     </motion.div>
     <motion.div 
        initial={{ scale: 0.5, opacity: 0, x: -5 }}
        animate={{ scale: 1, opacity: 1, x: 0 }}
        transition={{ delay: 0, type: 'spring', stiffness: 300, damping: 15 }}
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

    