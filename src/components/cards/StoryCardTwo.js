'use client';

import Image from "next/image";
import { motion } from "framer-motion";
import { FaUser, FaClock, FaCalendarAlt, FaStar, FaArrowRight, FaBookOpen } from "react-icons/fa";

const StoryCardTwo = ({ title, description, image, category, date, featured, readTime, author }) => {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
    >
      {/* Badge Featured */}
      {featured && (
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, delay: 0.3 }}
          className="absolute top-4 right-4 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 shadow-lg"
        >
          <FaStar className="text-xs" />
          <span>À la Une</span>
        </motion.div>
      )}

      {/* Image Container */}
      <div className="relative h-56 w-full overflow-hidden">
        <Image 
          className="object-cover group-hover:scale-110 transition-transform duration-700" 
          fill 
          src={image} 
          alt={title}
          priority={featured}
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <div className={`${getCategoryColor(category)} text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2 shadow-lg backdrop-blur-sm`}>
            <span>{getCategoryIcon(category)}</span>
            <span>{category}</span>
          </div>
        </div>

        {/* Read Time */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
          <FaClock className="text-xs" />
          <span>{readTime}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Author & Date */}
        <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <FaUser className="text-xs" />
            <span className="font-medium">{author}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaCalendarAlt className="text-xs" />
            <span>{date}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-xl mb-3 text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-base leading-relaxed mb-6 line-clamp-3">
          {description}
        </p>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.05, x: 4 }}
          whileTap={{ scale: 0.95 }}
          className="group/btn relative w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 overflow-hidden"
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
          
          <FaBookOpen className="text-sm relative z-10" />
          <span className="relative z-10">Lire l&apos;histoire</span>
          <FaArrowRight className="text-sm relative z-10 group-hover/btn:translate-x-1 transition-transform duration-300" />
        </motion.button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-500 to-indigo-600 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />
      
      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </motion.div>
  );
};

export default StoryCardTwo;
