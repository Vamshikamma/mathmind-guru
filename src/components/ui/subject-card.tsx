
import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface SubjectCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  path: string;
  className?: string;
}

const SubjectCard = ({
  title,
  description,
  icon,
  iconBg,
  path,
  className,
}: SubjectCardProps) => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={cn(
        "group relative overflow-hidden rounded-2xl glass-card p-6 hover:shadow-xl transition-all duration-300 cursor-pointer",
        className
      )}
      onClick={() => navigate(path)}
    >
      <div className="flex flex-col h-full">
        <div 
          className={cn(
            "w-12 h-12 flex items-center justify-center rounded-xl mb-4",
            iconBg
          )}
        >
          {icon}
        </div>
        
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4">{description}</p>
        
        <div className="mt-auto flex items-center text-sm font-semibold text-primary">
          <span className="mr-1">Explore</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
      
      {/* Decorative gradient element */}
      <div className="absolute -bottom-2 -right-2 w-20 h-20 rounded-full bg-gradient-to-tr from-primary/10 to-secondary/10 blur-xl opacity-70 transition-opacity group-hover:opacity-100" />
    </motion.div>
  );
};

export default SubjectCard;
