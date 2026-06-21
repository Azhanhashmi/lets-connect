import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFFEFD] flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Logo mark */}
          <div className="w-16 h-16 rounded-2xl bg-[#1A1A1A] flex items-center justify-center mx-auto mb-8 shadow-lg">
            <span className="text-[#FFFEFD] text-2xl font-serif font-bold">C</span>
          </div>

          <p className="text-xs font-medium tracking-[0.2em] uppercase text-[#994EA8] mb-4 font-sans">
            Introducing Connectly
          </p>

          <h1 className="font-serif text-5xl leading-[1.1] text-[#1A1A1A] mb-6 max-w-xs mx-auto">
            Where real connections begin
          </h1>

          <p className="text-base text-[#1A1A1A]/50 font-sans leading-relaxed max-w-xs mx-auto mb-10">
            A premium space to meet people who match your energy, interests, and ambitions.
          </p>

          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <Link to="/register">
              <motion.button
                whileTap={{ scale: 0.97 }}
                className="btn-primary w-full text-base"
              >
                Get started <ArrowRight size={16} />
              </motion.button>
            </Link>
            <Link to="/login">
              <motion.button
                whileTap={{ scale: 0.97 }}
                className="btn-outline w-full text-base"
              >
                Sign in
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="px-6 pb-12"
      >
        <div className="max-w-sm mx-auto space-y-3">
          {[
            { icon: Sparkles, label: 'Curated connect requests' },
            { icon: Shield, label: 'Private & secure by default' },
            { icon: Zap, label: 'Real-time messaging' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-black/3">
              <div className="w-8 h-8 rounded-xl bg-[#994EA8]/10 flex items-center justify-center">
                <Icon size={15} className="text-[#994EA8]" />
              </div>
              <span className="text-sm font-sans text-[#1A1A1A]/70">{label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
