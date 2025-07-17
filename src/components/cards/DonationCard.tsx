'use client';

import Image from "next/image";
import { motion } from "framer-motion";
import { 
  FaHeart, 
  FaBullseye, 
  FaCheckCircle,
  FaExclamationCircle
} from "react-icons/fa";
import { 
  UsersIcon, 
  CalendarDaysIcon, 
  MapPinIcon,
  CurrencyDollarIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";
import { Libre_Baskerville } from "next/font/google";

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
});

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
  category?: string;
  location?: string;
  donorCount?: number;
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
  onDonate,
  category,
  location,
  donorCount
}: DonationCardProps) => {
  const progressPercentage = targetAmount > 0 ? (currentAmount / targetAmount) * 100 : 0;
  const remainingAmount = Math.max(0, targetAmount - currentAmount);
  const isCompleted = progressPercentage >= 100;

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleDonate = () => {
    if (onDonate && _id) {
      onDonate(_id);
    }
  };

  const getProgressColor = () => {
    if (progressPercentage >= 100) return 'from-emerald-500 to-emerald-600';
    if (progressPercentage >= 75) return 'from-blue-500 to-blue-600';
    if (progressPercentage >= 50) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-red-600';
  };

  const getCategoryColor = () => {
    switch (category) {
      case 'infrastructure': return 'bg-blue-100 text-blue-800';
      case 'bourse': return 'bg-green-100 text-green-800';
      case 'recherche': return 'bg-purple-100 text-purple-800';
      case 'sport': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image avec overlay et badges */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image 
          className="object-cover transition-transform duration-500 group-hover:scale-105" 
          fill 
          src={image || '/graduation.jpg'} 
          alt={title}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
          unoptimized={false}
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        
        {/* Badge de statut */}
        <div className="absolute top-4 left-4">
          {isCompleted ? (
            <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center shadow-lg">
              <FaCheckCircle className="mr-1" />
              Objectif atteint
            </div>
          ) : (
            <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center shadow-lg ${
              isActive 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-500 text-white'
            }`}>
              {isActive ? (
                <>
                  <FaHeart className="mr-1" />
                  Actif
                </>
              ) : (
                <>
                  <FaExclamationCircle className="mr-1" />
                  Fermé
                </>
              )}
            </div>
          )}
        </div>

        {/* Badge de catégorie */}
        {category && (
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor()}`}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </div>
        )}

        {/* Barre de progression en bas de l'image */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
          <motion.div
            className={`h-full bg-gradient-to-r ${getProgressColor()}`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, progressPercentage)}%` }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />
        </div>

        {/* Pourcentage de progression */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
          <div className="flex items-center text-sm font-bold text-gray-900">
            <ChartBarIcon className="h-4 w-4 mr-1" />
            {Math.round(progressPercentage)}%
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-6">
        {/* Titre et description */}
        <div className="mb-4">
          <h3 className={`${libreBaskerville.className} text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors`}>
            {title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Métriques principales */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center text-sm text-gray-600">
              <FaBullseye className="mr-2 text-red-500" />
              <span className="font-medium">Progression</span>
            </div>
            <span className="text-lg font-bold text-red-600">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          
          {/* Barre de progression */}
          <div className="relative w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div 
              className={`h-full bg-gradient-to-r ${getProgressColor()} relative`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, progressPercentage)}%` }}
              transition={{ duration: 1.5, delay: 0.3 }}
            >
              {/* Effet de brillance */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-pulse"></div>
            </motion.div>
          </div>
        </div>

        {/* Montants et statistiques */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-center justify-center mb-1">
              <CurrencyDollarIcon className="h-4 w-4 text-green-600 mr-1" />
              <p className="text-xs text-green-700 font-medium">Collecté</p>
            </div>
            <p className="font-bold text-green-600">{formatAmount(currentAmount)}</p>
          </div>
          
          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center justify-center mb-1">
              <FaBullseye className="text-blue-600 text-xs mr-1" />
              <p className="text-xs text-blue-700 font-medium">Objectif</p>
            </div>
            <p className="font-bold text-blue-600">{formatAmount(targetAmount)}</p>
          </div>
        </div>

        {/* Informations supplémentaires */}
        <div className="space-y-2 mb-4 text-sm text-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <UsersIcon className="h-4 w-4 mr-2 text-gray-400" />
              <span>{donorCount || 0} donateurs</span>
            </div>
            {location && (
              <div className="flex items-center">
                <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
                <span className="text-xs">{location}</span>
              </div>
            )}
          </div>
          
          {createdAt && (
            <div className="flex items-center">
              <CalendarDaysIcon className="h-4 w-4 mr-2 text-gray-400" />
              <span>Créé le {formatDate(createdAt)}</span>
            </div>
          )}
        </div>

        {/* Bouton d'action */}
        <motion.button
          onClick={handleDonate}
          disabled={!isActive}
          className={`w-full py-3 px-4 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center relative overflow-hidden ${
            isActive && !isCompleted
              ? 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg'
              : isCompleted
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
          whileHover={isActive ? { y: -2 } : {}}
          whileTap={isActive ? { scale: 0.98 } : {}}
        >
          {isActive && !isCompleted && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
          )}
          <div className="flex items-center relative z-10">
            {isCompleted ? (
              <>
                <FaCheckCircle className="mr-2" />
                Objectif atteint
              </>
            ) : isActive ? (
              <>
                <FaHeart className="mr-2" />
                Faire un don
              </>
            ) : (
              <>
                <FaExclamationCircle className="mr-2" />
                Campagne fermée
              </>
            )}
          </div>
        </motion.button>

        {/* Message d'encouragement ou de félicitations */}
        {isActive && !isCompleted && remainingAmount > 0 && (
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

        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center mt-4 p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200"
          >
            <p className="text-sm text-emerald-700">
              🎉 <span className="font-semibold">Merci !</span>
              <br />
              <span className="text-xs">Objectif atteint grâce à votre soutien</span>
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default DonationCard; 