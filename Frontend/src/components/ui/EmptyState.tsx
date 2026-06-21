import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, action }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-16 px-8 text-center"
  >
    <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center mb-5">
      <Icon size={28} className="text-[#1A1A1A]/30" />
    </div>
    <h3 className="font-serif text-xl text-[#1A1A1A] mb-2">{title}</h3>
    {description && <p className="text-sm text-[#1A1A1A]/50 font-sans max-w-xs">{description}</p>}
    {action && (
      <button onClick={action.onClick} className="btn-primary mt-6 text-sm px-6 py-3">
        {action.label}
      </button>
    )}
  </motion.div>
);
