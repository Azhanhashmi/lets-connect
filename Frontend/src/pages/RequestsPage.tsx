import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Heart, Users } from 'lucide-react';
import { usePendingRequests, useRequestActions } from '../hooks/useRequests';
import { RequestCard } from '../features/requests/RequestCard';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';

export const RequestsPage: React.FC = () => {
  const { data: requests, isLoading, refetch } = usePendingRequests();
  const { accept, pass, later } = useRequestActions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitDir, setExitDir] = useState<'left' | 'right' | 'up' | null>(null);

  const list = Array.isArray(requests) ? requests : [];
  const current = list[currentIndex];
  const next = list[currentIndex + 1];

  const handleAction = (action: 'accept' | 'pass' | 'later', id: string, dir: 'left' | 'right' | 'up') => {
    setExitDir(dir);
    setTimeout(() => {
      if (action === 'accept') accept.mutate(id);
      else if (action === 'pass') pass.mutate(id);
      else later.mutate(id);
      setCurrentIndex((i) => i + 1);
      setExitDir(null);
    }, 300);
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner size={32} />
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen px-5 pt-14">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-serif text-2xl text-[#1A1A1A]">Requests</h1>
        {list.length > 0 && (
          <p className="text-xs text-[#1A1A1A]/40 font-sans mt-1">
            {list.length - currentIndex} pending · swipe to respond
          </p>
        )}
      </div>

      {!current ? (
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            icon={Users}
            title="You're all caught up"
            description="No more pending requests right now. Come back later!"
            action={{ label: 'Refresh', onClick: () => { setCurrentIndex(0); refetch(); } }}
          />
        </div>
      ) : (
        <>
          {/* Card stack */}
          <div className="relative flex-1 max-h-[560px] mb-6">
            {/* Background card */}
            {next && (
              <div className="absolute inset-0 glass-card" style={{ transform: 'scale(0.96) translateY(8px)', zIndex: 0, opacity: 0.7 }} />
            )}

            {/* Top card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={
                  exitDir === 'right'
                    ? { x: 400, opacity: 0, rotate: 20, transition: { duration: 0.3 } }
                    : exitDir === 'left'
                    ? { x: -400, opacity: 0, rotate: -20, transition: { duration: 0.3 } }
                    : { y: -400, opacity: 0, transition: { duration: 0.3 } }
                }
                className="absolute inset-0"
              >
                <RequestCard
                  request={current}
                  isTop
                  onAccept={() => handleAction('accept', current.id, 'right')}
                  onPass={() => handleAction('pass', current.id, 'left')}
                  onLater={() => handleAction('later', current.id, 'up')}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-5 pb-6">
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => handleAction('pass', current.id, 'left')}
              className="w-14 h-14 rounded-full bg-white border border-black/10 shadow-md flex items-center justify-center group hover:border-red-200 hover:bg-red-50 transition-colors"
            >
              <X size={22} className="text-[#1A1A1A]/50 group-hover:text-red-400 transition-colors" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => handleAction('later', current.id, 'up')}
              className="w-12 h-12 rounded-full bg-white border border-black/10 shadow-md flex items-center justify-center group hover:border-amber-200 hover:bg-amber-50 transition-colors"
            >
              <Clock size={18} className="text-[#1A1A1A]/50 group-hover:text-amber-500 transition-colors" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => handleAction('accept', current.id, 'right')}
              className="w-14 h-14 rounded-full bg-[#994EA8] shadow-lg shadow-[#994EA8]/30 flex items-center justify-center"
            >
              <Heart size={22} className="text-white" fill="white" />
            </motion.button>
          </div>

          {/* Swipe hints */}
          <p className="text-center text-[10px] text-[#1A1A1A]/25 font-sans pb-2">
            swipe left to pass · swipe right to accept · swipe up for later
          </p>
        </>
      )}
    </div>
  );
};