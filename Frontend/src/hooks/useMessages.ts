import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { messagesService } from '../services/api';

export const useConversations = () =>
  useQuery({
    queryKey: ['conversations'],
    queryFn: () => messagesService.getConversations().then((r) => r.data.data),
    staleTime: 60 * 1000,
  });

export const useMessages = (conversationId: string) =>
  useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => messagesService.getMessages(conversationId).then((r) => r.data.data),
    enabled: !!conversationId,
    staleTime: 30 * 1000,
  });

export const useSendMessage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { conversationId: string; content: string }) => messagesService.send(data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['messages', vars.conversationId] });
      qc.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};