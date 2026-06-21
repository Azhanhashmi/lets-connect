import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-[#FFFEFD]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="font-serif text-8xl text-[#1A1A1A]/10 mb-4 select-none">404</p>
        <h1 className="font-serif text-2xl text-[#1A1A1A] mb-3">Page not found</h1>
        <p className="text-sm text-[#1A1A1A]/45 font-sans mb-8 max-w-xs">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button onClick={() => navigate('/home')} className="btn-primary">
          <ArrowLeft size={16} /> Go home
        </button>
      </motion.div>
    </div>
  );
};
