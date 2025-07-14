'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AlumniProfileForm from '../../../components/alumni/AlumniProfileForm';
import { AlumniProfile } from '../../../types/alumni';

const CompleteProfilePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [existingProfile, setExistingProfile] = useState<AlumniProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      checkExistingProfile();
    }
  }, [status, router]);

  const checkExistingProfile = async () => {
    try {
      const response = await fetch(`/api/alumni?userId=${session?.user?.email}`);
      if (response.ok) {
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
  };

  const handleProfileSubmit = (profileData: Partial<AlumniProfile>) => {
    // Rediriger vers le profil après création/mise à jour
    router.push('/profile');
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
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