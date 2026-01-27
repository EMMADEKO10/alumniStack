'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaGraduationCap, FaUsers, FaCalendarAlt, FaBriefcase, FaArrowRight, FaPlay } from "react-icons/fa";

const Hero: React.FC = () => {
  const heroImages = [
    {
      src: "/lau/hiro-auditoire.jpg",
      alt: "Leadership Academia University - Auditoire",
    },
    {
      src: "/lau/hiro_leadership_academy.jpg",
      alt: "Leadership Academia University - Leadership Academy",
    },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <div className="relative min-h-screen flex items-center overflow-hidden pt-20 lg:pt-24">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        {heroImages.map((image, index) => (
          <motion.div
            key={image.src}
            className="absolute inset-0"
            animate={{ opacity: currentImageIndex === index ? 1 : 0 }}
            initial={false}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </motion.div>
        ))}
        <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/65 to-red-900/45"></div>
        {/* Overlay supplémentaire pour le header transparent */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-linear-to-b from-black/30 to-transparent"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 right-20 w-32 h-32 border border-white/20 rounded-full"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-32 left-20 w-24 h-24 border border-red-500/30 rounded-full"
          animate={{
            y: [0, 20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Content */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-4 py-2.5 bg-red-600/20 backdrop-blur-sm border border-red-500/30 rounded-full text-red-100"
          >
            <FaGraduationCap className="mr-2 text-base" />
            <span className="text-sm font-medium tracking-tight">Réseau Alumni Leadership Academia (LAU)</span>
          </motion.div>

          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
              Rejoignez une
              <span className="block bg-linear-to-r from-red-400 to-red-600 bg-clip-text text-transparent mt-2">
                communauté
              </span>
              d&apos;exception
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-gray-200 leading-relaxed max-w-2xl font-normal">
              Connectez-vous avec plus de <strong className="text-white font-semibold">20,000 alumni</strong> 
              {' '}à travers le monde. Développez votre carrière, créez des partenariats et 
              contribuez à l&apos;évolution de votre alma mater.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2"
          >
            <Link
              href="/register"
              className="group inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 bg-linear-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl shadow-lg hover:from-red-700 hover:to-red-800 transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
            >
              Faire un don
              <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <button className="group inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 border-2 border-white/30 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/10 hover:border-white/50 transition-all duration-300 text-sm sm:text-base">
              <FaPlay className="mr-2 group-hover:scale-110 transition-transform" />
              Faire un don
            </button>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="hidden sm:flex items-center space-x-4 sm:space-x-6 text-gray-300 text-xs sm:text-sm"
          >
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white bg-linear-to-br from-red-400 to-red-600"
                />
              ))}
            </div>
            <span className="text-sm">
              {/* <strong className="text-white"></strong> nouveaux membres ce mois */}
            </span>
          </motion.div>
        </div>

        {/* Right Stats Cards */}
        <div className="hidden md:block md:col-span-5 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 gap-4"
          >
            
            {/* Alumni Count */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center">
              <FaUsers className="text-3xl text-red-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white"></div>
              <div className="text-sm text-gray-300">Alumni connectés</div>
            </div>

            {/* Countries */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center">
              <div className="text-2xl mb-3">🌍</div>
              <div className="text-3xl font-bold text-white"></div>
              <div className="text-sm text-gray-300">Pays représentés</div>
            </div>

            {/* Events */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center">
              <FaCalendarAlt className="text-3xl text-red-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white"></div>
              <div className="text-sm text-gray-300">Événements/an</div>
            </div>

            {/* Job Opportunities */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center">
              <FaBriefcase className="text-3xl text-red-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white">.</div>
              <div className="text-sm text-gray-300">Opportunités</div>
            </div>
          </motion.div>

          {/* Success Story Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6"
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-bold">
                AM
              </div>
              <div className="flex-1">
                                 <p className="text-gray-200 text-sm mb-2">
                   &ldquo;Grâce au réseau LAU, j&apos;ai créé 
                   des partenariats durables.&rdquo;
                 </p>
                <div className="text-white font-semibold text-sm">Stephane Kalenga</div>
                <div className="text-gray-400 text-xs">CEO, Economie • Promo 2025</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero; 
