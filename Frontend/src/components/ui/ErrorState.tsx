import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps { message?: string; onRetry?: () => void; }

export const ErrorState: React.FC<ErrorStateProps> = ({ message = 'Something went wrong', onRetry }) => (
  <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
    <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
      <AlertCircle size={24} className="text-red-400" />
    </div>
    <p className="text-sm text-[#1A1A1A]/60 font-sans mb-4">{message}</p>
    {onRetry && <button onClick={onRetry} className="btn-outline text-sm px-5 py-2.5">Try again</button>}
  </div>
);
