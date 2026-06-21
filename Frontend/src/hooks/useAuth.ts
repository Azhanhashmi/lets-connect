import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuthStore } from '../store/authStore';

export const useLogin = () => {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: { email: string; password: string }) => authService.login(data),
    onSuccess: (res) => {
      const { user, token } = res.data.data;
      setAuth(user, token);
      navigate('/home');
    },
  });
};

export const useRegister = () => {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: { displayName: string; email: string; username: string; password: string }) =>
      authService.register(data),
    onSuccess: (res) => {
      const { user, token } = res.data.data;
      setAuth(user, token);
      navigate('/home');
    },
  });
};

export const useMe = () => {
  const { isAuthenticated, setUser } = useAuthStore();
  return useQuery({
    queryKey: ['me'],
    queryFn: () => authService.me().then((r) => { setUser(r.data.data); return r.data.data; }),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
};