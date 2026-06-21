import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationsService } from '../services/api';
import { useNotificationStore } from '../store/notificationStore';
import { useEffect } from 'react';

export const useNotifications = () => {
  const { setNotifications } = useNotificationStore();

  const query = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await notificationsService.getAll();
      return response.data?.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });

  useEffect(() => {
    if (Array.isArray(query.data)) {
      setNotifications(query.data);
    }
  }, [query.data, setNotifications]);

  return query;
};

export const useMarkRead = () => {
  const queryClient = useQueryClient();
  const { markRead } = useNotificationStore();

  return useMutation({
    mutationFn: async (id: string) => {
      await notificationsService.markRead(id);
      return id;
    },

    onSuccess: (id) => {
      markRead(id);

      queryClient.setQueryData(
        ['notifications'],
        (oldData: any[] | undefined) =>
          oldData?.map((notification) =>
            notification.id === id
              ? { ...notification, read: true }
              : notification
          ) ?? []
      );
    },
  });
};