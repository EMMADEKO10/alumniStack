"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaGraduationCap } from "react-icons/fa";
// import PageTitle from "../../ui/navigation/PageTitle";
import FormationSection from "./FormationSection";

const Page: React.FC = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-red-50">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 -left-20 w-72 h-72 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div
          className="absolute top-80 -right-20 w-96 h-96 bg-rose-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-40 left-1/2 w-80 h-80 bg-red-50 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Header Section */}
      <div className="relative z-10 pt-16 sm:pt-20 lg:pt-24 pb-6 lg:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-4"
          >
            <div className="inline-flex items-center px-3 py-1.5 bg-white/80 backdrop-blur-sm border border-red-100 text-red-700 rounded-full text-[10px] sm:text-xs font-semibold shadow-md uppercase tracking-wider">
              <FaGraduationCap className="mr-2 text-red-600" />
              Formations Alumni
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-6"
          >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
              Les{" "}
              <span className="bg-linear-to-r from-red-600 via-rose-600 to-red-500 bg-clip-text text-transparent">
                Formations
              </span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
              Nous vous proposons plusieurs formations pour vous aider à développer
              vos compétences et atteindre vos objectifs professionnels.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Formation Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="relative z-10"
      >
        <FormationSection />
      </motion.div>
    </div>
  );
};

export default Page;
