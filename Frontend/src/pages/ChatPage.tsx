import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Check, CheckCheck } from 'lucide-react';
import { useMessages, useSendMessage } from '../hooks/useMessages';
import { useAuthStore } from '../store/authStore';
import { useSocketStore } from '../store/socketStore';
import { Avatar } from '../components/ui/Avatar';
import { Spinner } from '../components/ui/Spinner';
import type { Message } from '../types';

export const ChatPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const { socket, connect } = useSocketStore();
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(false);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  
  const { data: messages, isLoading } = useMessages(id!);
  const send = useSendMessage();

  useEffect(() => { if (token) connect(token); }, [token, connect]);
  useEffect(() => { if (Array.isArray(messages)) setLocalMessages(messages); }, [messages]);

  // Socket listeners — matches backend events exactly: receive_message, typing, stop_typing
  useEffect(() => {
    if (!socket || !id) return;

    const onReceive = (msg: Message & { conversationId: string }) => {
      if (msg.conversationId !== id) return;
      setLocalMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    };
    const onTyping = (data: { conversationId: string; userId: string }) => {
      if (data.conversationId === id && data.userId !== user?.id) setTyping(true);
    };
    const onStopTyping = (data: { conversationId: string; userId: string }) => {
      if (data.conversationId === id && data.userId !== user?.id) setTyping(false);
    };

    socket.on('receive_message', onReceive);
    socket.on('typing', onTyping);
    socket.on('stop_typing', onStopTyping);

    return () => {
      socket.off('receive_message', onReceive);
      socket.off('typing', onTyping);
      socket.off('stop_typing', onStopTyping);
    };
  }, [socket, id, user?.id]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [localMessages]);

  // Get conversation participant from first message that isn't mine
  const participant = localMessages.find((m) => m.sender.username !== user?.profile?.username)?.sender;

  const handleSend = () => {
    if (!text.trim() || !id) return;
    const content = text.trim();

    if (socket) {
      // Real-time path: backend persists + broadcasts via send_message
      socket.emit('send_message', { conversationId: id, content });
    } else {
      // Fallback: REST path if socket isn't connected
      send.mutate({ conversationId: id, content });
    }

    setText('');
    socket?.emit('stop_typing', { conversationId: id });
    clearTimeout(typingTimeoutRef.current);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleTyping = (v: string) => {
    setText(v);
    if (socket && id) {
      socket.emit('typing', { conversationId: id });
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => socket.emit('stop_typing', { conversationId: id }), 1500);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#FFFEFD]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#FFFEFD]/90 backdrop-blur-xl border-b border-black/6 flex-shrink-0 pt-12">
        <button onClick={() => navigate('/messages')} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5">
          <ArrowLeft size={20} />
        </button>
        {participant ? (
          <>
            <Avatar src={participant.avatar ?? undefined} name={participant.displayName} size="sm" />
            <div>
              <p className="text-sm font-sans font-semibold text-[#1A1A1A]">{participant.displayName}</p>
              {typing && <p className="text-xs text-[#994EA8] font-sans">typing...</p>}
            </div>
          </>
        ) : (
          <div className="w-8 h-4 bg-black/8 rounded animate-pulse" />
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {isLoading ? (
          <div className="flex justify-center py-8"><Spinner /></div>
        ) : (
          <AnimatePresence initial={false}>
            {localMessages.map((msg) => {
              const isMe = msg.sender.username === user?.profile?.username;
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2`}
                >
                  {!isMe && <Avatar src={msg.sender.avatar ?? undefined} name={msg.sender.displayName} size="xs" />}
                  <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${isMe ? 'bg-[#1A1A1A] text-[#FFFEFD] rounded-br-sm' : 'bg-black/6 text-[#1A1A1A] rounded-bl-sm'}`}>
                    <p className="text-sm font-sans leading-relaxed">{msg.content}</p>
                    <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : ''}`}>
                      <span className={`text-[10px] font-sans ${isMe ? 'text-white/40' : 'text-black/30'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isMe && (msg.read ? <CheckCheck size={11} className="text-[#994EA8]" /> : <Check size={11} className="text-white/40" />)}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
        {typing && (
          <div className="flex items-end gap-2">
            <Avatar src={participant?.avatar ?? undefined} name={participant?.displayName} size="xs" />
            <div className="bg-black/6 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1 items-center">
                {[0, 1, 2].map((i) => (
                  <motion.div key={i} className="w-1.5 h-1.5 bg-[#1A1A1A]/30 rounded-full"
                    animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 bg-[#FFFEFD]/90 backdrop-blur-xl border-t border-black/6 flex-shrink-0 safe-bottom">
        <div className="flex items-end gap-2">
          <div className="flex-1 bg-black/5 rounded-2xl px-4 py-3 min-h-[46px] flex items-end">
            <textarea
              value={text}
              onChange={(e) => handleTyping(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message..."
              rows={1}
              className="flex-1 bg-transparent text-sm font-sans text-[#1A1A1A] placeholder-black/25 outline-none resize-none leading-relaxed"
              style={{ maxHeight: 120 }}
            />
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            disabled={!text.trim()}
            className="w-11 h-11 rounded-full bg-[#1A1A1A] flex items-center justify-center flex-shrink-0 disabled:opacity-30 transition-opacity"
          >
            <Send size={16} className="text-white ml-0.5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};