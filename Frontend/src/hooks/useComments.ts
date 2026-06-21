import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { commentsService } from '../services/api';

export const useComments = (username: string) =>
  useQuery({
    queryKey: ['comments', username],
    queryFn: () => commentsService.get(username).then((r) => r.data.data),
    enabled: !!username,
    staleTime: 2 * 60 * 1000,
  });

export const usePostComment = (username: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { authorName: string; content: string }) =>
      commentsService.post(username, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['comments', username] }),
  });
};