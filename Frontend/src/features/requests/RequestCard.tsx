import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';
import { Tag } from '../../components/ui/Tag';
import type { PendingConnectRequest } from '../../types';

interface RequestCardProps {
  request: PendingConnectRequest;
  onAccept: () => void;
  onPass: () => void;
  onLater: () => void;
  isTop: boolean;
}

export const RequestCard: React.FC<RequestCardProps> = ({ request, onAccept, onPass, onLater, isTop }) => {
  const { sender, sharedInterests } = request;
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const opacity = useTransform(x, [-200, -80, 0, 80, 200], [0, 1, 1, 1, 0]);

  const passOpacity = useTransform(x, [-80, -20], [1, 0]);
  const acceptOpacity = useTransform(x, [20, 80], [0, 1]);
  const laterOpacity = useTransform(y, [-80, -20], [1, 0]);

  const handleDragEnd = (_: unknown, info: { offset: { x: number; y: number } }) => {
    if (info.offset.x < -80) onPass();
    else if (info.offset.x > 80) onAccept();
    else if (info.offset.y < -80) onLater();
  };

  if (!isTop) {
    return (
      <div
        className="absolute inset-0 glass-card"
        style={{ transform: 'scale(0.96) translateY(8px)', zIndex: 0, opacity: 0.7 }}
      />
    );
  }

  return (
    <motion.div
      style={{ x, y, rotate, opacity, zIndex: 10, touchAction: 'none' }}
      drag
      dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
      dragElastic={0.85}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: 'grabbing' }}
      className="absolute inset-0 glass-card cursor-grab overflow-hidden select-none"
    >
      {/* Indicators */}
      <motion.div style={{ opacity: passOpacity }}
        className="absolute top-6 right-6 z-20 border-2 border-red-400 rounded-xl px-3 py-1 rotate-12 pointer-events-none">
        <span className="text-red-400 font-bold text-sm font-sans tracking-wider">PASS</span>
      </motion.div>
      <motion.div style={{ opacity: acceptOpacity }}
        className="absolute top-6 left-6 z-20 border-2 border-[#994EA8] rounded-xl px-3 py-1 -rotate-12 pointer-events-none">
        <span className="text-[#994EA8] font-bold text-sm font-sans tracking-wider">ACCEPT</span>
      </motion.div>
      <motion.div style={{ opacity: laterOpacity }}
        className="absolute top-6 left-1/2 -translate-x-1/2 z-20 border-2 border-amber-400 rounded-xl px-3 py-1 pointer-events-none">
        <span className="text-amber-500 font-bold text-sm font-sans tracking-wider">LATER</span>
      </motion.div>

      {/* Profile image */}
      <div className="relative h-64 bg-gradient-to-br from-black/5 to-black/10 flex items-center justify-center overflow-hidden">
        {sender.avatar ? (
          <img src={sender.avatar} alt={sender.displayName} className="w-full h-full object-cover" />
        ) : (
          <Avatar name={sender.displayName} size="2xl" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FFFEFD] via-transparent to-transparent" />
      </div>

      {/* Info */}
      <div className="px-6 pb-6 overflow-y-auto" style={{ maxHeight: 'calc(100% - 256px)' }}>
        <div className="flex items-end gap-3 mb-1">
          <h2 className="font-serif text-2xl text-[#1A1A1A]">{sender.displayName}</h2>
          <span className="text-sm text-[#1A1A1A]/40 font-sans mb-0.5">@{sender.username}</span>
        </div>

        {sender.bio && (
          <p className="text-sm text-[#1A1A1A]/65 font-sans leading-relaxed mb-4">{sender.bio}</p>
        )}

        {sharedInterests && sharedInterests.length > 0 && (
          <div className="mb-4">
            <p className="text-[10px] font-sans uppercase tracking-wider text-[#994EA8]/70 mb-2">
              {sharedInterests.length} shared interest{sharedInterests.length > 1 ? 's' : ''}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {sharedInterests.map((i) => <Tag key={i} label={i} variant="purple" size="sm" />)}
            </div>
          </div>
        )}

        {sender.interests && sender.interests.length > 0 && (
          <div className="mb-4">
            <p className="text-[10px] font-sans uppercase tracking-wider text-[#1A1A1A]/35 mb-2">Interests</p>
            <div className="flex flex-wrap gap-1.5">
              {sender.interests
                .filter((i) => !sharedInterests?.includes(i))
                .map((i) => <Tag key={i} label={i} variant="default" size="sm" />)}
            </div>
          </div>
        )}

        {request.message && (
          <div className="bg-black/4 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare size={13} className="text-[#994EA8]" />
              <span className="text-xs font-sans text-[#994EA8] font-medium">Their message</span>
            </div>
            <p className="text-sm font-sans text-[#1A1A1A]/70 leading-relaxed italic">"{request.message}"</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};