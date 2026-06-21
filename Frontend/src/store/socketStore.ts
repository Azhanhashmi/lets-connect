import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

interface SocketState {
  socket: Socket | null;
  connected: boolean;
  connect: (token: string) => void;
  disconnect: () => void;
}

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  connected: false,
  connect: (token) => {
    const existing = get().socket;
    if (existing?.connected) return;
    const socket = io('http://localhost:5000', {
      auth: { token },
      transports: ['websocket'],
    });
    socket.on('connect', () => set({ connected: true }));
    socket.on('disconnect', () => set({ connected: false }));
    set({ socket });
  },
  disconnect: () => {
    get().socket?.disconnect();
    set({ socket: null, connected: false });
  },
}));
