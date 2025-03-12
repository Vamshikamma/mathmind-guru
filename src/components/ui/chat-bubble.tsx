
import React from 'react';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatBubbleProps {
  content: string;
  isUser?: boolean;
  timestamp?: string;
  className?: string;
}

const ChatBubble = ({
  content,
  isUser = false,
  timestamp,
  className,
}: ChatBubbleProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-3 max-w-[85%]",
        isUser ? "ml-auto" : "mr-auto",
        className
      )}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-primary" />
        </div>
      )}
      
      <div
        className={cn(
          "p-3 rounded-2xl text-sm",
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-none"
            : "bg-muted rounded-tl-none"
        )}
      >
        <p>{content}</p>
        {timestamp && (
          <p className="text-[10px] opacity-70 mt-1 text-right">{timestamp}</p>
        )}
      </div>
      
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
    </motion.div>
  );
};

export default ChatBubble;
