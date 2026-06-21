import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { GuestRoute } from './routes/GuestRoute';
import { AppLayout } from './layouts/AppLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { HomePage } from './pages/HomePage';
import { RequestsPage } from './pages/RequestsPage';
import { MessagesPage } from './pages/MessagesPage';
import { ChatPage } from './pages/ChatPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { PublicProfilePage } from './pages/PublicProfilePage';
import { EditProfilePage } from './pages/EditProfilePage';
import { ComplimentsPage } from './pages/ComplimentsPage';
import { QuestionsPage } from './pages/QuestionsPage';
import { SettingsPage } from './pages/SettingsPage';
import { ConnectionsPage } from './pages/ConnectionsPage';
import { NotFoundPage } from './pages/NotFoundPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        if (error?.response?.status === 429) return false;
        if (error?.response?.status === 401) return false;
        return failureCount < 1;
      },
      staleTime: 2 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
    mutations: { retry: 0 },
  },
});

export const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        {/* Public landing */}
        <Route path="/" element={<LandingPage />} />

        {/* Guest only */}
        <Route element={<GuestRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
        </Route>

        {/* Protected app */}
        <Route element={<ProtectedRoute />}>
          {/* Full screen routes (no bottom nav) */}
          <Route path="/messages/:id" element={<ChatPage />} />
          <Route path="/edit-profile" element={
            <div className="max-w-lg mx-auto min-h-screen bg-[#FFFEFD]"><EditProfilePage /></div>
          } />
          <Route path="/connections" element={
            <div className="max-w-lg mx-auto min-h-screen bg-[#FFFEFD]"><ConnectionsPage /></div>
          } />
          <Route path="/u/:username" element={
            <div className="max-w-lg mx-auto min-h-screen bg-[#FFFEFD]"><PublicProfilePage /></div>
          } />

          {/* Bottom nav routes */}
          <Route element={<AppLayout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/requests" element={<RequestsPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/compliments" element={<ComplimentsPage />} />
            <Route path="/questions" element={<QuestionsPage />} />
          </Route>
        </Route>

        {/* Redirects */}
        <Route path="/index" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
