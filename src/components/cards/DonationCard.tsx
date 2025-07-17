'use client';

import Image from "next/image";
import { motion } from "framer-motion";
import { FaHeart, FaUsers, FaCalendarAlt, FaBullseye, FaDollarSign } from "react-icons/fa";

interface DonationCardProps {
  _id?: string;
  title: string;
  description: string;
  image: string;
  targetAmount: number;
  currentAmount: number;
  isActive: boolean;
  createdAt?: string;
  onDonate?: (id: string) => void;
}

const DonationCard = ({ 
  _id, 
  title, 
  description, 
  image, 
  targetAmount, 
  currentAmount, 
  isActive, 
  createdAt,
  onDonate 
}: DonationCardProps) => {
  const progressPercentage = targetAmount > 0 ? (currentAmount / targetAmount) * 100 : 0;
  const remainingAmount = Math.max(0, targetAmount - currentAmount);
  const isCompleted = progressPercentage >= 100;

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleDonate = () => {
    if (onDonate && _id) {
      onDonate(_id);
    }
  };

  const getStatusBadge = () => {
    if (isCompleted) {
      return (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
        >
          ✓ Objectif atteint
        </motion.div>
      );
    }
    
    return (
      <div className="absolute top-4 left-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
          isActive 
            ? 'bg-gradient-to-r from-green-400 to-green-500 text-white' 
            : 'bg-gray-100 text-gray-600 border border-gray-200'
        }`}>
          {isActive ? 'Actif' : 'Inactif'}
        </span>
      </div>
    );
  };

  const getProgressColor = () => {
    if (progressPercentage >= 100) return 'from-green-500 to-green-600';
    if (progressPercentage >= 75) return 'from-blue-500 to-blue-600';
    if (progressPercentage >= 50) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-red-600';
  };

  return (
    <motion.div 
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image avec superposition et badge */}
      <div className="relative h-56 w-full overflow-hidden">
        <Image 
          className="object-cover transition-transform duration-700 group-hover:scale-110" 
          fill 
          src={image || '/graduation.jpg'} 
          alt={title}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {getStatusBadge()}
        
        {/* Indicateur de progression sur l'image */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/20">
          <motion.div
            className={`h-full bg-gradient-to-r ${getProgressColor()}`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, progressPercentage)}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
      </div>

      {/* Contenu */}
      <div className="p-6">
        {/* Titre et description */}
        <div className="mb-6">
          <h3 className="font-bold text-xl mb-3 text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors duration-300">
            {title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Métriques principales */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
                         <div className="flex items-center text-sm font-medium text-gray-700">
               <FaBullseye className="mr-2 text-red-500" />
               Progression
             </div>
            <motion.span 
              className="text-lg font-bold text-red-600"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {Math.min(100, Math.round(progressPercentage))}%
            </motion.span>
          </div>
          
          {/* Barre de progression améliorée */}
          <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div 
              className={`h-full bg-gradient-to-r ${getProgressColor()} rounded-full relative overflow-hidden`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, progressPercentage)}%` }}
              transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
            >
              {/* Effet de brillance */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-pulse"></div>
            </motion.div>
          </div>
        </div>

        {/* Montants avec icônes */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div 
            className="text-center p-3 bg-green-50 rounded-xl border border-green-100"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-center mb-1">
              <FaDollarSign className="text-green-600 text-sm mr-1" />
              <p className="text-xs text-green-700 font-medium">Collecté</p>
          </div>
            <p className="font-bold text-green-600 text-lg">{formatAmount(currentAmount)}</p>
          </motion.div>
          
          <motion.div 
            className="text-center p-3 bg-blue-50 rounded-xl border border-blue-100"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
                         <div className="flex items-center justify-center mb-1">
               <FaBullseye className="text-blue-600 text-sm mr-1" />
               <p className="text-xs text-blue-700 font-medium">Objectif</p>
          </div>
            <p className="font-bold text-blue-600 text-lg">{formatAmount(targetAmount)}</p>
          </motion.div>
        </div>

        {/* Métadonnées */}
        <div className="flex items-center justify-between mb-6 text-xs text-gray-500">
          <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
            <FaUsers className="mr-2" />
            <span className="font-medium">Contributeurs</span>
          </div>
          {createdAt && (
            <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
              <FaCalendarAlt className="mr-2" />
              <span className="font-medium">{formatDate(createdAt)}</span>
            </div>
          )}
        </div>

        {/* Bouton d'action amélioré */}
        <motion.button
          onClick={handleDonate}
          disabled={!isActive}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center relative overflow-hidden ${
            isActive
              ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200'
          }`}
          whileHover={isActive ? { scale: 1.02, y: -2 } : {}}
          whileTap={isActive ? { scale: 0.98 } : {}}
          transition={{ duration: 0.2 }}
        >
          {isActive && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
          )}
          <FaHeart className="mr-3 text-xl" />
          <span className="relative z-10">
            {isCompleted ? 'Objectif atteint' : isActive ? 'Faire un don' : 'Campagne fermée'}
          </span>
        </motion.button>

        {/* Message d'encouragement */}
        {isActive && remainingAmount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center mt-4 p-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-100"
          >
            <p className="text-sm text-red-700">
              <span className="font-semibold">Plus que {formatAmount(remainingAmount)}</span>
              <br />
              <span className="text-xs">pour atteindre l&apos;objectif !</span>
          </p>
          </motion.div>
        )}

        {/* Message de félicitations pour objectif atteint */}
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200"
          >
            <p className="text-sm text-green-700">
              🎉 <span className="font-semibold">Félicitations !</span>
              <br />
              <span className="text-xs">Objectif atteint grâce à votre générosité</span>
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default DonationCard; 