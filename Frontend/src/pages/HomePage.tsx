import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Inbox, MessageCircle, Heart, HelpCircle, Bell } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNotifications } from '../hooks/useNotifications';
import { Avatar } from '../components/ui/Avatar';
import { Spinner } from '../components/ui/Spinner';
import type { Notification } from '../types';

export const HomePage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Single fetch instead of 3 simultaneous — notifications has everything we need for counts
  const { data: notifications, isLoading: nLoading } = useNotifications();

  const notifList = Array.isArray(notifications) ? notifications : [];
const unreadNotifs = notifList.filter((n: Notification) => !n.read).length;
const complimentsCount = notifList.filter((n: Notification) => n.type === 'NEW_COMPLIMENT').length;
const questionsCount = notifList.filter((n: Notification) => n.type === 'NEW_QUESTION').length;
const pendingCount = notifList.filter((n: Notification) => n.type === 'CONNECT_REQUEST').length;
const unreadMessages = notifList.filter((n: Notification) => n.type === 'NEW_MESSAGE').length;

  const stats = [
    { label: 'Requests', value: pendingCount, icon: Inbox, path: '/requests', color: '#994EA8' },
    { label: 'Messages', value: unreadMessages, icon: MessageCircle, path: '/messages', color: '#1A1A1A' },
    { label: 'Compliments', value: complimentsCount, icon: Heart, path: '/compliments', color: '#994EA8' },
    { label: 'Questions', value: questionsCount, icon: HelpCircle, path: '/questions', color: '#1A1A1A' },
  ];

  const recentNotifs = notifList.slice(0, 5);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="px-5 pt-14 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-sans text-[#1A1A1A]/40 mb-0.5">{greeting}</p>
          <h1 className="font-serif text-2xl text-[#1A1A1A]">
            {user?.profile?.displayName?.split(' ')[0] || 'Welcome'} ✦
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/notifications')}
            className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center relative"
          >
            <Bell size={18} className="text-[#1A1A1A]/60" />
            {unreadNotifs > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#994EA8] rounded-full text-white text-[9px] flex items-center justify-center font-bold">
                {unreadNotifs}
              </span>
            )}
          </button>
          <button onClick={() => navigate('/profile')}>
            <Avatar src={user?.profile?.avatar ?? undefined} name={user?.profile?.displayName} size="sm" />
          </button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {stats.map(({ label, value, icon: Icon, path, color }, i) => (
          <motion.button
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            onClick={() => navigate(path)}
            className="glass-card p-5 text-left group hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}12` }}>
                <Icon size={18} style={{ color }} />
              </div>
              {nLoading && <Spinner size={14} />}
            </div>
            <div className="font-serif text-3xl text-[#1A1A1A] mb-0.5">{value}</div>
            <div className="text-xs text-[#1A1A1A]/45 font-sans">{label}</div>
          </motion.button>
        ))}
      </div>

      {/* Recent activity */}
      <div>
        <h2 className="font-serif text-lg text-[#1A1A1A] mb-4">Recent activity</h2>
        {nLoading ? (
          <div className="flex justify-center py-8"><Spinner /></div>
        ) : recentNotifs.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-sm text-[#1A1A1A]/35 font-sans">Your activity will appear here</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentNotifs.map((n: Notification, i: number) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`flex items-center gap-3 p-4 rounded-2xl ${
                  n.read ? 'bg-black/3' : 'bg-[#994EA8]/6 border border-[#994EA8]/10'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-sans text-[#1A1A1A] leading-snug line-clamp-1">{n.message}</p>
                  <p className="text-xs text-[#1A1A1A]/35 mt-0.5 font-sans">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {!n.read && <div className="w-2 h-2 rounded-full bg-[#994EA8] flex-shrink-0" />}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};