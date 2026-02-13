'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { FaGraduationCap, FaTimes, FaArrowRight } from 'react-icons/fa';
import { useAlumniProfile } from '../../hooks/useAlumniProfile';

/**
 * Bannière persistante pour inciter les utilisateurs à compléter leur profil alumni
 * S'affiche uniquement pour les utilisateurs authentifiés sans profil complet
 */
export default function CompleteProfileBanner() {
  const { status } = useSession();
  const { loading, hasProfile, isComplete, completionPercentage } = useAlumniProfile();
  const router = useRouter();
  const pathname = usePathname();
  const [isDismissed, setIsDismissed] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  // Pages où ne pas afficher la bannière
  const excludedPaths = ['/profile/complete', '/login', '/register', '/verify-email'];
  const shouldHideBanner = excludedPaths.some(path => pathname?.startsWith(path));

  useEffect(() => {
    // Vérifier si la bannière a été fermée dans cette session
    const dismissed = sessionStorage.getItem('profileBannerDismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  useEffect(() => {
    // Animation d'apparition après chargement
    if (!loading && status === 'authenticated' && !isDismissed && !shouldHideBanner) {
      const timer = setTimeout(() => setShowAnimation(true), 500);
      return () => clearTimeout(timer);
    }
  }, [loading, status, isDismissed, shouldHideBanner]);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('profileBannerDismissed', 'true');
  };

  const handleComplete = () => {
    router.push('/profile/complete');
  };

  // Ne pas afficher si :
  // - Chargement en cours
  // - Non authentifié
  // - Bannière fermée
  // - Sur une page exclue
  // - Profil déjà complet
  if (
    loading || 
    status !== 'authenticated' || 
    isDismissed || 
    shouldHideBanner ||
    (hasProfile && isComplete)
  ) {
    return null;
  }

  // Message différent selon si l'utilisateur a un profil incomplet ou pas de profil du tout
  const getMessage = () => {
    if (!hasProfile) {
      return {
        title: '🎓 Bienvenue dans la communauté LAU Alumni !',
        description: 'Créez votre profil alumni pour accéder à toutes les fonctionnalités et rejoindre le réseau.',
        cta: 'Créer mon profil',
        bgGradient: 'from-red-500 to-red-600',
        progress: 0,
      };
    } else {
      return {
        title: `Votre profil est complété à ${completionPercentage}%`,
        description: 'Complétez votre profil pour profiter pleinement de la plateforme et booster votre visibilité.',
        cta: 'Compléter mon profil',
        bgGradient: 'from-blue-600 to-cyan-600',
        progress: completionPercentage,
      };
    }
  };

  const message = getMessage();

  return (
    <div
      className={`fixed top-20 left-0 right-0 z-40 transition-all duration-500 ${
        showAnimation ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className={`relative bg-linear-to-r ${message.bgGradient} rounded-xl shadow-2xl overflow-hidden`}>
          {/* Barre de progression */}
          {message.progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
              <div
                className="h-full bg-white transition-all duration-1000 ease-out"
                style={{ width: `${message.progress}%` }}
              />
            </div>
          )}

          {/* Motif de fond décoratif */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white rounded-full blur-3xl" />
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          </div>

          <div className="relative px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Icône */}
              <div className="hidden sm:flex items-center justify-center w-12 h-12 bg-white/20 rounded-full backdrop-blur-sm shrink-0">
                <FaGraduationCap className="w-6 h-6 text-white" />
              </div>

              {/* Contenu */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base sm:text-lg font-bold text-white truncate">
                    {message.title}
                  </h3>
                  {message.progress > 0 && (
                    <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-semibold text-white backdrop-blur-sm">
                      {message.progress}%
                    </span>
                  )}
                </div>
                <p className="text-sm text-white/90 hidden sm:block">
                  {message.description}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <button
                  onClick={handleComplete}
                  className="group px-4 sm:px-6 py-2 sm:py-2.5 bg-white text-gray-900 rounded-full font-semibold text-sm hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
                >
                  <span className="hidden sm:inline">{message.cta}</span>
                  <span className="sm:hidden">Compléter</span>
                  <FaArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={handleDismiss}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
                  aria-label="Fermer"
                >
                  <FaTimes className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
