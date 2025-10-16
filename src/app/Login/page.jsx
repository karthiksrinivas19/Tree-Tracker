'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, TreePine } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { auth } from '../../firebase'; // make sure path is correct
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Logged in successfully!');
    } catch (err) {
      toast.error(err.message);
    }
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
          {/* ... rest of your JSX stays the same ... */}
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
                onChange={(e) => setEmail(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
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
          {/* ... rest of your JSX stays the same ... */}
        </motion.div>
      </div>
    </div>
  );
}
