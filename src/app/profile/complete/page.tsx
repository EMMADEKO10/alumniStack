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
      <div className="min-h-screen bg-gray-50">
        <div className="pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Skeleton Titre */}
            <div className="text-center mb-8 animate-pulse">
              <div className="h-10 bg-gray-200 rounded w-2/3 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>

            {/* Skeleton Formulaire */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-pulse">
              <div className="space-y-8">
                {/* Sections du formulaire */}
                {[1, 2, 3, 4].map((section) => (
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
                <div className="h-12 bg-gray-200 rounded-lg w-full mt-8"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {existingProfile ? 'Modifier mon profil Alumni' : 'Devenir un Alumni Legacy University'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Complétez votre profil pour rejoindre automatiquement les communautés correspondant à 
            votre promotion, faculté, région et secteur professionnel.
          </p>
        </div>

        <AlumniProfileForm 
          initialData={existingProfile || undefined}
          onSubmit={handleProfileSubmit}
          isEditing={!!existingProfile}
        />
      </div>
    </div>
  );
};

export default CompleteProfilePage; 