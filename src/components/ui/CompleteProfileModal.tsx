'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  FaGraduationCap, 
  FaTimes, 
  FaUsers, 
  FaBriefcase, 
  FaCalendarAlt,
  FaHandshake,
  FaCheckCircle,
  FaStar
} from 'react-icons/fa';
import { useAlumniProfile } from '@/hooks/useAlumniProfile';

/**
 * Modale d'onboarding pour nouveaux utilisateurs
 * S'affiche une seule fois après la première connexion si le profil n'est pas complet
 */
export default function CompleteProfileModal() {
  const { status } = useSession();
  const { loading, hasProfile, isComplete } = useAlumniProfile();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // Pages où ne pas afficher la modale
  const excludedPaths = ['/profile/complete', '/login', '/register', '/verify-email'];
  const shouldHideModal = excludedPaths.some(path => pathname?.startsWith(path));

  useEffect(() => {
    // Vérifier si la modale a déjà été affichée (localStorage pour persistance)
    const hasSeenModal = localStorage.getItem('hasSeenProfileModal');
    
    if (
      !loading &&
      status === 'authenticated' &&
      !hasSeenModal &&
      !shouldHideModal &&
      (!hasProfile || !isComplete)
    ) {
      // Attendre un peu avant d'afficher pour une meilleure UX
      const timer = setTimeout(() => {
        setIsOpen(true);
        setTimeout(() => setShowContent(true), 100);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [loading, status, hasProfile, isComplete, shouldHideModal]);

  const handleClose = () => {
    setShowContent(false);
    setTimeout(() => {
      setIsOpen(false);
      localStorage.setItem('hasSeenProfileModal', 'true');
    }, 300);
  };

  const handleComplete = () => {
    localStorage.setItem('hasSeenProfileModal', 'true');
    router.push('/profile/complete');
  };

  const handleLater = () => {
    handleClose();
  };

  if (!isOpen) return null;

  const benefits = [
    {
      icon: <FaUsers className="w-6 h-6" />,
      title: 'Rejoignez le réseau',
      description: 'Connectez-vous avec plus de 10 000 alumni à travers le monde',
      color: 'from-red-500 to-red-600',
    },
    {
      icon: <FaBriefcase className="w-6 h-6" />,
      title: 'Opportunités exclusives',
      description: 'Accédez à des offres d\'emploi et de stage réservées aux alumni',
      color: 'from-blue-600 to-cyan-600',
    },
    {
      icon: <FaCalendarAlt className="w-6 h-6" />,
      title: 'Événements privilégiés',
      description: 'Participez à des événements networking et formations continues',
      color: 'from-purple-600 to-pink-600',
    },
    {
      icon: <FaHandshake className="w-6 h-6" />,
      title: 'Mentorat & Collaboration',
      description: 'Bénéficiez ou offrez du mentorat au sein de la communauté',
      color: 'from-green-600 to-emerald-600',
    },
  ];

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        showContent ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
    >
      {/* Overlay avec effet de flou */}
      <div
        className="absolute inset-0 backdrop-blur-sm"
        onClick={handleLater}
      />

      {/* Modale */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto transition-all duration-300 ${
          showContent ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        {/* Bouton fermer */}
        <button
          onClick={handleLater}
          className="absolute top-4 right-4 z-10 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          aria-label="Fermer"
        >
          <FaTimes className="w-5 h-5 text-gray-600" />
        </button>

        {/* En-tête avec dégradé */}
        <div className="relative bg-linear-to-br from-red-600 via-red-500 to-blue-600 p-8 text-white overflow-hidden">
          {/* Motif décoratif */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-20 -top-20 w-60 h-60 bg-white rounded-full blur-3xl" />
            <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-white rounded-full blur-3xl" />
          </div>

          <div className="relative text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full backdrop-blur-sm mb-4">
              <FaGraduationCap className="w-10 h-10" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Bienvenue chez les Alumni LAU !
            </h2>
            <p className="text-lg text-white/90 max-w-xl mx-auto">
              Vous faites maintenant partie d&apos;une communauté d&apos;excellence. 
              Complétez votre profil pour débloquer tous les avantages.
            </p>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="p-8">
          {/* Badge "Nouveau membre" */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-amber-500 to-orange-500 text-white rounded-full font-semibold shadow-lg">
              <FaStar className="w-4 h-4" />
              <span>Nouveau Membre</span>
            </div>
          </div>

          {/* Avantages */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
              Ce que vous débloque en complétant votre profil :
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="group p-5 rounded-xl border-2 border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300"
                  style={{
                    animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                  }}
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 bg-linear-to-br ${benefit.color} rounded-xl text-white mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    {benefit.icon}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {benefit.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Temps estimé */}
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                <FaCheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  Seulement 5 minutes
                </p>
                <p className="text-sm text-gray-600">
                  C&apos;est le temps nécessaire pour compléter votre profil et rejoindre la communauté
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleComplete}
              className="flex-1 px-6 py-4 bg-linear-to-r from-red-600 to-red-500 text-white rounded-xl font-bold text-lg hover:from-red-700 hover:to-red-600 transition-all duration-200 shadow-lg shadow-red-600/30 hover:shadow-xl hover:shadow-red-600/40 hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <FaGraduationCap className="w-5 h-5" />
              <span>Compléter mon profil maintenant</span>
            </button>
            
            <button
              onClick={handleLater}
              className="px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200"
            >
              Plus tard
            </button>
          </div>

          <p className="mt-4 text-xs text-center text-gray-500">
            Vous pourrez compléter votre profil à tout moment depuis votre espace personnel
          </p>
        </div>
      </div>

      {/* Styles pour l'animation */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
