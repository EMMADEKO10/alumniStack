'use client';

import React from "react";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaUsers, FaClock } from "react-icons/fa";
// import PageTitle from "../../ui/navigation/PageTitle";
import EventSection from "./EventSection";

const Page: React.FC = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-red-50">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 -left-20 w-72 h-72 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-80 -right-20 w-96 h-96 bg-rose-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 left-1/2 w-80 h-80 bg-red-50 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header Section */}
      <div className="relative z-10 pt-32 sm:pt-40 lg:pt-48 pb-8 sm:pb-10 lg:pb-12 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-4"
          >
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm border border-red-100 text-red-700 rounded-full text-xs sm:text-sm font-medium shadow-md hover:shadow-lg transition-shadow">
              <FaCalendarAlt className="mr-2 text-red-600" />
              Événements Alumni
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
              Rejoignez{" "}
              <span className="bg-linear-to-r from-red-600 via-rose-600 to-red-500 bg-clip-text text-transparent">
                Nos Événements
              </span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
              Connectez-vous avec la communauté Alumni à travers des événements 
              enrichissants. Networking, conférences et bien plus encore 
              pour développer votre réseau professionnel.
            </p>
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
