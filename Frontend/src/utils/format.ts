export const formatRelativeTime = (date: string | Date): string => {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString('en', { month: 'short', day: 'numeric' });
};

export const formatTime = (date: string | Date): string =>
  new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export const getInitials = (name?: string): string =>
  name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || '?';
