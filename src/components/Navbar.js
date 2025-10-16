"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TreePine, Map, Home, Info, Menu, X, Leaf } from "lucide-react";
import Link from "next/link";
import { User, Trophy } from "lucide-react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Heatmap", href: "/TreeMap", icon: Map },
    { name: "User Dashboard", href: "/UserDashboard", icon: Info },
    { name: "Leaderboard", href: "/leaderboard", icon: Info },
  ];
  // Use User and Trophy icons for User Dashboard and Leaderboard
  navItems[2].icon = User;
  navItems[3].icon = Trophy;
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md shadow-lg border-b border-emerald-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-md"
            >
              <Leaf className="text-white" size={20} strokeWidth={2.5} />
            </motion.div>
            <span className="text-xl font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors">
              Plant<span className="text-emerald-600">Tree</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <Link key={item.name} href={item.href}>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                  className="relative px-4 py-2 rounded-lg group cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-slate-700 group-hover:text-emerald-600 transition-colors">
                    <item.icon size={18} strokeWidth={2} />
                    <span className="font-medium text-sm">{item.name}</span>
                  </div>
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </Link>
            ))}
          </div>

          {/* CTA Button (Desktop) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="hidden md:block"
          >
            <Link href="/addTree">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-shadow flex items-center gap-2"
              >
                <TreePine size={18} strokeWidth={2} />
                Plant Now
              </motion.button>
            </Link>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-emerald-50 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X size={24} strokeWidth={2} />
            ) : (
              <Menu size={24} strokeWidth={2} />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-white border-t border-emerald-100"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item, index) => (
                <Link key={item.name} href={item.href}>
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors cursor-pointer"
                  >
                    <item.icon size={20} strokeWidth={2} />
                    <span className="font-medium">{item.name}</span>
                  </motion.div>
                </Link>
              ))}
              <Link href="/addTree">
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full mt-4 px-5 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-medium shadow-md flex items-center justify-center gap-2"
                >
                  <TreePine size={20} strokeWidth={2} />
                  Plant Now
                </motion.button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
