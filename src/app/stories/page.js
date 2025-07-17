'use client';

import React, { useState } from "react";
import PageTitle from "../../ui/navigation/PageTitle";
import { Libre_Baskerville } from "next/font/google";
import StoryCard from "../../components/cards/StoryCard";
import StoryCardTwo from "../../components/cards/StoryCardTwo";
import { motion, AnimatePresence } from "framer-motion";
import { FaBookOpen, FaUsers, FaGraduationCap, FaBriefcase, FaHeart, FaSearch, FaFilter, FaStar, FaCalendarAlt, FaUser } from "react-icons/fa";

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const stories = [
  {
    id: 1,
    title: "Histoire de réussite : Jean Kazunga",
    description:
     "Après avoir obtenu son diplôme en ingénierie informatique à Legacy University, Jean Kazunga a fondé sa propre start-up technologique. Grâce aux compétences et aux connaissances acquises pendant ses études, il a réussi à développer une entreprise prospère qui révolutionne l'industrie de la technologie.",
    date: "5 mars 2023",
    image: "/graduation.jpg",
    category: "Entrepreneuriat",
    featured: true,
    readTime: "5 min",
    author: "Jean Kazunga"
  },
  {
    id: 2,
    title: "Une Histoire inspirante : Olga Mujinga",
    description:
      "Olga Mujinga, diplômée en administration des affaires de Legacy University, a surmonté de nombreux obstacles pour atteindre le succès. Malgré des débuts modestes, elle a utilisé les compétences en leadership et en gestion qu'elle a acquises à l'université pour gravir les échelons et devenir PDG d'une grande entreprise internationale.",
    date: "12 Avril 2023",
    image: "/graduation.jpg",
    category: "Leadership",
    featured: true,
    readTime: "7 min",
    author: "Olga Mujinga"
  },
  {
    id: 3,
    title: "Histoire de carrière internationale : David Muyumba",
    description:
      "Après avoir obtenu son diplôme en commerce international à Legacy University, David Muyumba a poursuivi une carrière internationale passionnante. Il a travaillé dans différentes entreprises multinationales, parcourant le monde et établissant des partenariats commerciaux fructueux dans divers pays.",
    date: "19 Septembre 2023",
    image: "/graduation.jpg",
    category: "International",
    featured: false,
    readTime: "6 min",
    author: "David Muyumba"
  },
  {
    id: 4,
    title: "Innovation sociale : Marie Kasongo",
    description:
      "Marie Kasongo, diplômée en sciences sociales, a créé une ONG qui impact positivement des milliers de vies. Son approche innovante dans le développement communautaire lui a valu une reconnaissance internationale et plusieurs prix prestigieux.",
    date: "3 Novembre 2023",
    image: "/graduation.jpg",
    category: "Social",
    featured: false,
    readTime: "4 min",
    author: "Marie Kasongo"
  },
  {
    id: 5,
    title: "Excellence académique : Dr. Paul Kabila",
    description:
      "Le Dr. Paul Kabila a poursuivi sa passion pour la recherche médicale après Legacy University. Ses découvertes révolutionnaires dans le traitement des maladies tropicales ont été publiées dans les plus prestigieuses revues scientifiques mondiales.",
    date: "15 Décembre 2023",
    image: "/graduation.jpg",
    category: "Recherche",
    featured: true,
    readTime: "8 min",
    author: "Dr. Paul Kabila"
  },
];

const categories = [
  { name: "Toutes", icon: <FaBookOpen />, count: stories.length },
  { name: "Entrepreneuriat", icon: <FaBriefcase />, count: stories.filter(s => s.category === "Entrepreneuriat").length },
  { name: "Leadership", icon: <FaUsers />, count: stories.filter(s => s.category === "Leadership").length },
  { name: "International", icon: <FaGraduationCap />, count: stories.filter(s => s.category === "International").length },
  { name: "Social", icon: <FaHeart />, count: stories.filter(s => s.category === "Social").length },
  { name: "Recherche", icon: <FaStar />, count: stories.filter(s => s.category === "Recherche").length },
];

const Page = () => {
  const [selectedCategory, setSelectedCategory] = useState("Toutes");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative pt-20 pb-16 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden"
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-400/20 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-indigo-300/15 rounded-full blur-lg"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 backdrop-blur-sm border border-white/30"
            >
              <FaBookOpen className="text-3xl text-white" />
            </motion.div>

            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className={`text-5xl md:text-6xl font-bold mb-6 ${libreBaskerville.className}`}
            >
              Histoires <span className="text-blue-200">Inspirantes</span>
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              Découvrez les parcours exceptionnels de nos alumni qui inspirent et transforment le monde
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap justify-center gap-6 text-blue-100"
            >
              <div className="flex items-center space-x-2">
                <FaUsers className="text-lg" />
                <span className="text-lg font-semibold">{stories.length}+ Histoires</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaStar className="text-lg" />
                <span className="text-lg font-semibold">{featuredStories.length} À la Une</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaGraduationCap className="text-lg" />
                <span className="text-lg font-semibold">Legacy Alumni</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Search and Filter Section */}
      <motion.section
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="py-8 bg-white shadow-sm border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une histoire..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <motion.button
                  key={category.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 font-medium
                    ${selectedCategory === category.name
                      ? "bg-blue-600 text-white shadow-lg transform scale-105"
                      : "bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:scale-105"
                    }
                  `}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-sm">{category.icon}</span>
                  <span>{category.name}</span>
                  <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">
                    {category.count}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Featured Stories */}
      {featuredStories.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50"
        >
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className={`text-4xl font-bold text-gray-800 mb-4 ${libreBaskerville.className}`}>
                Histoires à la Une
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Les parcours les plus inspirants de nos alumni qui marquent leur époque
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {featuredStories.map((story, index) => (
                  <motion.div
                    key={story.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="group"
                  >
                <StoryCardTwo
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
        className="py-16"
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className={`text-4xl font-bold text-gray-800 mb-4 ${libreBaskerville.className}`}>
              {selectedCategory === "Toutes" ? "Toutes les Histoires" : `Histoires - ${selectedCategory}`}
            </h2>
            <p className="text-lg text-gray-600">
              {filteredStories.length} histoire{filteredStories.length > 1 ? "s" : ""} trouvée{filteredStories.length > 1 ? "s" : ""}
            </p>
          </motion.div>

          {filteredStories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {filteredStories.map((story, index) => (
                  <motion.div
                    key={story.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="group"
                  >
                    <StoryCardTwo
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
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
                <FaSearch className="text-3xl text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-600 mb-4">Aucune histoire trouvée</h3>
              <p className="text-gray-500 mb-6">
                Essayez de modifier vos critères de recherche ou explorez d'autres catégories.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("Toutes");
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-300"
              >
                Réinitialiser les filtres
              </button>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white"
      >
        <div className="max-w-4xl mx-auto text-center px-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.6 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6"
          >
            <FaHeart className="text-2xl text-white" />
          </motion.div>

          <h2 className={`text-4xl font-bold mb-6 ${libreBaskerville.className}`}>
            Votre Histoire Nous Inspire
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Vous êtes un alumni avec une histoire à partager ? Rejoignez notre communauté et inspirez les futures générations.
          </p>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300"
          >
            Partager Mon Histoire
          </motion.button>
      </div>
      </motion.section>
    </div>
  );
};

export default Page;
