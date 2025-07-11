'use client';

import Image from "next/image";
import { FaHeart, FaUsers, FaCalendarAlt } from "react-icons/fa";

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

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
      {/* Image avec badge de statut */}
      <div className="relative h-48 w-full">
        <Image 
          className="object-cover transition-transform duration-300 hover:scale-105" 
          fill 
          src={image || '/graduation.jpg'} 
          alt={title}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            isActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {isActive ? 'Actif' : 'Inactif'}
          </span>
        </div>
        {progressPercentage >= 100 && (
          <div className="absolute top-3 right-3">
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">
              Objectif atteint !
            </span>
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="font-bold text-xl mb-2 text-gray-900 line-clamp-2">{title}</h3>
          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">{description}</p>
        </div>

        {/* Barre de progression */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progression</span>
            <span className="text-sm font-bold text-red-600">
              {Math.min(100, Math.round(progressPercentage))}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, progressPercentage)}%` }}
            ></div>
          </div>
        </div>

        {/* Montants */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Collecté</p>
            <p className="font-bold text-green-600">{formatAmount(currentAmount)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Objectif</p>
            <p className="font-bold text-gray-900">{formatAmount(targetAmount)}</p>
          </div>
        </div>

        {/* Statistiques */}
        <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
          <div className="flex items-center">
            <FaUsers className="mr-1" />
            <span>Contributeurs</span>
          </div>
          {createdAt && (
            <div className="flex items-center">
              <FaCalendarAlt className="mr-1" />
              <span>{formatDate(createdAt)}</span>
            </div>
          )}
        </div>

        {/* Bouton d'action */}
        <button
          onClick={handleDonate}
          disabled={!isActive}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center ${
            isActive
              ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <FaHeart className="mr-2" />
          {progressPercentage >= 100 ? 'Objectif atteint' : 'Faire un don'}
        </button>

        {/* Montant restant */}
        {remainingAmount > 0 && (
          <p className="text-center text-xs text-gray-500 mt-2">
                         Plus que <span className="font-semibold text-red-600">{formatAmount(remainingAmount)}</span> pour atteindre l&apos;objectif
          </p>
        )}
      </div>
    </div>
  );
};

export default DonationCard; 