import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { requestsService } from '../services/api';

export const usePendingRequests = () =>
  useQuery({
    queryKey: ['requests', 'pending'],
    queryFn: () => requestsService.pending().then((r) => r.data.data),
    staleTime: 2 * 60 * 1000,
  });

export const useLaterRequests = () =>
  useQuery({
    queryKey: ['requests', 'later'],
    queryFn: () => requestsService.getLater().then((r) => r.data.data),
    staleTime: 2 * 60 * 1000,
  });

export const useRequestActions = () => {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['requests'] });
  const accept = useMutation({ mutationFn: (id: string) => requestsService.accept(id), onSuccess: invalidate });
  const pass = useMutation({ mutationFn: (id: string) => requestsService.pass(id), onSuccess: invalidate });
  const later = useMutation({ mutationFn: (id: string) => requestsService.later(id), onSuccess: invalidate });
  const send = useMutation({
    mutationFn: (data: { receiverId: string; message?: string }) => requestsService.send(data),
  });
  return { accept, pass, later, send };
};