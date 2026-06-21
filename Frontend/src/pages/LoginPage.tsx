import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useLogin } from '../hooks/useAuth';
import { Spinner } from '../components/ui/Spinner';

export const LoginPage: React.FC = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const login = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate(form);
  };

  return (
    <div className="py-8">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors mb-8 font-sans">
        <ArrowLeft size={14} /> Back
      </Link>

      <div className="mb-8">
        <h1 className="font-serif text-3xl text-[#1A1A1A] mb-2">Welcome back</h1>
        <p className="text-sm text-[#1A1A1A]/45 font-sans">Sign in to your Connectly account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#1A1A1A]/50 mb-1.5 font-sans uppercase tracking-wide">Email</label>
          <input
            className="input-field"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#1A1A1A]/50 mb-1.5 font-sans uppercase tracking-wide">Password</label>
          <div className="relative">
            <input
              className="input-field pr-12"
              type={showPw ? 'text' : 'password'}
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <button type="button" onClick={() => setShowPw(!showPw)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1A1A1A]/30 hover:text-[#1A1A1A]/60 transition-colors">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {login.error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-sm text-red-500 font-sans bg-red-50 px-4 py-3 rounded-xl">
            Invalid email or password. Please try again.
          </motion.p>
        )}

        <motion.button
          type="submit"
          whileTap={{ scale: 0.98 }}
          disabled={login.isPending}
          className="btn-primary w-full text-base mt-2"
        >
          {login.isPending ? <Spinner size={18} color="#FFFEFD" /> : 'Sign in'}
        </motion.button>
      </form>

      <p className="text-center text-sm text-[#1A1A1A]/45 mt-6 font-sans">
        Don't have an account?{' '}
        <Link to="/register" className="text-[#994EA8] font-medium hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
};
