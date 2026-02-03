"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaLightbulb, FaBriefcase, FaMapMarkerAlt, FaClock, FaUsers } from "react-icons/fa";
import OpportunitySection from "./OpportunitySection";

const Page: React.FC = () => {
  const [stats, setStats] = useState({
    total: 0,
    types: {} as Record<string, number>,
    locations: 0,
    active: 0,
  });

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s pour les stats

    const fetchStats = async () => {
      try {
        const response = await fetch("/api/opportunities", { signal: controller.signal });

        if (response.ok) {
          const data = await response.json();
          const types = data.reduce((acc: Record<string, number>, opp: { type: string; isActive?: boolean }) => {
            acc[opp.type] = (acc[opp.type] || 0) + 1;
            return acc;
          }, {});
          
          setStats({
            total: data.length,
            types,
            locations: new Set(data.map((o: { location: string }) => o.location)).size,
            active: data.filter((o: { isActive?: boolean }) => o.isActive !== false).length,
          });
        }
      } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') {
          // Annulation silencieuse
        } else {
          console.error("Erreur lors de la récupération des statistiques", error);
        }
      } finally {
        clearTimeout(timeoutId);
      }
    };

    fetchStats();

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-red-50">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 -left-20 w-72 h-72 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-80 -right-20 w-96 h-96 bg-rose-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 left-1/2 w-80 h-80 bg-red-50 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header Section */}
      <div className="relative z-10 pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-10 lg:pb-12 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-4 sm:mb-6"
          >
            <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-white/80 backdrop-blur-sm border border-red-100 text-red-700 rounded-full text-xs sm:text-sm font-medium shadow-sm hover:shadow-md transition-shadow">
              <FaLightbulb className="mr-2 text-red-600 animate-pulse" />
              Opportunités Alumni
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6 sm:mb-10 text-center"
          >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
              Découvrez{" "}
              <span className="bg-linear-to-r from-red-600 via-rose-600 to-red-500 bg-clip-text text-transparent">
                Vos Opportunités
              </span>
            </h1>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto mt-6"
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3.5 sm:p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="p-2 sm:p-2.5 bg-red-100 rounded-lg shrink-0">
                  <FaBriefcase className="text-red-600 text-sm sm:text-base" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-0.5 sm:mb-1">Emplois Variés</h3>
                  <p className="text-[11px] sm:text-sm text-gray-600 leading-snug">CDI, CDD, stages et missions freelance</p>
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3.5 sm:p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="p-2 sm:p-2.5 bg-blue-100 rounded-lg shrink-0">
                  <FaMapMarkerAlt className="text-blue-600 text-sm sm:text-base" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-0.5 sm:mb-1">Partout en RDC</h3>
                  <p className="text-[11px] sm:text-sm text-gray-600 leading-snug">Opportunités dans toutes les régions</p>
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3.5 sm:p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow sm:col-span-2 md:col-span-1">
              <div className="flex items-start gap-3">
                <div className="p-2 sm:p-2.5 bg-green-100 rounded-lg shrink-0">
                  <FaClock className="text-green-600 text-sm sm:text-base" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-0.5 sm:mb-1">Mises à Jour</h3>
                  <p className="text-[11px] sm:text-sm text-gray-600 leading-snug">Nouvelles offres régulièrement ajoutées</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Opportunity Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="relative z-10"
      >
        <OpportunitySection />
      </motion.div>
    </div>
  );
};

export default Page;
