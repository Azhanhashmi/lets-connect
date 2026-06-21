import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Trash2, Check } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCompliments, useApproveCompliment, useDeleteCompliment } from '../hooks/useCompliments';
import { Avatar } from '../components/ui/Avatar';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import type { Compliment } from '../types';

export const ComplimentsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { data: compliments, isLoading } = useCompliments(user?.profile?.username || '');
  const approve = useApproveCompliment();
  const del = useDeleteCompliment();

  const list: Compliment[] = Array.isArray(compliments) ? compliments : [];
  const pending = list.filter((c) => !c.approved);
  const approved = list.filter((c) => c.approved);

  if (isLoading) return <div className="flex justify-center pt-20"><Spinner /></div>;

  const ComplimentItem = ({ c, showActions }: { c: Compliment; showActions: boolean }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex items-start gap-3 p-4 rounded-2xl bg-black/3 group"
    >
      <Avatar size="sm" name="?" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-sans text-[#1A1A1A]/70 italic leading-relaxed">"{c.content}"</p>
        <p className="text-xs text-[#1A1A1A]/30 mt-1 font-sans">
          {c.anonymous ? 'Anonymous' : 'Sender'} · {new Date(c.createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        {showActions && (
          <button onClick={() => approve.mutate(c.id)} disabled={approve.isPending}
            className="w-7 h-7 rounded-full bg-[#994EA8]/10 flex items-center justify-center hover:bg-[#994EA8]/20 transition-colors">
            <Check size={13} className="text-[#994EA8]" />
          </button>
        )}
        <button onClick={() => del.mutate(c.id)} disabled={del.isPending}
          className="w-7 h-7 rounded-full hover:bg-red-50 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100">
          <Trash2 size={13} className="text-red-400" />
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="px-5 pt-14 pb-8">
      <h1 className="font-serif text-2xl text-[#1A1A1A] mb-6">Compliments</h1>

      {list.length === 0 ? (
        <EmptyState icon={Heart} title="No compliments yet" description="Share your profile to receive compliments from connections." />
      ) : (
        <>
          {pending.length > 0 && (
            <div className="mb-6">
              <p className="text-[10px] uppercase tracking-wider text-[#1A1A1A]/35 font-sans mb-3">
                Awaiting approval ({pending.length})
              </p>
              <div className="space-y-2">
                {pending.map((c) => <ComplimentItem key={c.id} c={c} showActions />)}
              </div>
            </div>
          )}
          {approved.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#1A1A1A]/35 font-sans mb-3">
                Published ({approved.length})
              </p>
              <div className="space-y-2">
                {approved.map((c) => <ComplimentItem key={c.id} c={c} showActions={false} />)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};