import React from 'react';

interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

const sizes = { xs: 28, sm: 36, md: 48, lg: 64, xl: 88, '2xl': 120 };

export const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'md', className = '' }) => {
  const px = sizes[size];
  const initials = name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || '?';
  const fontSize = px < 40 ? 11 : px < 60 ? 15 : px < 80 ? 20 : 28;

  if (src) return (
    <img
      src={src}
      alt={name}
      style={{ width: px, height: px, minWidth: px }}
      className={`rounded-full object-cover ${className}`}
    />
  );

  return (
    <div
      style={{ width: px, height: px, minWidth: px, fontSize }}
      className={`rounded-full bg-gradient-to-br from-[#994EA8] to-[#1A1A1A] flex items-center justify-center text-white font-medium ${className}`}
    >
      {initials}
    </div>
  );
};
