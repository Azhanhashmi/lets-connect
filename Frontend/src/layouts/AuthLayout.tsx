import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

export const AuthLayout: React.FC = () => (
  <div className="min-h-screen bg-[#FFFEFD] flex items-center justify-center px-5">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-sm"
    >
      <Outlet />
    </motion.div>
  </div>
);
