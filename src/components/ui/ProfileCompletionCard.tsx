'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaCheckCircle, 
  FaUser, 
  FaGraduationCap, 
  FaBriefcase, 
  FaMapMarkerAlt,
  FaArrowRight,
  FaStar
} from 'react-icons/fa';
import { AlumniProfile } from '../../types/alumni';

interface ProfileCompletionCardProps {
  profile: AlumniProfile | null;
  completionPercentage: number;
}

/**
 * Card de complétion du profil avec détail des sections
 * Affiche visuellement ce qui est complété et ce qui reste à faire
 */
export default function ProfileCompletionCard({ profile, completionPercentage }: ProfileCompletionCardProps) {
  const router = useRouter();

  // Déterminer quelles sections sont complètes
  const sections = [
    {
      name: 'Informations personnelles',
      icon: <FaUser className="w-5 h-5" />,
      isComplete: !!(
        profile?.personalInfo?.firstName &&
        profile?.personalInfo?.lastName &&
        profile?.personalInfo?.email &&
        profile?.personalInfo?.phone
      ),
      description: 'Nom, prénom, email, téléphone',
      color: 'from-red-500 to-red-600',
    },
    {
      name: 'Formation académique',
      icon: <FaGraduationCap className="w-5 h-5" />,
      isComplete: !!(
        profile?.academicInfo?.facultyId &&
        profile?.academicInfo?.degreeLevel &&
        profile?.academicInfo?.degreeTitle &&
        profile?.academicInfo?.graduationYear
      ),
      description: 'Faculté, diplôme, année d\'obtention',
      color: 'from-blue-600 to-cyan-600',
    },
    {
      name: 'Parcours professionnel',
      icon: <FaBriefcase className="w-5 h-5" />,
      isComplete: !!(
        profile?.professionalInfo?.currentPosition ||
        (profile?.professionalInfo?.experience && profile.professionalInfo.experience.length > 0)
      ),
      description: 'Poste actuel, expériences',
      color: 'from-purple-600 to-pink-600',
    },
    {
      name: 'Coordonnées',
      icon: <FaMapMarkerAlt className="w-5 h-5" />,
      isComplete: !!(
        profile?.contactInfo?.currentAddress?.city &&
        profile?.contactInfo?.currentAddress?.province &&
        profile?.contactInfo?.currentAddress?.country
      ),
      description: 'Adresse, localisation',
      color: 'from-green-600 to-emerald-600',
    },
  ];

  const completedSections = sections.filter(s => s.isComplete).length;
  const totalSections = sections.length;

  // Déterminer le message d'encouragement
  const getMessage = () => {
    if (completionPercentage === 100) {
      return {
        title: '🎉 Profil complet !',
        description: 'Votre profil est complet. Vous pouvez maintenant profiter pleinement de la plateforme.',
        bgColor: 'from-green-500 to-emerald-600',
      };
    } else if (completionPercentage >= 75) {
      return {
        title: '💪 Presque terminé !',
        description: 'Plus que quelques détails pour optimiser votre profil.',
        bgColor: 'from-blue-600 to-cyan-600',
      };
    } else if (completionPercentage >= 50) {
      return {
        title: '👍 Bon début !',
        description: 'Continuez pour augmenter votre visibilité dans le réseau.',
        bgColor: 'from-orange-500 to-amber-600',
      };
    } else {
      return {
        title: '🚀 Commencez maintenant !',
        description: 'Complétez votre profil pour rejoindre pleinement la communauté.',
        bgColor: 'from-red-500 to-red-600',
      };
    }
  };

  const message = getMessage();

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      {/* En-tête avec progression */}
      <div className={`bg-linear-to-r ${message.bgColor} p-6 text-white relative overflow-hidden`}>
        {/* Motif décoratif */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Complétion du profil</h3>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
              <FaStar className="w-4 h-4" />
              <span className="font-bold text-lg">{completionPercentage}%</span>
            </div>
          </div>

          {/* Barre de progression */}
          <div className="relative">
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-1000 ease-out rounded-full"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <p className="text-sm text-white/90 mt-2">
              {completedSections} sur {totalSections} sections complétées
            </p>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-6">
        {/* Message d'encouragement */}
        <div className="mb-6">
          <h4 className="text-lg font-bold text-gray-900 mb-2">{message.title}</h4>
          <p className="text-gray-600">{message.description}</p>
        </div>

        {/* Liste des sections */}
        <div className="space-y-3 mb-6">
          {sections.map((section, index) => (
            <div
              key={index}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                section.isComplete
                  ? 'bg-green-50 border-green-200'
                  : 'bg-gray-50 border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${
                section.isComplete 
                  ? 'bg-green-100 text-green-600' 
                  : `bg-linear-to-br ${section.color} text-white`
              }`}>
                {section.isComplete ? (
                  <FaCheckCircle className="w-5 h-5" />
                ) : (
                  section.icon
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className={`font-semibold ${
                    section.isComplete ? 'text-green-900' : 'text-gray-900'
                  }`}>
                    {section.name}
                  </p>
                  {section.isComplete && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      Complété
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-0.5">{section.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bouton d'action */}
        {completionPercentage < 100 && (
          <button
            onClick={() => router.push('/profile/complete')}
            className="w-full group px-6 py-4 bg-linear-to-r from-red-600 to-red-500 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-600 transition-all duration-200 shadow-lg shadow-red-600/30 hover:shadow-xl hover:shadow-red-600/40 hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <span>Compléter mon profil</span>
            <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        )}

        {completionPercentage === 100 && (
          <div className="text-center p-4 bg-green-50 border-2 border-green-200 rounded-xl">
            <div className="flex items-center justify-center gap-2 text-green-700 font-semibold">
              <FaCheckCircle className="w-5 h-5" />
              <span>Profil 100% complet !</span>
            </div>
            <p className="text-sm text-green-600 mt-1">
              Vous pouvez toujours le mettre à jour si nécessaire
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
