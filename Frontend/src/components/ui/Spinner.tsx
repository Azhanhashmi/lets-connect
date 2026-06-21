import React from 'react';

export const Spinner: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#994EA8' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="animate-spin">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" strokeOpacity="0.2" />
    <path d="M12 2a10 10 0 0 1 10 10" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const PageLoader: React.FC = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-[#FFFEFD]">
    <div className="flex flex-col items-center gap-4">
      <Spinner size={40} />
      <p className="text-sm text-[#1A1A1A]/40 font-sans">Loading...</p>
    </div>
  </div>
);
