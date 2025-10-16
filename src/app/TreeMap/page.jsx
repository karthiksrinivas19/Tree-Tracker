"use client";

import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, HeatmapLayer } from "@react-google-maps/api";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import { motion } from "framer-motion";
import { Map, Calendar, Loader2, TreePine } from "lucide-react";

const containerStyle = {
  width: "100%",
  height: "600px",
};

const defaultCenter = { lat: 20.5937, lng: 78.9629 };

export default function TreeMapTest() {
  const [allTrees, setAllTrees] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [heatmapInstance, setHeatmapInstance] = useState(null);

  useEffect(() => {
    const fetchAllTrees = async () => {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, "trees"));
        const data = snapshot.docs.map(doc => doc.data());
        setAllTrees(data);
      } catch (err) {
        console.error("Error fetching trees:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllTrees();
  }, []);

  const getHeatmapPoints = () => {
    const selectedYear = parseInt(year, 10);
    const filteredTrees = allTrees.filter(tree => {
      const treeYear = parseInt(tree.date?.substring(0, 4), 10);
      return treeYear <= selectedYear;
    });

    return filteredTrees
      .filter(tree => tree.location?.lat && tree.location?.lng)
      .map(tree => new window.google.maps.LatLng(tree.location.lat, tree.location.lng));
  };

  useEffect(() => {
    if (heatmapInstance) {
      const points = getHeatmapPoints();
      heatmapInstance.setData(points);
    }
  }, [year, allTrees]);

  const filteredCount = getHeatmapPoints().length;

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

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12"
        >
          {/* Header */}
          <div className="mb-8 text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 mb-6"
            >
              <Map size={32} className="text-emerald-600" strokeWidth={1.5} />
            </motion.div>
            <h1 className="text-4xl font-light text-slate-800 mb-3 tracking-tight">
              Tree Plantation Heatmap
            </h1>
            <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
              Visualize the impact of tree plantations across regions
            </p>
          </div>

          {/* Year Selector & Stats */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 bg-white rounded-xl border border-slate-200 px-4 py-3 shadow-sm">
              <Calendar size={20} className="text-emerald-600" strokeWidth={2} />
              <label className="text-sm font-medium text-slate-700">
                Select Year:
              </label>
              <input
                type="number"
                value={year}
                onChange={e => setYear(e.target.value)}
                min="2000"
                max="2030"
                className="w-24 px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
              />
            </div>

            <div className="flex items-center gap-4">
              {loading ? (
                <div className="flex items-center gap-2 text-emerald-600">
                  <Loader2 size={20} className="animate-spin" strokeWidth={2} />
                  <span className="text-sm font-medium">Loading trees...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-emerald-50 rounded-xl px-4 py-3 border border-emerald-100">
                  <TreePine size={20} className="text-emerald-600" strokeWidth={2} />
                  <span className="text-sm font-medium text-slate-700">
                    {filteredCount} Trees
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Map Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="rounded-2xl overflow-hidden shadow-xl border border-slate-200"
          >
            <LoadScript 
              googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} 
              libraries={["visualization"]}
            >
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={
                  allTrees.length > 0
                    ? { lat: allTrees[0].location.lat, lng: allTrees[0].location.lng }
                    : defaultCenter
                }
                zoom={allTrees.length > 0 ? 13 : 5}
                options={{
                  styles: [
                    {
                      featureType: "all",
                      elementType: "geometry",
                      stylers: [{ color: "#f5f5f5" }]
                    },
                    {
                      featureType: "water",
                      elementType: "geometry",
                      stylers: [{ color: "#e0f2f1" }]
                    }
                  ]
                }}
              >
                <HeatmapLayer
                  onLoad={instance => setHeatmapInstance(instance)}
                  data={getHeatmapPoints()}
                  options={{
                    gradient: [
                      "rgba(144,238,144,0)",
                      "rgba(144,238,144,1)",
                      "rgba(34,139,34,1)",
                      "rgba(0,100,0,1)",
                    ],
                    radius: 30,
                    opacity: 0.7,
                  }}
                />
              </GoogleMap>
            </LoadScript>
          </motion.div>

          {/* Legend */}
          <div className="mt-6 flex items-center justify-center gap-6">
            <div className="text-xs text-slate-500 font-medium">Density:</div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-3 rounded-full bg-gradient-to-r from-green-200 to-green-900"></div>
              <span className="text-xs text-slate-500">Low → High</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}