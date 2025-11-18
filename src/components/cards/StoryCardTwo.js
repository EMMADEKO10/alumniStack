'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaUser, FaClock, FaCalendarAlt, FaStar, FaArrowRight, FaBookOpen } from "react-icons/fa";

const StoryCardTwo = ({ title, description, image, category, date, featured, readTime, author, id }) => {
  const router = useRouter();
  const getCategoryColor = (category) => {
    const colors = {
      "Entrepreneuriat": "from-purple-500 to-purple-600",
      "Leadership": "from-blue-500 to-blue-600", 
      "International": "from-green-500 to-green-600",
      "Social": "from-pink-500 to-pink-600",
      "Recherche": "from-orange-500 to-orange-600",
      "Default": "from-gray-500 to-gray-600"
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
      whileHover={{ y: -8 }}
      onClick={() => router.push(`/stories/${id}`)}
      className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 cursor-pointer h-full flex flex-col"
    >
      {/* Badge Featured */}
      {featured && (
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, delay: 0.3 }}
          className="absolute top-4 right-4 z-20 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center space-x-1 shadow-lg"
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4 z-10">
          <div className={`bg-gradient-to-r ${getCategoryColor(category)} text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-2 shadow-lg backdrop-blur-sm`}>
            <span>{getCategoryIcon(category)}</span>
            <span>{category}</span>
          </div>
        </div>

        {/* Read Time */}
        {readTime && (
          <div className="absolute bottom-4 right-4 z-10 bg-white/95 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 shadow-md">
            <FaClock className="text-xs" />
            <span>{readTime}</span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-red-600/0 to-red-600/0 group-hover:from-red-600/30 group-hover:to-transparent transition-all duration-500" />
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Author & Date */}
        <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-gray-100 rounded-full">
              <FaUser className="text-xs text-gray-600" />
            </div>
            <span className="font-medium">{author}</span>
          </div>
          {date && (
            <div className="flex items-center space-x-1.5 text-gray-500">
              <FaCalendarAlt className="text-xs" />
              <span className="text-xs">{date}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-xl mb-3 text-gray-900 group-hover:text-red-600 transition-colors duration-300 line-clamp-2 leading-tight">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
          {description}
        </p>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.02, x: 4 }}
          whileTap={{ scale: 0.98 }}
          className="group/btn relative w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 overflow-hidden shadow-md hover:shadow-lg"
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
          
          <FaBookOpen className="text-sm relative z-10" />
          <span className="relative z-10">Lire l&apos;histoire</span>
          <FaArrowRight className="text-sm relative z-10 group-hover/btn:translate-x-1 transition-transform duration-300" />
        </motion.button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-red-500 via-rose-500 to-red-600 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />
      
      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-rose-500 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
      
      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-500/0 to-red-500/10 rounded-bl-full transform scale-0 group-hover:scale-100 transition-transform duration-500" />
    </motion.div>
  );
};

export default StoryCardTwo;
