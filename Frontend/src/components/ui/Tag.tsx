import React from 'react';

interface TagProps {
  label: string;
  variant?: 'default' | 'purple' | 'outline';
  size?: 'sm' | 'md';
}

export const Tag: React.FC<TagProps> = ({ label, variant = 'default', size = 'md' }) => {
  const base = 'inline-flex items-center rounded-full font-medium font-sans';
  const sizes = { sm: 'px-2.5 py-0.5 text-xs', md: 'px-3.5 py-1 text-sm' };
  const variants = {
    default: 'bg-black/6 text-[#1A1A1A]',
    purple: 'bg-[#994EA8]/10 text-[#994EA8]',
    outline: 'border border-[#1A1A1A]/20 text-[#1A1A1A]',
  };
  return <span className={`${base} ${sizes[size]} ${variants[variant]}`}>{label}</span>;
};
