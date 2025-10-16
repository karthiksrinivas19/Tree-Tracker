"use client";

import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import { Leaf, Trophy } from "lucide-react";

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      const snap = await getDocs(collection(db, "trees"));
      const allTrees = snap.docs.map(doc => doc.data());

      // Count trees per user
      const userStats = {};
      allTrees.forEach(tree => {
        const email = tree.userEmail;
        if (!userStats[email]) userStats[email] = { count: 0, co2: 0 };
        userStats[email].count += 1;
        userStats[email].co2 += 21; // average 21 kg CO₂ per tree
      });

      // Convert to array & sort
      const leaderboardArray = Object.keys(userStats)
        .map(email => ({
          email,
          count: userStats[email].count,
          co2: userStats[email].co2,
        }))
        .sort((a, b) => b.count - a.count);

      setLeaders(leaderboardArray);
      setLoading(false);
    };

    fetchLeaderboard();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading leaderboard...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-8"
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-green-700">
          🏆 Tree Planters Leaderboard
        </h1>

        {leaders.length === 0 ? (
          <p className="text-center text-gray-600">No data yet</p>
        ) : (
          <div className="space-y-3">
            {leaders.map((user, index) => (
              <motion.div
                key={user.email}
                whileHover={{ scale: 1.02 }}
                className={`flex justify-between items-center p-4 rounded-xl shadow-md ${
                  index === 0
                    ? "bg-yellow-100 border-2 border-yellow-400"
                    : "bg-green-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  {index === 0 ? (
                    <Trophy className="text-yellow-500" />
                  ) : (
                    <Leaf className="text-green-600" />
                  )}
                  <div>
                    <p className="font-semibold text-green-800">
                      {user.email.split("@")[0]}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user.co2} kg CO₂ Offset
                    </p>
                  </div>
                </div>
                <p className="text-lg font-bold text-green-700">
                  {user.count} 🌳
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
