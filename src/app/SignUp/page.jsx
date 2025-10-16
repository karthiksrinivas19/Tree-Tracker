"use client";

import React, { useState } from "react";
import { auth, db } from "../../../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { UserPlus, Mail, Lock, User, TreePine } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(auth.currentUser, {
        displayName: name,
      });

      await setDoc(doc(db, "users", userCredential.user.uid), {
        name,
        email,
        createdAt: new Date(),
      });

      toast.success("Sign up successful! Welcome aboard!");
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        toast.error("This email is already registered");
      } else if (err.code === "auth/weak-password") {
        toast.error("Password is too weak");
      } else {
        toast.error(err.message || "Sign up failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
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
              Join Us
            </h1>
            <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
              Start your journey towards a greener planet
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="flex items-center text-sm font-medium text-slate-700 mb-2 gap-2">
                <User size={16} strokeWidth={2} />
                Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>

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
                placeholder="Create a password (min. 6 characters)"
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleSignup}
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 disabled:cursor-not-allowed text-white font-medium py-4 rounded-xl shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/30 transition-all text-sm tracking-wide flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus size={18} strokeWidth={2} />
                  Create Account
                </>
              )}
            </motion.button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-slate-500 text-sm">
              Already have an account?{' '}
              <a href="/Login" className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
                Sign in
              </a>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-400 text-center leading-relaxed">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}