import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Edit3, Users, Bell, Shield, ChevronRight, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useSocketStore } from '../store/socketStore';
import { Avatar } from '../components/ui/Avatar';

export const SettingsPage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { disconnect } = useSocketStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    disconnect();
    logout();
    navigate('/');
  };

  const sections = [
    {
      title: 'Account',
      items: [
        { icon: Edit3, label: 'Edit profile', onClick: () => navigate('/edit-profile') },
        { icon: User, label: 'View my profile', onClick: () => navigate('/profile') },
        { icon: Users, label: 'My connections', onClick: () => navigate('/connections') },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: Bell, label: 'Notifications', onClick: () => navigate('/notifications') },
        { icon: Shield, label: 'Privacy', onClick: () => {} },
      ],
    },
  ];

  return (
    <div className="px-5 pt-14 pb-8">
      <h1 className="font-serif text-2xl text-[#1A1A1A] mb-6">Settings</h1>

      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-5 flex items-center gap-4 mb-6"
      >
        <Avatar src={user?.profile?.avatar ?? undefined} name={user?.profile?.displayName} size="md" />
        <div className="flex-1 min-w-0">
          <p className="font-sans font-semibold text-[#1A1A1A]">{user?.profile?.displayName}</p>
          <p className="text-sm text-[#1A1A1A]/40 font-sans">@{user?.profile?.username}</p>
        </div>
        <button onClick={() => navigate('/edit-profile')}
          className="text-xs text-[#994EA8] font-sans font-medium px-3 py-1.5 rounded-full border border-[#994EA8]/20 hover:bg-[#994EA8]/5 transition-colors">
          Edit
        </button>
      </motion.div>

      {/* Sections */}
      {sections.map((section, si) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: si * 0.08 }}
          className="mb-5"
        >
          <p className="text-[10px] uppercase tracking-wider text-[#1A1A1A]/35 font-sans mb-2 px-1">
            {section.title}
          </p>
          <div className="bg-black/3 rounded-2xl overflow-hidden">
            {section.items.map((item, i) => (
              <button key={item.label} onClick={item.onClick}
                className={`w-full flex items-center gap-3 px-4 py-4 hover:bg-black/3 transition-colors text-left ${i < section.items.length - 1 ? 'border-b border-black/5' : ''}`}>
                <item.icon size={17} className="text-[#1A1A1A]/50" />
                <span className="flex-1 text-sm font-sans text-[#1A1A1A]">{item.label}</span>
                <ChevronRight size={14} className="text-[#1A1A1A]/25" />
              </button>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Logout */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border border-red-100 text-red-500 text-sm font-sans font-medium hover:bg-red-50 transition-colors mt-2"
      >
        <LogOut size={16} /> Sign out
      </motion.button>

      <p className="text-center text-[11px] text-[#1A1A1A]/20 font-sans mt-8">Connectly · Premium social networking</p>
    </div>
  );
};