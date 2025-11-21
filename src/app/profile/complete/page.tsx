'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AlumniProfileForm from '../../../components/alumni/AlumniProfileForm';
import { AlumniProfile } from '../../../types/alumni';

const CompleteProfilePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [existingProfile, setExistingProfile] = useState<AlumniProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const checkExistingProfile = useCallback(async () => {
    try {
      const response = await fetch(`/api/alumni?userId=${session?.user?.email}`);
      if (response.ok){
        const data = await response.json();
        if (data.profiles && data.profiles.length > 0) {
          setExistingProfile(data.profiles[0]);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du profil:', error);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.email]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      checkExistingProfile();
    }
  }, [status, router, checkExistingProfile]);

  const handleProfileSubmit = () => {
    // Rediriger vers le profil après création/mise à jour
    router.push('/profile');
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-cyan-50/30 relative overflow-hidden">
        {/* Décorations de fond */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-100/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -right-24 w-96 h-96 bg-cyan-100/20 rounded-full blur-3xl"></div>
        </div>

        <div className="pt-32 pb-16 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Skeleton En-tête */}
            <div className="text-center mb-12 animate-pulse">
              <div className="h-8 bg-gray-200 rounded-full w-48 mx-auto mb-6"></div>
              <div className="h-12 bg-gray-200 rounded w-2/3 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>

            {/* Skeleton Formulaire */}
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <div className="mb-8">
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-2/3"></div>
              </div>

              <div className="space-y-8">
                {/* Sections du formulaire */}
                {[1, 2].map((section) => (
                  <div key={section}>
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[1, 2, 3, 4].map((field) => (
                        <div key={field}>
                          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                          <div className="h-12 bg-gray-200 rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                {/* Skeleton Navigation */}
                <div className="flex justify-between items-center pt-6 border-t">
                  <div className="h-10 bg-gray-200 rounded w-32"></div>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="w-3 h-3 rounded-full bg-gray-200"></div>
                    ))}
                  </div>
                  <div className="h-10 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-cyan-50/30 relative overflow-hidden">
      {/* Décorations de fond LAU */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-100/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-cyan-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-100/10 rounded-full blur-3xl"></div>
      </div>

      <div className="pt-32 pb-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* En-tête avec image */}
          <div className="text-center mb-12">
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-red-100 text-red-700 text-sm font-medium">
                {existingProfile ? '✏️ Mise à jour du profil' : '🎓 Nouveau profil Alumni'}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {existingProfile ? 'Modifier mon profil Alumni' : 'Rejoignez la communauté LAU'}
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Complétez votre profil pour rejoindre automatiquement les communautés correspondant à 
              votre <span className="text-red-600 font-semibold">promotion</span>, <span className="text-blue-900 font-semibold">faculté</span>, <span className="text-cyan-600 font-semibold">région</span> et <span className="text-gray-900 font-semibold">secteur professionnel</span>.
            </p>
          </div>

          <AlumniProfileForm 
            initialData={existingProfile || undefined}
            onSubmit={handleProfileSubmit}
            isEditing={!!existingProfile}
          />
        </div>
      </div>
    </div>
  );
};

export default CompleteProfilePage; 