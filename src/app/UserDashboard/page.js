"use client";

import React, { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Leaf, Trophy, CalendarDays, MapPin, User } from "lucide-react";

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [trees, setTrees] = useState([]);
  const [stats, setStats] = useState({ total: 0, co2: 0, firstDate: null });
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) router.push("/Login");
      else {
        setUser(currentUser);
        fetchUserTrees(currentUser.email);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchUserTrees = async (email) => {
    const q = query(collection(db, "trees"), where("userEmail", "==", email));
    const snap = await getDocs(q);
    const userTrees = snap.docs.map((doc) => doc.data());
    if (userTrees.length) {
      const firstDate = userTrees.reduce((a, b) =>
        new Date(a.date) < new Date(b.date) ? a : b
      ).date;
      setTrees(userTrees);
      setStats({
        total: userTrees.length,
        co2: userTrees.length * 21,
        firstDate,
      });
    }
  };

  if (!user) 
    return <p className="text-center mt-32 text-gray-600">Loading...</p>;

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center p-4 md:p-8 relative"
      style={{
        backgroundImage: "url('/test1.jpg')",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/40 via-slate-900/50 to-black/60"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12"
        >
          {/* Header Section */}
          <div className="mb-10 text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 mb-6"
            >
              <User size={32} className="text-emerald-600" strokeWidth={1.5} />
            </motion.div>
            <h1 className="text-4xl font-light text-slate-800 mb-3 tracking-tight">
              {user.displayName || "Your"} Dashboard
            </h1>
            <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
              {user.email}
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              className="bg-emerald-50 rounded-2xl p-6 shadow-sm border border-emerald-100/50"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 mb-4">
                <Leaf size={24} className="text-emerald-600" strokeWidth={2} />
              </div>
              <h2 className="text-3xl font-light text-emerald-700 mb-1">
                {stats.total}
              </h2>
              <p className="text-slate-600 text-sm tracking-wide">Trees Planted</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              className="bg-amber-50 rounded-2xl p-6 shadow-sm border border-amber-100/50"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 mb-4">
                <Trophy size={24} className="text-amber-600" strokeWidth={2} />
              </div>
              <h2 className="text-3xl font-light text-amber-700 mb-1">
                {stats.co2} kg
              </h2>
              <p className="text-slate-600 text-sm tracking-wide">CO₂ Offset/Year</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
              className="bg-sky-50 rounded-2xl p-6 shadow-sm border border-sky-100/50"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-sky-100 mb-4">
                <CalendarDays size={24} className="text-sky-600" strokeWidth={2} />
              </div>
              <h2 className="text-lg font-light text-sky-700 mb-1">
                {stats.firstDate ? new Date(stats.firstDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "—"}
              </h2>
              <p className="text-slate-600 text-sm tracking-wide">First Planted</p>
            </motion.div>
          </div>

          {/* Recent Trees Section */}
          <div className="mb-4">
            <h3 className="text-xl font-light text-slate-800 mb-6 tracking-tight">
              Recent Contributions
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {trees.slice(-4).reverse().map((tree, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="rounded-2xl bg-white shadow-md border border-slate-100 overflow-hidden group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={tree.imageUrl}
                    alt="tree"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>
                <div className="p-5">
                  <h4 className="text-lg font-medium text-slate-800 mb-2">
                    {tree.species}
                  </h4>
                  <div className="flex items-center text-sm text-slate-500 mb-2 gap-1">
                    <CalendarDays size={14} strokeWidth={2} />
                    <span>{new Date(tree.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  {tree.location?.lat && tree.location?.lng && (
                    <div className="flex items-center text-xs text-slate-400 gap-1">
                      <MapPin size={12} strokeWidth={2} />
                      <span>
                        {tree.location.lat.toFixed(3)}, {tree.location.lng.toFixed(3)}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {trees.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                <Leaf size={32} className="text-slate-400" strokeWidth={1.5} />
              </div>
              <p className="text-slate-500 text-sm">
                No trees planted yet. Start your green journey today!
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}