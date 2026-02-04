'use client';

import React, { useEffect, useState } from "react";
import StoryCardTwo from "../../components/cards/StoryCardTwo";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaBookOpen, 
  FaSearch, 
  FaStar,
  FaPencilAlt,
  FaFilter,
  FaTimes
} from "react-icons/fa";

// Les stories sont désormais chargées depuis l'API /api/stories

// Les catégories seront calculées dynamiquement dans le composant

const Page = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStories = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch('/api/stories', { cache: 'no-store' });
        if (!res.ok) {
          throw new Error('Échec du chargement des histoires');
        }
        const data = await res.json();
        // Normalisation basique pour compatibilité avec StoryCardTwo
        const normalized = (Array.isArray(data) ? data : []).map((s, idx) => ({
          id: s._id || idx,
          title: s.title || '',
          description: s.description || '',
          date: s.date || '',
          image: s.image || '/graduation.jpg',
          category: s.category || 'Autres',
          featured: Boolean(s.featured),
          readTime: s.readTime || '',
          author: s.author || 'Anonyme',
        }));
        setStories(normalized);
      } catch (e) {
        setError(e.message || 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };
    loadStories();
  }, []);

  const filteredStories = stories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const featuredStories = filteredStories.filter(story => story.featured);
  const regularStories = filteredStories.filter(story => !story.featured);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-cyan-50/30">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 -left-20 w-72 h-72 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-80 -right-20 w-96 h-96 bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 left-1/2 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header Section */}
      <div className="relative z-10 pt-32 sm:pt-40 lg:pt-48 pb-8 sm:pb-10 lg:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-4"
          >
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm border border-red-100 text-red-700 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-shadow">
              <FaBookOpen className="mr-2 text-red-600" />
              Histoires Alumni
            </div>
          </motion.div>

          {/* Title with Share Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-6"
          >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Découvrez{" "}
              <span className="bg-linear-to-r from-red-600 via-rose-600 to-red-500 bg-clip-text text-transparent">
                Nos Histoires Inspirantes
              </span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed px-4 mb-6">
              Plongez dans les parcours exceptionnels de nos alumni qui transforment 
              le monde. Des récits inspirants d&apos;entrepreneuriat, de leadership et d&apos;impact social.
            </p>
            
            {/* Bouton Partager votre histoire */}
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-red-700 transition-all"
            >
              <FaPencilAlt />
              Partagez votre histoire
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <motion.section
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative z-10 py-8"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher une histoire..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  suppressHydrationWarning
                  className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 shadow-sm"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>

              {/* Results count */}
              <div className="flex items-center gap-2">
                <FaFilter className="text-gray-500" />
                <span className="text-sm text-gray-600 font-medium">
                  {filteredStories.length} résultat{filteredStories.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Active filters badges */}
            {searchTerm && (
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-600 font-medium">Recherche:</span>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                  &ldquo;{searchTerm}&rdquo;
                  <button onClick={() => setSearchTerm("")} className="hover:text-red-900">
                    <FaTimes className="h-3 w-3" />
                  </button>
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.section>

      {/* Featured Stories */}
      {featuredStories.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-10 py-12"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-10"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-yellow-100 to-orange-100 rounded-full mb-4">
                <FaStar className="text-yellow-600" />
                <span className="text-sm font-semibold text-gray-800">À la Une</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                Histoires Vedettes
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                Les parcours les plus inspirants de nos alumni qui marquent leur époque
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {featuredStories.map((story, index) => (
                  <motion.div
                    key={story.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                    className="group"
                  >
                    <StoryCardTwo
                      id={story.id}
                      title={story.title}
                      description={story.description}
                      date={story.date}
                      image={story.image}
                      category={story.category}
                      featured={story.featured}
                      readTime={story.readTime}
                      author={story.author}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.section>
      )}

      {/* All Stories */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative z-10 py-12 pb-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center bg-red-50 border border-red-200 rounded-xl p-6 text-red-600"
            >
              {error}
            </motion.div>
          )}

          {loading ? (
            <div className="py-8">
              {/* Skeleton Statistiques */}
              <div className="bg-linear-to-r from-red-50 to-rose-50 rounded-xl p-6 border border-red-100 mb-8 animate-pulse">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="text-center">
                      <div className="h-10 w-16 bg-gray-200 rounded mx-auto mb-2"></div>
                      <div className="h-4 w-24 bg-gray-200 rounded mx-auto"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skeleton Featured Story */}
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 mb-8 animate-pulse">
                <div className="h-96 bg-gray-200"></div>
                <div className="p-8">
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>

              {/* Skeleton Cartes d'histoires */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-6">
                      <div className="h-6 w-20 bg-gray-200 rounded-full mb-3"></div>
                      <div className="h-6 bg-gray-200 rounded mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : regularStories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularStories.map((story) => (
                <div key={story.id}>
                  <StoryCardTwo
                    id={story.id}
                    title={story.title}
                    description={story.description}
                    date={story.date}
                    image={story.image}
                    category={story.category}
                    featured={story.featured}
                    readTime={story.readTime}
                    author={story.author}
                  />
                </div>
              ))}
            </div>
          ) : (
            filteredStories.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-16 bg-linear-to-br from-gray-50 to-red-50 rounded-2xl border border-gray-200"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6 shadow-md">
                  <FaSearch className="text-3xl text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Aucune histoire trouvée</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Essayez de modifier vos critères de recherche ou explorez d&apos;autres catégories.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("Toutes");
                  }}
                  className="bg-linear-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-md hover:shadow-lg font-semibold"
                >
                  Réinitialiser les filtres
                </button>
              </motion.div>
            )
          )}
        </div>
      </motion.section>

     
    </div>
  );
};

export default Page;
