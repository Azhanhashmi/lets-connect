import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Edit3, Link2, Heart, HelpCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCompliments } from '../hooks/useCompliments';
import { useQuestions } from '../hooks/useQuestions';
import { Avatar } from '../components/ui/Avatar';
import { Tag } from '../components/ui/Tag';
import { Spinner } from '../components/ui/Spinner';
import type { Compliment, Question } from '../types';

export const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { data: compliments, isLoading: cLoading } = useCompliments(user?.profile?.username || '');
  const { data: questions, isLoading: qLoading } = useQuestions(user?.profile?.username || '');

  const approvedCompliments = Array.isArray(compliments) ? compliments.filter((c: Compliment) => c.approved) : [];
  const answeredQuestions = Array.isArray(questions) ? questions.filter((q: Question) => q.answer) : [];

  if (!user) return <div className="flex justify-center pt-20"><Spinner /></div>;

  const profile = user.profile;

  return (
    <div className="pb-8">
      {/* Hero */}
      <div className="relative">
        {/* Background gradient */}
        <div className="h-40 bg-gradient-to-br from-[#994EA8]/10 to-[#1A1A1A]/5" />

        {/* Avatar + edit */}
        <div className="px-5 -mt-14">
          <div className="flex items-end justify-between mb-4">
            <div className="relative">
              <Avatar src={profile.avatar ?? undefined} name={profile.displayName} size="xl"
                className="ring-4 ring-[#FFFEFD] shadow-lg" />
            </div>
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => navigate('/edit-profile')}
              className="btn-outline text-sm px-4 py-2"
            >
              <Edit3 size={14} /> Edit
            </motion.button>
          </div>

          {/* Name & username */}
          <h1 className="font-serif text-2xl text-[#1A1A1A] mb-0.5">{profile.displayName}</h1>
          <p className="text-sm text-[#1A1A1A]/40 font-sans mb-3">@{profile.username}</p>

          {profile.bio && (
            <p className="text-sm text-[#1A1A1A]/65 font-sans leading-relaxed mb-5">{profile.bio}</p>
          )}

          {/* Stats row */}
          <div className="flex gap-6 mb-6">
            {[
              { label: 'Compliments', value: approvedCompliments.length, icon: Heart },
              { label: 'Q&A', value: answeredQuestions.length, icon: HelpCircle },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center gap-1.5">
                <Icon size={14} className="text-[#994EA8]" />
                <span className="text-sm font-semibold font-sans text-[#1A1A1A]">{value}</span>
                <span className="text-xs text-[#1A1A1A]/40 font-sans">{label}</span>
              </div>
            ))}
          </div>

          {/* Interests */}
          {profile.interests && profile.interests.length > 0 && (
            <div className="mb-5">
              <p className="text-[10px] uppercase tracking-wider text-[#1A1A1A]/35 font-sans mb-2">Interests</p>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((i) => <Tag key={i} label={i} variant="default" />)}
              </div>
            </div>
          )}

          {/* Looking for */}
          {profile.lookingFor && (
            <div className="mb-5">
              <p className="text-[10px] uppercase tracking-wider text-[#1A1A1A]/35 font-sans mb-2">Looking for</p>
              <Tag label={profile.lookingFor} variant="purple" />
            </div>
          )}

          {/* Social links */}
          {(profile.instagramLink || profile.websiteLink) && (
            <div className="mb-6">
              <p className="text-[10px] uppercase tracking-wider text-[#1A1A1A]/35 font-sans mb-2">Links</p>
              <div className="flex flex-col gap-2">
                {profile.instagramLink && (
                  <a href={profile.instagramLink} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-[#994EA8] font-sans hover:underline">
                    <Link2 size={13} /> Instagram
                  </a>
                )}
                {profile.websiteLink && (
                  <a href={profile.websiteLink} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-[#994EA8] font-sans hover:underline">
                    <Link2 size={13} /> Website
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-black/6 mx-5 mb-6" />

      {/* Compliments */}
      <div className="px-5 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg text-[#1A1A1A]">Compliments</h2>
          <button onClick={() => navigate('/compliments')} className="text-xs text-[#994EA8] font-sans font-medium">
            Manage →
          </button>
        </div>
        {cLoading ? <Spinner size={20} /> : approvedCompliments.length === 0 ? (
          <p className="text-sm text-[#1A1A1A]/35 font-sans">No compliments yet.</p>
        ) : (
          <div className="space-y-3">
            {approvedCompliments.slice(0, 3).map((c) => (
              <div key={c.id} className="bg-black/3 rounded-2xl p-4">
                <p className="text-sm font-sans text-[#1A1A1A]/70 italic leading-relaxed">"{c.content}"</p>
                {!c.anonymous && (
                  <p className="text-xs text-[#1A1A1A]/35 mt-2 font-sans">— Sent to you</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Questions */}
      <div className="px-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg text-[#1A1A1A]">Questions & Answers</h2>
          <button onClick={() => navigate('/questions')} className="text-xs text-[#994EA8] font-sans font-medium">
            Manage →
          </button>
        </div>
        {qLoading ? <Spinner size={20} /> : answeredQuestions.length === 0 ? (
          <p className="text-sm text-[#1A1A1A]/35 font-sans">No answered questions yet.</p>
        ) : (
          <div className="space-y-3">
            {answeredQuestions.slice(0, 3).map((q) => (
              <div key={q.id} className="border border-black/8 rounded-2xl p-4">
                <p className="text-sm font-sans font-medium text-[#1A1A1A] mb-2">{q.question}</p>
                <p className="text-sm font-sans text-[#1A1A1A]/60 leading-relaxed">{q.answer}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};