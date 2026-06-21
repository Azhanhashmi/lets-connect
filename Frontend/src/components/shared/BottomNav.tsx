import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Inbox, MessageCircle, User, Settings } from 'lucide-react';
import { useNotificationStore } from '../../store/notificationStore';

const tabs = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/requests', icon: Inbox, label: 'Requests' },
  { path: '/messages', icon: MessageCircle, label: 'Messages' },
  { path: '/profile', icon: User, label: 'Profile' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const { unreadCount } = useNotificationStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#FFFEFD]/90 backdrop-blur-xl border-t border-black/6 safe-bottom">
      <div className="max-w-lg mx-auto flex items-center justify-around px-2 pt-2 pb-safe">
        {tabs.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path;
          const showBadge = path === '/requests' && unreadCount > 0;
          return (
            <NavLink key={path} to={path} className="relative flex flex-col items-center gap-0.5 px-4 py-2 group">
              <div className="relative">
                <Icon
                  size={22}
                  strokeWidth={active ? 2.2 : 1.8}
                  className={active ? 'text-[#994EA8]' : 'text-[#1A1A1A]/40 group-hover:text-[#1A1A1A]/70 transition-colors'}
                />
                {showBadge && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#994EA8] rounded-full flex items-center justify-center text-white text-[9px] font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium font-sans transition-colors ${active ? 'text-[#994EA8]' : 'text-[#1A1A1A]/40'}`}>
                {label}
              </span>
              {active && (
                <motion.div
                  layoutId="nav-dot"
                  className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-[#994EA8]"
                />
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
