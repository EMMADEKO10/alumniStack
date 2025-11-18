'use client';

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaUsers, FaMapMarkerAlt, FaClock, FaStar } from "react-icons/fa";
// import PageTitle from "../../ui/navigation/PageTitle";
import EventSection from "./EventSection";

const Page: React.FC = () => {
  const [stats, setStats] = useState({
    total: 0,
    types: {} as Record<string, number>,
    locations: 0,
    upcoming: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/events");
        if (response.ok) {
          const data = await response.json();
          const types = data.reduce((acc: Record<string, number>, event: { type: string }) => {
            acc[event.type] = (acc[event.type] || 0) + 1;
            return acc;
          }, {});
          
          const upcoming = data.filter((e: { date: string }) => new Date(e.date) > new Date()).length;
          
          setStats({
            total: data.length,
            types,
            locations: new Set(data.map((e: { location: string }) => e.location)).size,
            upcoming,
          });
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 -left-20 w-72 h-72 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-80 -right-20 w-96 h-96 bg-rose-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 left-1/2 w-80 h-80 bg-red-50 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Stats Cards - Mini Dashboard */}
      <div className="relative z-10 pt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md border border-red-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FaCalendarAlt className="text-red-600 text-xl" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-xs text-gray-600">Événements</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FaMapMarkerAlt className="text-blue-600 text-xl" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.locations}</p>
                  <p className="text-xs text-gray-600">Lieux</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md border border-green-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FaClock className="text-green-600 text-xl" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.upcoming}</p>
                  <p className="text-xs text-gray-600">À venir</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md border border-purple-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FaStar className="text-purple-600 text-xl" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{Object.keys(stats.types).length}</p>
                  <p className="text-xs text-gray-600">Catégories</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Header Section */}
      <div className="relative z-10 pt-4 sm:pt-6 lg:pt-8 pb-8 sm:pb-10 lg:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-4"
          >
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm border border-red-100 text-red-700 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-shadow">
              <FaCalendarAlt className="mr-2 text-red-600" />
              Événements Alumni
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-6"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Rejoignez
              <span className="block bg-gradient-to-r from-red-600 via-rose-600 to-red-500 bg-clip-text text-transparent mt-2">
                Nos Événements
              </span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
              Connectez-vous avec la communauté Alumni à travers des événements 
              enrichissants. Networking, formations, conférences et bien plus encore 
              pour développer votre réseau professionnel.
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mt-8"
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FaUsers className="text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Networking</h3>
                  <p className="text-sm text-gray-600">Rencontrez des professionnels et alumni</p>
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FaCalendarAlt className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Événements Variés</h3>
                  <p className="text-sm text-gray-600">Conférences, ateliers et formations</p>
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FaClock className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Inscriptions Faciles</h3>
                  <p className="text-sm text-gray-600">Réservez votre place en un clic</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Event Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="relative z-10"
      >
        <EventSection />
      </motion.div>
    </div>
  );
};

export default Page;