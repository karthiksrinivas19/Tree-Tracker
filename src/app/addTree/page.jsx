"use client";

import React, { useState, useEffect } from "react";
import { auth, db, storage } from "../../../firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import crypto from "crypto";
import { motion, AnimatePresence } from "framer-motion";
import { treeImpactData } from "./../data/TreeImpact";
import { TreePine, Calendar, Camera, Leaf, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function AddTree() {
  const [user, setUser] = useState(null);
  const [species, setSpecies] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [impact, setImpact] = useState(null);
  const [showImpact, setShowImpact] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) router.push("/Login");
      else setUser(currentUser);
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) =>
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }),
        (err) => {
          console.error("Error getting location:", err);
          toast.error("Please allow location access.");
        }
      );
    } else {
      toast.error("Geolocation not supported by your browser.");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return toast.error("Please upload a photo!");
    if (!user) return toast.error("User not logged in");
    if (!location.lat || !location.lng)
      return toast.error("Location not captured yet");
    if (!species) return toast.error("Select a tree species!");
    if (!date) return toast.error("Select a planting date!");

    try {
      const arrayBuffer = await image.arrayBuffer();
      const hash = crypto
        .createHash("sha256")
        .update(Buffer.from(arrayBuffer))
        .digest("hex");

      const q = query(collection(db, "trees"), where("hash", "==", hash));
      const snapshot = await getDocs(q);
      if (!snapshot.empty)
        return toast.error("Duplicate image detected! Already submitted.");

      const imageRef = ref(storage, `trees/${Date.now()}_${image.name}`);
      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef);

      const visionRes = await fetch("/api/verifyTree", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });

      const visionData = await visionRes.json();

      // FIXED: Only check the API response, no duplicate validation
      if (!visionData.success) {
        return toast.error(visionData.message || "Invalid image. Please upload a tree/plant photo.");
      }

      await addDoc(collection(db, "trees"), {
        species,
        date,
        imageUrl,
        userId: user.uid,
        userEmail: user.email,
        location,
        hash,
        createdAt: new Date(),
      });

      const selectedTree = treeImpactData.find((t) => t.species === species);
      setImpact(selectedTree || null);
      setShowImpact(true);

      toast.success("Tree added successfully!");
      setSpecies("");
      setDate("");
      setImage(null);
    } catch (err) {
      console.error("Error adding tree:", err);
      toast.error("Failed to add tree: " + err.message);
    }
  };

  if (!user)
    return <p className="text-center mt-32 text-gray-600">Loading...</p>;

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

      <div className="max-w-2xl w-full relative z-10">
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
              Plant a Tree
            </h1>
            <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
              Document your contribution to a greener future. Every tree counts.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="flex items-center text-sm font-medium text-slate-700 mb-2 gap-2">
                <TreePine size={16} strokeWidth={2} />
                Species
              </label>
              <select
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
              >
                <option value="">Select a species</option>
                {treeImpactData.map((t) => (
                  <option key={t.species} value={t.species}>
                    {t.species}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-slate-700 mb-2 gap-2">
                <Calendar size={16} strokeWidth={2} />
                Planting Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-slate-700 mb-2 gap-2">
                <Camera size={16} strokeWidth={2} />
                Photo
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 file:cursor-pointer"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-4 rounded-xl shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/30 transition-all text-sm tracking-wide"
            >
              Submit Contribution
            </motion.button>
          </form>
        </motion.div>
      </div>

      <AnimatePresence>
        {showImpact && impact && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 120 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 relative"
            >
              <button
                onClick={() => setShowImpact(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>

              <h2 className="text-xl font-semibold text-emerald-700 mb-4 flex items-center gap-2">
                <Leaf size={20} /> Environmental Impact
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-700">
                    {impact.carbonSequestration} kg
                  </div>
                  <div className="text-xs text-gray-600">CO₂/year</div>
                </div>

                <div className="bg-sky-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-sky-700">
                    {impact.oxygenProduction} kg
                  </div>
                  <div className="text-xs text-gray-600">O₂/year</div>
                </div>

                <div className="bg-amber-50 rounded-xl p-4 text-center">
                  <div className="text-xl font-bold text-amber-700">{impact.shade}</div>
                  <div className="text-xs text-gray-600">Shade Coverage</div>
                </div>

                <div className="bg-violet-50 rounded-xl p-4 text-center">
                  <div className="text-xl font-bold text-violet-700">{impact.wildlifeSupport}</div>
                  <div className="text-xs text-gray-600">Wildlife Support</div>
                </div>
              </div>

              <p className="mt-4 text-center text-gray-700 text-sm">
                Over the next decade, this tree will sequester{" "}
                <span className="font-semibold">
                  {impact.carbonSequestration * 10} kg CO₂
                </span> and contribute to a greener environment.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}