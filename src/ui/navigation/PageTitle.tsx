'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Libre_Baskerville } from 'next/font/google';

const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
});

interface PageTitleProps {
  title: string;
  content?: string;
  subtitle?: string;
  gradient?: string;
  icon?: React.ReactNode;
}

const PageTitle: React.FC<PageTitleProps> = ({ 
  title, 
  content, 
  subtitle, 
  gradient = "from-blue-600 to-purple-600",
  icon 
}) => {
  return (
    <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 pt-40 pb-16 overflow-hidden">
      {/* Éléments décoratifs de fond */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-purple-100 rounded-full blur-2xl opacity-40"></div>
        <div className="absolute bottom-20 left-1/3 w-20 h-20 bg-pink-100 rounded-full blur-xl opacity-50"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          
          {/* Icône ou badge */}
          {icon && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-6"
            >
              <div className={`bg-gradient-to-r ${gradient} p-4 rounded-2xl shadow-lg text-white`}>
                {icon}
              </div>
            </motion.div>
          )}

          {/* Sous-titre */}
          {subtitle && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full text-gray-700 text-sm font-medium mb-6 shadow-sm"
            >
              {subtitle}
            </motion.div>
          )}

          {/* Titre principal */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 ${libreBaskerville.className}`}
          >
            <span className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
              {title}
            </span>
          </motion.h1>

          {/* Contenu/Description */}
          {content && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="max-w-4xl mx-auto"
            >
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                {content}
              </p>
            </motion.div>
          )}

          {/* Ligne décorative */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 flex justify-center"
          >
            <div className={`h-1 w-24 bg-gradient-to-r ${gradient} rounded-full`}></div>
          </motion.div>

        </div>
      </div>

      {/* Vague décorative en bas */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-12 text-white"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  );
};

export default PageTitle; 