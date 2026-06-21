import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useRegister } from '../hooks/useAuth';
import { Spinner } from '../components/ui/Spinner';

export const RegisterPage: React.FC = () => {
  const [form, setForm] = useState({ displayName: '', username: '', email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const register = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register.mutate(form);
  };

  const fields = [
    { key: 'displayName', label: 'Full name', type: 'text', placeholder: 'Your name' },
    { key: 'username', label: 'Username', type: 'text', placeholder: 'yourhandle' },
    { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
  ] as const;

  return (
    <div className="py-8">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors mb-8 font-sans">
        <ArrowLeft size={14} /> Back
      </Link>

      <div className="mb-8">
        <h1 className="font-serif text-3xl text-[#1A1A1A] mb-2">Create account</h1>
        <p className="text-sm text-[#1A1A1A]/45 font-sans">Join Connectly — it's free</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(({ key, label, type, placeholder }) => (
          <div key={key}>
            <label className="block text-xs font-medium text-[#1A1A1A]/50 mb-1.5 font-sans uppercase tracking-wide">{label}</label>
            <input
              className="input-field"
              type={type}
              placeholder={placeholder}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              required
            />
          </div>
        ))}
        <div>
          <label className="block text-xs font-medium text-[#1A1A1A]/50 mb-1.5 font-sans uppercase tracking-wide">Password</label>
          <div className="relative">
            <input
              className="input-field pr-12"
              type={showPw ? 'text' : 'password'}
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              minLength={8}
              required
            />
            <button type="button" onClick={() => setShowPw(!showPw)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1A1A1A]/30 hover:text-[#1A1A1A]/60">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {register.error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-sm text-red-500 font-sans bg-red-50 px-4 py-3 rounded-xl">
            Registration failed. That username or email may already exist.
          </motion.p>
        )}

        <motion.button type="submit" whileTap={{ scale: 0.98 }} disabled={register.isPending}
          className="btn-primary w-full text-base mt-2">
          {register.isPending ? <Spinner size={18} color="#FFFEFD" /> : 'Create account'}
        </motion.button>
      </form>

      <p className="text-center text-sm text-[#1A1A1A]/45 mt-6 font-sans">
        Already have an account?{' '}
        <Link to="/login" className="text-[#994EA8] font-medium hover:underline">Sign in</Link>
      </p>
    </div>
  );
};