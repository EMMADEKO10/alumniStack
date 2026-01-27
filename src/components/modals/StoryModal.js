'use client';

import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaUser, FaClock, FaCalendarAlt, FaShare, FaHeart, FaBookOpen } from "react-icons/fa";
import Image from "next/image";
// Removed Libre_Baskerville import - using default sans-serif fonts

// Removed Libre_Baskerville configuration

const StoryModal = ({ isOpen, onClose, story }) => {
  if (!story) return null;

  const getCategoryColor = (category) => {
    const colors = {
      "Entrepreneuriat": "bg-purple-500",
      "Leadership": "bg-blue-500", 
      "International": "bg-green-500",
      "Social": "bg-pink-500",
      "Recherche": "bg-orange-500",
      "Default": "bg-gray-500"
    };
    return colors[category] || colors["Default"];
  };

  const getCategoryIcon = (category) => {
    const icons = {
      "Entrepreneuriat": "🚀",
      "Leadership": "👑",
      "International": "🌍",
      "Social": "❤️",
      "Recherche": "🔬",
      "Default": "📖"
    };
    return icons[category] || icons["Default"];
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header avec image */}
            <div className="relative h-64 md:h-80 overflow-hidden">
              <Image
                src={story.image}
                alt={story.title}
                fill
                className="object-cover"
                priority
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
              
              {/* Close button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-6 right-6 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300"
              >
                <FaTimes className="text-lg" />
              </motion.button>

              {/* Category badge */}
              <div className="absolute top-6 left-6">
                <div className={`${getCategoryColor(story.category)} text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 shadow-lg backdrop-blur-sm`}>
                  <span>{getCategoryIcon(story.category)}</span>
                  <span>{story.category}</span>
                </div>
              </div>

              {/* Title overlay */}
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl md:text-4xl font-bold mb-4 leading-tight font-sans"
                >
                  {story.title}
                </motion.h1>
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap items-center gap-4 text-sm"
                >
                  <div className="flex items-center space-x-2">
                    <FaUser className="text-xs" />
                    <span>{story.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaCalendarAlt className="text-xs" />
                    <span>{story.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaClock className="text-xs" />
                    <span>{story.readTime}</span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Content scrollable */}
            <div className="max-h-[calc(90vh-20rem)] overflow-y-auto">
              <div className="p-8">
                {/* Story content */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="prose prose-lg max-w-none"
                >
                  {/* Summary */}
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
                    <h3 className="text-xl font-bold text-blue-900 mb-3 flex items-center">
                      <FaBookOpen className="mr-2" />
                      Résumé
                    </h3>
                    <p className="text-blue-800 leading-relaxed">
                      {story.description}
                    </p>
                  </div>

                  {/* Full story content */}
                  <div className="space-y-6 text-gray-700 leading-relaxed">
                    {story.fullContent ? (
                      <div dangerouslySetInnerHTML={{ __html: story.fullContent }} />
                    ) : (
                      <>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Le Parcours</h3>
                        <p className="text-lg">
                          {story.description}
                        </p>
                        
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Les Défis Surmontés</h3>
                        <p className="text-lg">
                          Comme beaucoup d&apos;alumni de Leadership AcademiaUniversity (LAU), {story.author} a dû faire face à de nombreux défis. 
                          Grâce à la formation solide reçue et à une détermination sans faille, chaque obstacle est devenu 
                          une opportunité d&apos;apprentissage et de croissance.
                        </p>
                        
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Les Réalisations</h3>
                        <p className="text-lg">
                          Aujourd&apos;hui, {story.author} est un exemple inspirant pour les futurs diplômés. 
                          Son parcours démontre que avec de la passion, du travail acharné et les bonnes compétences, 
                          il est possible de transformer ses rêves en réalité et d&apos;avoir un impact positif sur la société.
                        </p>
                        
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Message aux Futurs Alumni</h3>
                        <blockquote className="border-l-4 border-blue-500 pl-6 italic text-xl text-blue-800 bg-blue-50 p-4 rounded-r-lg">
                          &quot;N&apos;ayez pas peur de rêver grand. Leadership AcademiaUniversity (LAU) vous donne les outils, 
                          mais c&apos;est votre détermination qui fera la différence. Chaque défi est une opportunité 
                          de grandir et d&apos;apprendre.&quot;
                        </blockquote>
                      </>
                    )}
                  </div>
                </motion.div>

                {/* Action buttons */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-gray-200"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-300"
                  >
                    <FaHeart className="text-sm" />
                    <span>J&apos;aime cette histoire</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-300"
                  >
                    <FaShare className="text-sm" />
                    <span>Partager</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-300"
                  >
                    <span>Fermer</span>
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StoryModal; 
