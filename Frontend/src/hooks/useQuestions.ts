import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { questionsService } from '../services/api';

export const useQuestions = (username: string) =>
  useQuery({
    queryKey: ['questions', username],
    queryFn: () => questionsService.get(username).then((r) => r.data.data),
    enabled: !!username,
  });

export const useAskQuestion = () =>
  useMutation({
    mutationFn: (data: { profileId: string; question: string }) => questionsService.ask(data),
  });

export const useAnswerQuestion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, answer }: { id: string; answer: string }) => questionsService.answer(id, { answer }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['questions'] }),
  });
};