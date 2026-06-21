import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Inbox, Heart, MessageCircle, HelpCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useNotifications, useMarkRead } from '../hooks/useNotifications';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import type { Notification, NotificationType } from '../types';

const typeIcon: Record<NotificationType, LucideIcon> = {
  CONNECT_REQUEST: Inbox,
  REQUEST_ACCEPTED: Heart,
  NEW_MESSAGE: MessageCircle,
  NEW_COMPLIMENT: Heart,
  NEW_QUESTION: HelpCircle,
  QUESTION_ANSWERED: HelpCircle,
};

export const NotificationsPage: React.FC = () => {
  const { data: notifications, isLoading } = useNotifications();
  const markRead = useMarkRead();
  const list: Notification[] = Array.isArray(notifications) ? notifications : [];

  const handleClick = (id: string) => markRead.mutate(id);

  return (
    <div className="px-5 pt-14 pb-4">
      <h1 className="font-serif text-2xl text-[#1A1A1A] mb-6">Notifications</h1>

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : list.length === 0 ? (
        <EmptyState icon={Bell} title="Nothing yet" description="Notifications will appear when people interact with you." />
      ) : (
        <div className="space-y-1.5">
          {list.map((n, i) => {
            const Icon = typeIcon[n.type] || Bell;
            return (
              <motion.button
                key={n.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => !n.read && handleClick(n.id)}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-left transition-colors ${n.read ? 'bg-transparent hover:bg-black/3' : 'bg-[#994EA8]/6 border border-[#994EA8]/10'}`}
              >
                <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${n.read ? 'bg-black/5' : 'bg-[#994EA8]/15'}`}>
                  <Icon size={16} className={n.read ? 'text-[#1A1A1A]/40' : 'text-[#994EA8]'} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-sans leading-snug ${n.read ? 'text-[#1A1A1A]/60' : 'text-[#1A1A1A]'}`}>{n.message}</p>
                  <p className="text-xs text-[#1A1A1A]/30 mt-0.5 font-sans">
                    {new Date(n.createdAt).toLocaleDateString('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {!n.read && <div className="w-2 h-2 rounded-full bg-[#994EA8] flex-shrink-0" />}
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
};