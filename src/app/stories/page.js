'use client';

import React, { useEffect, useMemo, useState } from "react";
import StoryCardTwo from "../../components/cards/StoryCardTwo";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaBookOpen, 
  FaUsers, 
  FaGraduationCap, 
  FaBriefcase, 
  FaHeart, 
  FaSearch, 
  FaStar,
  FaGlobe,
  FaChartLine,
  FaPencilAlt,
  FaFilter,
  FaTimes
} from "react-icons/fa";

// Les stories sont désormais chargées depuis l'API /api/stories

// Les catégories seront calculées dynamiquement dans le composant

const Page = () => {
  const [selectedCategory, setSelectedCategory] = useState("Toutes");
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

  const categories = useMemo(() => {
    return [
      { name: "Toutes", icon: <FaBookOpen />, count: stories.length },
      { name: "Entrepreneuriat", icon: <FaBriefcase />, count: stories.filter(s => s.category === "Entrepreneuriat").length },
      { name: "Leadership", icon: <FaUsers />, count: stories.filter(s => s.category === "Leadership").length },
      { name: "International", icon: <FaGraduationCap />, count: stories.filter(s => s.category === "International").length },
      { name: "Social", icon: <FaHeart />, count: stories.filter(s => s.category === "Social").length },
      { name: "Recherche", icon: <FaStar />, count: stories.filter(s => s.category === "Recherche").length },
    ];
  }, [stories]);

  const filteredStories = stories.filter(story => {
    const matchesCategory = selectedCategory === "Toutes" || story.category === selectedCategory;
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredStories = filteredStories.filter(story => story.featured);
  const regularStories = filteredStories.filter(story => !story.featured);

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
                  <FaBookOpen className="text-red-600 text-xl" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{loading ? '...' : stories.length}</p>
                  <p className="text-xs text-gray-600">Histoires</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FaStar className="text-blue-600 text-xl" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{loading ? '...' : featuredStories.length}</p>
                  <p className="text-xs text-gray-600">À la Une</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md border border-green-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FaUsers className="text-green-600 text-xl" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{loading ? '...' : categories.filter(c => c.count > 0).length - 1}</p>
                  <p className="text-xs text-gray-600">Catégories</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md border border-purple-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FaGraduationCap className="text-purple-600 text-xl" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">LAU</p>
                  <p className="text-xs text-gray-600">Alumni</p>
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
              <FaBookOpen className="mr-2 text-red-600" />
              Histoires Alumni
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
              Découvrez
              <span className="block bg-gradient-to-r from-red-600 via-rose-600 to-red-500 bg-clip-text text-transparent mt-2">
                Nos Histoires Inspirantes
              </span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
              Plongez dans les parcours exceptionnels de nos alumni qui transforment 
              le monde. Des récits inspirants d&apos;entrepreneuriat, de leadership et d&apos;impact social.
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
                  <h3 className="font-semibold text-gray-900 mb-1">Parcours Variés</h3>
                  <p className="text-sm text-gray-600">Entrepreneuriat, leadership et impact</p>
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FaGlobe className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Impact Global</h3>
                  <p className="text-sm text-gray-600">Alumni qui changent le monde</p>
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FaPencilAlt className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Récits Authentiques</h3>
                  <p className="text-sm text-gray-600">Histoires vraies et inspirantes</p>
                </div>
              </div>
            </div>
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

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mt-6">
              {categories.map((category, index) => (
                <motion.button
                  key={category.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 font-medium shadow-sm
                    ${selectedCategory === category.name
                      ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg transform scale-105"
                      : "bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 hover:scale-105 border border-gray-200"
                    }
                  `}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-sm">{category.icon}</span>
                  <span>{category.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    selectedCategory === category.name 
                      ? 'bg-white/20' 
                      : 'bg-gray-100'
                  }`}>
                    {category.count}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Active filters badges */}
            {(selectedCategory !== "Toutes" || searchTerm) && (
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-600 font-medium">Filtres actifs:</span>
                {selectedCategory !== "Toutes" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory("Toutes")} className="hover:text-red-900">
                      <FaTimes className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {searchTerm && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    &ldquo;{searchTerm}&rdquo;
                    <button onClick={() => setSearchTerm("")} className="hover:text-blue-900">
                      <FaTimes className="h-3 w-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("Toutes");
                  }}
                  className="text-sm text-red-600 hover:text-red-800 font-medium ml-2"
                >
                  Réinitialiser tout
                </button>
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
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full mb-4">
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
          {regularStories.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-10"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                {selectedCategory === "Toutes" ? "Toutes les Histoires" : `Histoires - ${selectedCategory}`}
              </h2>
              <p className="text-base text-gray-600">
                {regularStories.length} histoire{regularStories.length > 1 ? "s" : ""} {regularStories.length > 1 ? "trouvées" : "trouvée"}
              </p>
            </motion.div>
          )}

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
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
              <p className="text-gray-600">Chargement des histoires...</p>
            </div>
          ) : regularStories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {regularStories.map((story, index) => (
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
          ) : (
            filteredStories.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-16 bg-gradient-to-br from-gray-50 to-red-50 rounded-2xl border border-gray-200"
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
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-md hover:shadow-lg font-semibold"
                >
                  Réinitialiser les filtres
                </button>
              </motion.div>
            )
          )}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="relative z-10 py-16 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white overflow-hidden"
      >
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-20 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.6 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-6 border border-white/30"
          >
            <FaHeart className="text-2xl text-white" />
          </motion.div>

          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Votre Histoire Nous Inspire
          </h2>
          <p className="text-lg sm:text-xl text-red-100 mb-8 leading-relaxed max-w-2xl mx-auto">
            Vous êtes un alumni avec une histoire à partager ? Rejoignez notre 
            communauté et inspirez les futures générations.
          </p>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-red-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 inline-flex items-center gap-2"
          >
            <FaPencilAlt />
            Partager Mon Histoire
          </motion.button>
        </div>
      </motion.section>
    </div>
  );
};

export default Page;
