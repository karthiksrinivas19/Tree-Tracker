"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, TreePine } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

function LoginPage({ onLogin = () => {} }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    onLogin(email, password);
    toast.success('Logging in...');
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: "url('/test1.jpg')",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <Toaster position="bottom-right" />

      <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/40 via-slate-900/50 to-black/60"></div>

      <div className="max-w-md w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12"
        >
          <div className="mb-10 text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 mb-6"
            >
              <TreePine size={32} className="text-emerald-600" strokeWidth={1.5} />
            </motion.div>
            <h1 className="text-4xl font-light text-slate-800 mb-3 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
              Sign in to continue your green journey
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="flex items-center text-sm font-medium text-slate-700 mb-2 gap-2">
                <Mail size={16} strokeWidth={2} />
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-slate-700 mb-2 gap-2">
                <Lock size={16} strokeWidth={2} />
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleSubmit}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-4 rounded-xl shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/30 transition-all text-sm tracking-wide flex items-center justify-center gap-2"
            >
              <LogIn size={18} strokeWidth={2} />
              Sign In
            </motion.button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-slate-500 text-sm">
              Don't have an account?{' '}
              <a href="/SignUp" className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
                Sign up
              </a>
            </p>
          </div>

          <div className="mt-6 text-center">
            <a href="/forgot-password" className="text-slate-400 hover:text-slate-600 text-xs transition-colors">
              Forgot password?
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default LoginPage;