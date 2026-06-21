import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, MessageCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { connectionsService } from '../services/api';
import { Avatar } from '../components/ui/Avatar';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import type { Connection } from '../types';

export const ConnectionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: connections, isLoading } = useQuery({
    queryKey: ['connections'],
    queryFn: () => connectionsService.getAll().then((r) => r.data.data),
  });
  const list: Connection[] = Array.isArray(connections) ? connections : [];

  return (
    <div className="px-5 pt-14 pb-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center">
          <Users size={17} />
        </button>
        <h1 className="font-serif text-2xl text-[#1A1A1A]">Connections</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : list.length === 0 ? (
        <EmptyState icon={Users} title="No connections yet" description="Accept requests to build your network." />
      ) : (
        <div className="space-y-2">
          {list.map((conn, i) => (
            <motion.div key={conn.id}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 p-4 rounded-2xl bg-black/3">
              <button onClick={() => navigate(`/u/${conn.user.username}`)}>
                <Avatar src={conn.user.avatar ?? undefined} name={conn.user.displayName} size="md" />
              </button>
              <div className="flex-1 min-w-0">
                <button onClick={() => navigate(`/u/${conn.user.username}`)}>
                  <p className="text-sm font-sans font-medium text-[#1A1A1A] text-left">{conn.user.displayName}</p>
                  <p className="text-xs text-[#1A1A1A]/35 font-sans">@{conn.user.username}</p>
                </button>
              </div>
              <button
                onClick={() => conn.conversationId && navigate(`/messages/${conn.conversationId}`)}
                className="w-9 h-9 rounded-full bg-[#994EA8]/10 flex items-center justify-center"
              >
                <MessageCircle size={16} className="text-[#994EA8]" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};