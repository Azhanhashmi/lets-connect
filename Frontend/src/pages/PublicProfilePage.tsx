import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Heart, HelpCircle, Link2, Send,
  UserPlus, MessageCircle, Clock, MessageSquare
} from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { useCompliments, useSendCompliment } from '../hooks/useCompliments';
import { useQuestions, useAskQuestion } from '../hooks/useQuestions';
import { useRequestActions } from '../hooks/useRequests';
import { useComments, usePostComment } from '../hooks/useComments';
import { useAuthStore } from '../store/authStore';
import { Avatar } from '../components/ui/Avatar';
import { Tag } from '../components/ui/Tag';
import { Spinner } from '../components/ui/Spinner';
import type { Compliment, Question, PublicComment } from '../types';

const Modal: React.FC<{ onClose: () => void; title: string; children: React.ReactNode }> = ({
  onClose, title, children
}) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end justify-center p-4"
    onClick={onClose}
  >
    <motion.div
      initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
      transition={{ type: 'spring', damping: 28, stiffness: 300 }}
      className="bg-[#FFFEFD] rounded-3xl p-6 w-full max-w-sm"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="font-serif text-xl text-[#1A1A1A] mb-4">{title}</h3>
      {children}
    </motion.div>
  </motion.div>
);

export const PublicProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const { data: profile, isLoading } = useProfile(username!);
  const { data: compliments } = useCompliments(username!);
  const { data: questions } = useQuestions(username!);
  const { data: comments, isLoading: commentsLoading } = useComments(username!);

  const sendRequest = useRequestActions().send;
  const sendCompliment = useSendCompliment();
  const askQuestion = useAskQuestion();
  const postComment = usePostComment(username!);

  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showComplimentModal, setShowComplimentModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [connectMsg, setConnectMsg] = useState('');
  const [complimentText, setComplimentText] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [anon, setAnon] = useState(false);
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentSuccess, setCommentSuccess] = useState(false);

  if (isLoading) return <div className="flex justify-center pt-20"><Spinner /></div>;
  if (!profile) return <div className="text-center pt-20 font-sans text-[#1A1A1A]/40">Profile not found</div>;

  // Relationship state
  const isOwnProfile = user?.profile?.username === username;
  const isConnected = profile.isConnected;
  const requestSent = profile.requestSent;

  const approvedCompliments: Compliment[] = Array.isArray(compliments)
    ? compliments.filter((c) => c.approved) : [];
  const answeredQuestions: Question[] = Array.isArray(questions)
    ? questions.filter((q) => q.answer) : [];
  const approvedComments: PublicComment[] = Array.isArray(comments)
    ? comments.filter((c: PublicComment) => c.approved) : [];

  const handleConnect = () => {
    sendRequest.mutate({ receiverId: profile.id, message: connectMsg });
    setShowConnectModal(false);
    setConnectMsg('');
  };

  const handleCompliment = () => {
    sendCompliment.mutate({ profileId: profile.id, content: complimentText, anonymous: anon });
    setComplimentText('');
    setAnon(false);
    setShowComplimentModal(false);
  };

  const handleQuestion = () => {
    askQuestion.mutate({ profileId: profile.id, question: questionText });
    setQuestionText('');
    setShowQuestionModal(false);
  };

  const handleComment = () => {
    if (!commentText.trim() || !commentName.trim()) return;
    postComment.mutate(
      { authorName: commentName.trim(), content: commentText.trim() },
      {
        onSuccess: () => {
          setCommentText('');
          setCommentName('');
          setCommentSuccess(true);
          setTimeout(() => setCommentSuccess(false), 3000);
        },
      }
    );
  };

  // Smart connection button
  const renderConnectionButton = () => {
    if (isOwnProfile) return null;
    if (isConnected) {
      return (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/messages')}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1A1A1A] rounded-full shadow-md text-sm font-sans text-white"
        >
          <MessageCircle size={15} /> Message
        </motion.button>
      );
    }
    if (requestSent) {
      return (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-black/6 rounded-full text-sm font-sans text-[#1A1A1A]/40 cursor-default">
          <Clock size={15} /> Request sent
        </div>
      );
    }
    return (
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowConnectModal(true)}
        className="flex items-center gap-2 px-4 py-2.5 bg-[#1A1A1A] rounded-full shadow-md text-sm font-sans text-white"
      >
        <UserPlus size={15} /> Connect
      </motion.button>
    );
  };

  return (
    <div className="pb-40">
      {/* Back */}
      <div className="px-5 pt-12 pb-0">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors font-sans mb-4">
          <ArrowLeft size={14} /> Back
        </button>
      </div>

      {/* Hero */}
      <div className="relative">
        <div className="h-40 bg-gradient-to-br from-[#994EA8]/10 to-[#1A1A1A]/5" />
        <div className="px-5 -mt-14">
          <div className="mb-4">
            <Avatar src={profile.avatar ?? undefined} name={profile.displayName} size="xl"
              className="ring-4 ring-[#FFFEFD] shadow-lg" />
          </div>
          <h1 className="font-serif text-2xl text-[#1A1A1A] mb-0.5">{profile.displayName}</h1>
          <p className="text-sm text-[#1A1A1A]/40 font-sans mb-2">@{profile.username}</p>
          {profile.bio && (
            <p className="text-sm text-[#1A1A1A]/65 font-sans leading-relaxed mb-5">{profile.bio}</p>
          )}

          {profile.interests && profile.interests.length > 0 && (
            <div className="mb-4">
              <p className="text-[10px] uppercase tracking-wider text-[#1A1A1A]/35 font-sans mb-2">Interests</p>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((i) => <Tag key={i} label={i} />)}
              </div>
            </div>
          )}

          {profile.lookingFor && (
            <div className="mb-4">
              <p className="text-[10px] uppercase tracking-wider text-[#1A1A1A]/35 font-sans mb-2">Looking for</p>
              <Tag label={profile.lookingFor} variant="purple" />
            </div>
          )}

          {(profile.instagramLink || profile.websiteLink) && (
            <div className="mb-5 flex flex-col gap-2">
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
          )}

          {/* Own profile banner */}
          {isOwnProfile && (
            <div className="bg-[#994EA8]/8 border border-[#994EA8]/15 rounded-2xl px-4 py-3 mb-2 flex items-center justify-between">
              <p className="text-sm font-sans text-[#994EA8]">This is your public profile</p>
              <button onClick={() => navigate('/edit-profile')}
                className="text-xs font-sans font-medium text-[#994EA8] underline">
                Edit
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="h-px bg-black/6 mx-5 my-6" />

      {/* Compliments */}
      {approvedCompliments.length > 0 && (
        <div className="px-5 mb-6">
          <h2 className="font-serif text-lg text-[#1A1A1A] mb-3">Compliments</h2>
          <div className="space-y-3">
            {approvedCompliments.map((c) => (
              <div key={c.id} className="bg-black/3 rounded-2xl p-4">
                <p className="text-sm font-sans text-[#1A1A1A]/70 italic">"{c.content}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Q&A */}
      {answeredQuestions.length > 0 && (
        <div className="px-5 mb-6">
          <h2 className="font-serif text-lg text-[#1A1A1A] mb-3">Q&A</h2>
          <div className="space-y-3">
            {answeredQuestions.map((q) => (
              <div key={q.id} className="border border-black/8 rounded-2xl p-4">
                <p className="text-sm font-sans font-medium text-[#1A1A1A] mb-2">{q.question}</p>
                <p className="text-sm font-sans text-[#1A1A1A]/60">{q.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Comment Wall ── */}
      <div className="px-5 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <MessageSquare size={17} className="text-[#1A1A1A]/40" />
          <h2 className="font-serif text-lg text-[#1A1A1A]">Messages</h2>
        </div>
        <p className="text-xs text-[#1A1A1A]/35 font-sans mb-4">
          Reviewed before appearing publicly.
        </p>

        {/* Comment form — hidden on own profile */}
        {!isOwnProfile && (
          <div className="bg-black/3 rounded-2xl p-4 mb-5">
            <input
              className="input-field mb-3 text-sm"
              placeholder="Your name"
              value={commentName}
              onChange={(e) => setCommentName(e.target.value)}
              maxLength={40}
            />
            <textarea
              className="input-field resize-none text-sm mb-3"
              rows={3}
              placeholder={`Say something to ${profile.displayName}...`}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              maxLength={300}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#1A1A1A]/30 font-sans">{commentText.length}/300</span>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleComment}
                disabled={!commentText.trim() || !commentName.trim() || postComment.isPending}
                className="btn-primary py-2.5 px-5 text-sm disabled:opacity-40"
              >
                {postComment.isPending
                  ? <Spinner size={15} color="#FFFEFD" />
                  : <><Send size={13} /> Send</>
                }
              </motion.button>
            </div>
            {commentSuccess && (
              <motion.p
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                className="text-xs text-green-600 font-sans mt-2"
              >
                ✓ Sent! It'll appear once approved.
              </motion.p>
            )}
          </div>
        )}

        {/* Approved comments */}
        {commentsLoading ? (
          <div className="flex justify-center py-4"><Spinner size={20} /></div>
        ) : approvedComments.length === 0 ? (
          <p className="text-sm text-[#1A1A1A]/30 font-sans text-center py-4">
            No messages yet. Be the first!
          </p>
        ) : (
          <div className="space-y-3">
            {approvedComments.map((c) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 p-4 bg-black/3 rounded-2xl"
              >
                <Avatar name={c.authorName} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-sans font-medium text-[#1A1A1A]">{c.authorName}</span>
                    <span className="text-xs text-[#1A1A1A]/30 font-sans">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm font-sans text-[#1A1A1A]/65 leading-relaxed">{c.content}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Floating buttons — hidden on own profile */}
      {!isOwnProfile && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center gap-3 px-5 z-40">
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowComplimentModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#FFFEFD] border border-black/10 rounded-full shadow-md text-sm font-sans text-[#1A1A1A]/70">
            <Heart size={15} className="text-[#994EA8]" /> Compliment
          </motion.button>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowQuestionModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#FFFEFD] border border-black/10 rounded-full shadow-md text-sm font-sans text-[#1A1A1A]/70">
            <HelpCircle size={15} /> Ask
          </motion.button>
          {renderConnectionButton()}
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showConnectModal && (
          <Modal onClose={() => setShowConnectModal(false)} title={`Connect with ${profile.displayName}`}>
            <textarea className="input-field resize-none mb-4" rows={3}
              placeholder="Add a message (optional)..."
              value={connectMsg} onChange={(e) => setConnectMsg(e.target.value)} />
            <button onClick={handleConnect} disabled={sendRequest.isPending} className="btn-primary w-full">
              {sendRequest.isPending ? <Spinner size={18} color="#FFFEFD" /> : 'Send request'}
            </button>
          </Modal>
        )}
        {showComplimentModal && (
          <Modal onClose={() => setShowComplimentModal(false)} title="Send a compliment">
            <textarea className="input-field resize-none mb-3" rows={3}
              placeholder="Say something kind..." value={complimentText}
              onChange={(e) => setComplimentText(e.target.value)} />
            <label className="flex items-center gap-2 text-sm font-sans text-[#1A1A1A]/60 mb-4 cursor-pointer">
              <input type="checkbox" checked={anon} onChange={(e) => setAnon(e.target.checked)} className="rounded" />
              Send anonymously
            </label>
            <button onClick={handleCompliment} disabled={!complimentText.trim()} className="btn-purple w-full">
              <Send size={15} /> Send compliment
            </button>
          </Modal>
        )}
        {showQuestionModal && (
          <Modal onClose={() => setShowQuestionModal(false)} title="Ask a question">
            <textarea className="input-field resize-none mb-3" rows={3}
              placeholder="What would you like to ask?" value={questionText}
              onChange={(e) => setQuestionText(e.target.value)} />
            <button onClick={handleQuestion} disabled={!questionText.trim()} className="btn-primary w-full">
              <Send size={15} /> Send question
            </button>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};