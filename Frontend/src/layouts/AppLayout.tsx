import React from 'react';
import { Outlet } from 'react-router-dom';
import { BottomNav } from '../components/shared/BottomNav';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export const AppLayout: React.FC = () => {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-[#FFFEFD]">
      <div className="max-w-lg mx-auto min-h-screen pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
      <BottomNav />
    </div>
  );
};
