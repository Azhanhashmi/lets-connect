import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { complimentsService } from '../services/api';

export const useCompliments = (username: string) =>
  useQuery({
    queryKey: ['compliments', username],
    queryFn: () => complimentsService.get(username).then((r) => r.data.data),
    enabled: !!username,
  });

export const useSendCompliment = () => useMutation({ mutationFn: complimentsService.send });

export const useApproveCompliment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => complimentsService.approve(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['compliments'] }),
  });
};

export const useDeleteCompliment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => complimentsService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['compliments'] }),
  });
};