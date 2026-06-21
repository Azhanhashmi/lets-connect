export const API_BASE_URL = 'http://localhost:5000/api';
export const SOCKET_URL = 'http://localhost:5000';
export const APP_NAME = 'Connectly';

export const COLORS = {
  white: '#FFFEFD',
  black: '#1A1A1A',
  purple: '#994EA8',
  purpleDark: '#7A3D88',
  purpleLight: '#B86BC8',
} as const;

export const QUERY_KEYS = {
  me: ['me'],
  profile: (username: string) => ['profile', username],
  requests: { pending: ['requests', 'pending'], later: ['requests', 'later'] },
  conversations: ['conversations'],
  messages: (id: string) => ['messages', id],
  compliments: (username: string) => ['compliments', username],
  questions: (username: string) => ['questions', username],
  notifications: ['notifications'],
  connections: ['connections'],
} as const;
