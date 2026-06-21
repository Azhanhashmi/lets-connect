import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../services/api';
import type { Profile } from '../types';

export const useProfile = (username: string) =>
  useQuery({
    queryKey: ['profile', username],
    queryFn: () => profileService.getProfile(username).then((r) => r.data.data),
    enabled: !!username,
  });

export const useUpdateProfile = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Profile>) => {
      const res = await profileService.updateProfile(data);
      return res.data.data;
    },

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['me'] });
      qc.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

export const useUploadAvatar = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const res = await profileService.uploadAvatar(file);
      return res.data.data;
    },

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['me'] });
      qc.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};