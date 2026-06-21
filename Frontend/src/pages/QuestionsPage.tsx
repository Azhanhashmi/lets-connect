import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useQuestions, useAnswerQuestion } from '../hooks/useQuestions';
import { Avatar } from '../components/ui/Avatar';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import type { Question } from '../types';

export const QuestionsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { data: questions, isLoading } = useQuestions(user?.profile?.username || '');
  const answer = useAnswerQuestion();
  const [answering, setAnswering] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState('');

  const list: Question[] = Array.isArray(questions) ? questions : [];
  const unanswered = list.filter((q) => !q.answer);
  const answered = list.filter((q) => q.answer);

  const handleAnswer = (id: string) => {
    if (!answerText.trim()) return;
    answer.mutate({ id, answer: answerText });
    setAnswerText('');
    setAnswering(null);
  };

  if (isLoading) return <div className="flex justify-center pt-20"><Spinner /></div>;

  return (
    <div className="px-5 pt-14 pb-8">
      <h1 className="font-serif text-2xl text-[#1A1A1A] mb-6">Questions</h1>

      {list.length === 0 ? (
        <EmptyState icon={HelpCircle} title="No questions yet" description="People can ask you questions from your public profile." />
      ) : (
        <>
          {unanswered.length > 0 && (
            <div className="mb-6">
              <p className="text-[10px] uppercase tracking-wider text-[#1A1A1A]/35 font-sans mb-3">Unanswered ({unanswered.length})</p>
              <div className="space-y-3">
                {unanswered.map((q) => (
                  <motion.div key={q.id} layout className="border border-black/8 rounded-2xl overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar size="xs" />
                        <span className="text-xs text-[#1A1A1A]/35 font-sans">Anonymous</span>
                      </div>
                      <p className="text-sm font-sans text-[#1A1A1A] font-medium">{q.question}</p>
                    </div>
                    <div className="border-t border-black/6">
                      {answering === q.id ? (
                        <div className="p-4">
                          <textarea className="input-field resize-none mb-3 text-sm" rows={3}
                            placeholder="Write your answer..." value={answerText} onChange={(e) => setAnswerText(e.target.value)} />
                          <div className="flex gap-2">
                            <button onClick={() => handleAnswer(q.id)} disabled={answer.isPending} className="btn-primary flex-1 py-2.5 text-sm">
                              {answer.isPending ? <Spinner size={16} color="#FFFEFD" /> : 'Publish answer'}
                            </button>
                            <button onClick={() => setAnswering(null)} className="btn-outline py-2.5 px-4 text-sm">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => setAnswering(q.id)}
                          className="w-full py-3 text-sm text-[#994EA8] font-sans font-medium hover:bg-[#994EA8]/4 transition-colors">
                          Answer this question
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {answered.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#1A1A1A]/35 font-sans mb-3">Answered ({answered.length})</p>
              <div className="space-y-3">
                {answered.map((q) => (
                  <div key={q.id} className="border border-black/8 rounded-2xl p-4">
                    <p className="text-sm font-sans text-[#1A1A1A] font-medium mb-3">{q.question}</p>
                    <div className="flex items-start gap-2 bg-black/3 rounded-xl p-3">
                      <Avatar src={user?.profile?.avatar ?? undefined} name={user?.profile?.displayName} size="xs" className="mt-0.5" />
                      <p className="text-sm font-sans text-[#1A1A1A]/65 leading-relaxed">{q.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};