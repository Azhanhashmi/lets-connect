export interface Profile {
  id: string;
  username: string;
  displayName: string;
  avatar?: string | null;
  bio?: string | null;
  interests: string[];
  lookingFor?: string | null;
  instagramLink?: string | null;
  websiteLink?: string | null;
  isConnected?: boolean;
  requestSent?: boolean;
}

export interface User {
  id: string;
  email: string;
  verified: boolean;
  createdAt: string;
  profile: Profile;
}

export interface ConnectRequestSender {
  id: string;
  username: string;
  displayName: string;
  avatar?: string | null;
  bio?: string | null;
  interests: string[];
}

export interface PendingConnectRequest {
  id: string;
  message?: string | null;
  createdAt: string;
  sender: ConnectRequestSender;
  sharedInterests: string[];
}

export interface Connection {
  id: string;
  createdAt: string;
  conversationId: string | null;
  user: Profile;
}

export interface ConversationPreview {
  id: string;
  createdAt: string;
  participant: Profile;
  lastMessage: {
    content: string;
    createdAt: string;
    read: boolean;
    isOwn: boolean;
  } | null;
}

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  read: boolean;
  createdAt: string;
  sender: {
    username: string;
    displayName: string;
    avatar?: string | null;
  };
}

export interface Compliment {
  id: string;
  profileId: string;
  content: string;
  approved: boolean;
  anonymous: boolean;
  createdAt: string;
}

export interface Question {
  id: string;
  profileId: string;
  question: string;
  answer?: string | null;
  createdAt: string;
}

export type NotificationType =
  | 'CONNECT_REQUEST'
  | 'REQUEST_ACCEPTED'
  | 'NEW_MESSAGE'
  | 'NEW_COMPLIMENT'
  | 'NEW_QUESTION'
  | 'QUESTION_ANSWERED';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterPayload {
  email: string;
  password: string;
  username: string;
  displayName: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
export interface PublicComment {
  id: string;
  authorName: string;
  authorAvatar?: string | null;
  content: string;
  createdAt: string;
  approved: boolean;
}