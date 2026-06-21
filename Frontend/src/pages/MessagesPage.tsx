import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useConversations } from '../hooks/useMessages';
import { Avatar } from '../components/ui/Avatar';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import type { ConversationPreview } from '../types';

export const MessagesPage: React.FC = () => {
  const { data: conversations, isLoading } = useConversations();
  const navigate = useNavigate();
  const list: ConversationPreview[] = Array.isArray(conversations) ? conversations : [];

  return (
    <div className="px-5 pt-14 pb-4">
      <h1 className="font-serif text-2xl text-[#1A1A1A] mb-6">Messages</h1>

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : list.length === 0 ? (
        <EmptyState icon={MessageCircle} title="No conversations yet" description="Accept a connection request to start messaging." />
      ) : (
        <div className="space-y-1">
          {list.map((conv, i) => {
            const isUnread = !!conv.lastMessage && !conv.lastMessage.isOwn && !conv.lastMessage.read;
            return (
              <motion.button
                key={conv.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => navigate(`/messages/${conv.id}`)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-black/4 transition-colors text-left group"
              >
                <div className="relative">
                  <Avatar src={conv.participant.avatar ?? undefined} name={conv.participant.displayName} size="md" />
                  {isUnread && (
                    <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#994EA8] rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={`text-sm font-sans ${isUnread ? 'font-semibold text-[#1A1A1A]' : 'font-medium text-[#1A1A1A]/80'}`}>
                      {conv.participant.displayName}
                    </span>
                    <span className="text-[11px] text-[#1A1A1A]/30 font-sans flex-shrink-0">
                      {conv.lastMessage ? new Date(conv.lastMessage.createdAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                  {conv.lastMessage && (
                    <p className={`text-xs font-sans truncate ${isUnread ? 'text-[#1A1A1A]/70' : 'text-[#1A1A1A]/40'}`}>
                      {conv.lastMessage.isOwn ? 'You: ' : ''}{conv.lastMessage.content}
                    </p>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
};