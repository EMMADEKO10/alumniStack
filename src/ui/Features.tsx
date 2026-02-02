'use client';

import { motion, AnimatePresence, Variants } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect, useCallback } from "react";
import { 
  FaUsers, 
  FaCalendarAlt, 
  FaBriefcase, 
  FaGraduationCap, 
  FaHandHoldingHeart, 
  FaNetworkWired,
  FaArrowRight,
  FaArrowLeft,
  FaBookOpen
} from "react-icons/fa";

const Features: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const features = [
    {
      icon: <FaUsers className="text-3xl md:text-4xl" />,
      title: "Réseau Alumni",
      description: "Connectez-vous avec plus de 100,000 anciens étudiants à travers le monde entier pour partager expertises et opportunités.",
      link: "/community",
      color: "from-blue-600 to-blue-800",
      image: "/lau/Auditoire_LAU.jpg"
    },
    {
      icon: <FaBriefcase className="text-3xl md:text-4xl" />,
      title: "Opportunités Carrière",
      description: "Accédez à un marché de l'emploi privilégié avec des offres exclusives partagées par les leaders de notre communauté.",
      link: "/opportunities", 
      color: "from-green-600 to-green-800",
      image: "/lau/communication_technologie_de_l_info.jpg"
    },
    {
      icon: <FaCalendarAlt className="text-3xl md:text-4xl" />,
      title: "Événements Prestige",
      description: "Participez à des sommets, des forums de networking et des galas de retrouvailles organisés dans les capitales mondiales.",
      link: "/events",
      color: "from-purple-600 to-purple-800", 
      image: "/lau/hiro_leadership_academy.jpg"
    },
    {
      icon: <FaGraduationCap className="text-3xl md:text-4xl" />,
      title: "Executive Education",
      description: "Développez votre leadership avec nos programmes certifiants conçus pour les cadres et entrepreneurs alumni.",
      link: "/formations",
      color: "from-orange-600 to-orange-800",
      image: "/lau/leadership_et_gouvernance.jpg"
    },
    {
      icon: <FaHandHoldingHeart className="text-3xl md:text-4xl" />,
      title: "Mécénat & Impact",
      description: "Soutenez le fonds de bourses d'excellence et financez les projets innovants portés par les futurs talents de la LAU.",
      link: "/donations",
      color: "from-red-600 to-red-800",
      image: "/lau/collation.jpg"
    },
    {
      icon: <FaBookOpen className="text-3xl md:text-4xl" />,
      title: "Chroniques de Succès",
      description: "Découvrez les parcours inspirants de nos diplômés qui redéfinissent le leadership dans leurs domaines respectifs.",
      link: "/stories",
      color: "from-indigo-600 to-indigo-800",
      image: "/lau/Etudiants_finalistes.jpg"
    }
  ];

  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection);
    setActiveIndex((prevIndex) => (prevIndex + newDirection + features.length) % features.length);
  }, [features.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 8000);
    return () => clearInterval(timer);
  }, [paginate]);

  const variants: Variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    })
  };

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#000_1px,transparent_1px)] bg-size-[40px_40px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 sm:mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 bg-red-50 text-red-700 rounded-lg text-[10px] sm:text-xs font-bold mb-6 border border-red-100 uppercase tracking-widest">
            <FaNetworkWired className="mr-2" />
            Écosystème LAU
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 mb-4 sm:mb-6 leading-tight px-4 sm:px-0">
            Une plateforme conçue pour votre <span className="bg-linear-to-r from-red-600 to-red-800 bg-clip-text text-transparent">ascension professionnelle</span>
          </h2>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative h-120 sm:h-137.5 md:h-150 w-full">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={activeIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 w-full h-full"
            >
              <div className="relative w-full h-full rounded-none overflow-hidden shadow-2xl border border-white/20">
                {/* Background Image with Overlay */}
                <Image
                  src={features[activeIndex].image}
                  alt={features[activeIndex].title}
                  fill
                  priority
                  className="object-cover transform scale-105 group-hover:scale-110 transition-transform duration-[10s]"
                />
                <div className="absolute inset-0 bg-linear-to-r from-slate-900 via-slate-900/80 to-transparent md:to-slate-900/20" />
                
                {/* Content Overlay */}
                <div className="absolute inset-0 flex items-center px-6 sm:px-12 md:px-20 lg:px-24">
                  <div className="max-w-2xl space-y-6 sm:space-y-8">
                    

                    <div className="space-y-4">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-linear-to-br ${features[activeIndex].color} text-white rounded-2xl flex items-center justify-center shadow-xl mb-4 sm:mb-6`}
                      >
                        <div className="scale-75 sm:scale-90 md:scale-100">
                          {features[activeIndex].icon}
                        </div>
                      </motion.div>
                      
                      <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-2xl sm:text-3xl lg:text-5xl text-white font-black leading-tight sm:leading-none"
                      >
                        {features[activeIndex].title}
                      </motion.h3>
                      
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-200 max-w-lg leading-relaxed"
                      >
                        {features[activeIndex].description}
                      </motion.p>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <Link
                        href={features[activeIndex].link}
                        className="inline-flex items-center gap-3 px-6 py-3.5 sm:px-8 sm:py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-red-600 hover:text-white transition-all duration-300 shadow-xl group/btn active:scale-95"
                      >
                        <span className="text-sm sm:text-base">Découvrir maintenant</span>
                        <FaArrowRight className="text-xs group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="absolute -bottom-16 left-0 right-0 flex items-center justify-between md:px-4">
            {/* Indicators */}
            <div className="flex gap-2">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > activeIndex ? 1 : -1);
                    setActiveIndex(index);
                  }}
                  className={`h-2.5 rounded-none transition-all duration-500 ${
                    index === activeIndex ? "w-12 bg-red-600" : "w-2.5 bg-slate-300 hover:bg-slate-400"
                  }`}
                  aria-label={`Aller à la slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex gap-4">
              <button
                onClick={() => paginate(-1)}
                className="w-14 h-14 rounded-none border-2 border-slate-200 flex items-center justify-center text-slate-600 hover:border-red-600 hover:text-red-600 hover:bg-red-50 transition-all duration-300 shadow-lg bg-white"
                aria-label="Slide précédente"
              >
                <FaArrowLeft />
              </button>
              <button
                onClick={() => paginate(1)}
                className="w-14 h-14 rounded-none bg-red-600 flex items-center justify-center text-white hover:bg-red-700 transition-all duration-300 shadow-xl shadow-red-500/20"
                aria-label="Slide suivante"
              >
                <FaArrowRight />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <div className="relative inline-block">
            <Link
              href="/register"
              className="inline-flex items-center px-10 py-4 bg-red-600 text-white font-black rounded-none shadow-2xl hover:bg-red-700 transform hover:scale-105 transition-all duration-500 uppercase tracking-widest text-sm md:text-base border-2 border-red-600"
            >
              S&apos;inscrire aujourd&apos;hui
              <FaArrowRight className="ml-3" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features; 
