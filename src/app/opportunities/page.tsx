"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaLightbulb } from "react-icons/fa";
import OpportunitySection from "./OpportunitySection";

const Page: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 -left-20 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-80 -right-20 w-96 h-96 bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 left-1/2 w-80 h-80 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header Section */}
      <div className="relative z-10 pt-8 sm:pt-10 lg:pt-12 pb-8 sm:pb-10 lg:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-4"
          >
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm border border-blue-100 text-blue-700 rounded-full text-sm font-medium shadow-md">
              <FaLightbulb className="mr-2 text-blue-600" />
              Opportunités Alumni
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
              Les
              <span className="block bg-gradient-to-r from-blue-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent mt-2">
                Opportunités
              </span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
              Quelle que soit l&apos;étape de votre carrière dans laquelle vous vous trouvez, Leadership Academy Alumni Association a des ressources pour vous. Des services à l&apos;échelle de l&apos;université et spécifiques à l&apos;école aux informations sur les événements de réseautage et les webinaires en ligne, nous avons compilé certaines des meilleures ressources et services liés à la carrière.
            </p>
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