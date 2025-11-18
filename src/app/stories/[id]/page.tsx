'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  FaArrowLeft, 
  FaUser, 
  FaCalendarAlt, 
  FaClock, 
  FaTag, 
  FaShareAlt,
  FaHeart,
  FaBookmark,
  FaFacebook,
  FaTwitter,
  FaLinkedin
} from 'react-icons/fa';

interface Story {
  _id: string;
  title: string;
  description: string;
  date?: string;
  image?: string;
  category?: string;
  featured?: boolean;
  readTime?: string;
  author?: string;
  fullContent?: string;
  createdAt?: string;
}

export default function StoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const storyId = params.id as string;
        const response = await fetch(`/api/stories/${storyId}`);
        if (!response.ok) throw new Error('Histoire non trouvée');
        const data = await response.json();
        setStory(data);
      } catch (err) {
        setError('Impossible de charger les détails de l\'histoire');
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchStory();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50">
        <div className="max-w-6xl mx-auto px-4 pt-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-96"
          >
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-200"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-600 absolute top-0"></div>
            </div>
            <p className="mt-6 text-gray-600 font-medium">Chargement de l&apos;histoire...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50">
        <div className="max-w-6xl mx-auto px-4 pt-8">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.back()}
            className="flex items-center gap-2 text-red-600 hover:text-red-800 mb-6 font-semibold transition"
          >
            <FaArrowLeft />
            Retour
          </motion.button>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <FaBookmark className="text-red-600 text-2xl" />
            </div>
            <p className="text-red-800 font-semibold text-lg mb-2">Histoire non trouvée</p>
            <p className="text-red-600">{error}</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-72 h-72 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 -right-20 w-96 h-96 bg-rose-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-8 pb-16 relative z-10">
        {/* Navigation Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-red-600 hover:text-red-800 font-semibold transition group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Retour aux histoires
          </button>

          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setLiked(!liked)}
              className={`p-3 rounded-full transition-all ${
                liked 
                  ? 'bg-red-100 text-red-600' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              } shadow-md border border-gray-200`}
            >
              <FaHeart className={liked ? 'fill-current' : ''} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setBookmarked(!bookmarked)}
              className={`p-3 rounded-full transition-all ${
                bookmarked 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              } shadow-md border border-gray-200`}
            >
              <FaBookmark className={bookmarked ? 'fill-current' : ''} />
            </motion.button>
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="p-3 rounded-full bg-white text-gray-600 hover:bg-gray-100 transition shadow-md border border-gray-200"
              >
                <FaShareAlt />
              </motion.button>
              <AnimatePresence>
                {showShareMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    className="absolute right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-2 w-48"
                  >
                    <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-blue-50 rounded-lg transition text-blue-600">
                      <FaFacebook />
                      <span className="text-sm font-medium">Facebook</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-sky-50 rounded-lg transition text-sky-600">
                      <FaTwitter />
                      <span className="text-sm font-medium">Twitter</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-blue-50 rounded-lg transition text-blue-700">
                      <FaLinkedin />
                      <span className="text-sm font-medium">LinkedIn</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative h-96 w-full rounded-2xl overflow-hidden mb-8 shadow-2xl group"
        >
          {story.image ? (
            <Image 
              src={story.image} 
              alt={story.title} 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-700" 
              sizes="(max-width: 1280px) 100vw, 1280px" 
              priority 
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-red-400 via-rose-500 to-red-600" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          
          {/* Category Badge */}
          {story.category && (
            <div className="absolute top-6 left-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg">
                <FaTag className="text-red-600" />
                <span className="font-semibold text-gray-900">{story.category}</span>
              </div>
            </div>
          )}

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight"
            >
              {story.title}
            </motion.h1>
            
            {/* Meta Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center gap-4 text-sm text-white/90"
            >
              {story.author && (
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                  <FaUser className="text-xs" />
                  <span className="font-medium">{story.author}</span>
                </div>
              )}
              {story.date && (
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                  <FaCalendarAlt className="text-xs" />
                  <span>{story.date}</span>
                </div>
              )}
              {story.readTime && (
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                  <FaClock className="text-xs" />
                  <span>{story.readTime}</span>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-8 lg:p-10">
              <div className="prose prose-lg max-w-none">
                {story.fullContent ? (
                  <div dangerouslySetInnerHTML={{ __html: story.fullContent }} />
                ) : (
                  <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">{story.description}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-8 space-y-6">
              {/* Info Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                  <FaTag className="text-red-600" />
                  Informations
                </h3>
                <div className="space-y-3">
                  {story.category && (
                    <div className="flex items-start gap-3">
                      <span className="text-sm text-gray-600 min-w-[80px]">Catégorie</span>
                      <span className="text-sm font-semibold text-gray-900">{story.category}</span>
                    </div>
                  )}
                  {story.date && (
                    <div className="flex items-start gap-3">
                      <span className="text-sm text-gray-600 min-w-[80px]">Date</span>
                      <span className="text-sm font-semibold text-gray-900">{story.date}</span>
                    </div>
                  )}
                  {story.author && (
                    <div className="flex items-start gap-3">
                      <span className="text-sm text-gray-600 min-w-[80px]">Auteur</span>
                      <span className="text-sm font-semibold text-gray-900">{story.author}</span>
                    </div>
                  )}
                  {story.readTime && (
                    <div className="flex items-start gap-3">
                      <span className="text-sm text-gray-600 min-w-[80px]">Lecture</span>
                      <span className="text-sm font-semibold text-gray-900">{story.readTime}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* CTA Card */}
              <div className="bg-gradient-to-br from-red-600 to-rose-600 rounded-2xl shadow-xl p-6 text-white">
                <h3 className="font-bold mb-3 text-lg">Inspiré par cette histoire?</h3>
                <p className="text-sm text-red-100 mb-4 leading-relaxed">
                  Rejoignez notre communauté et partagez votre propre parcours inspirant.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-white text-red-600 py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Partager mon histoire
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}


