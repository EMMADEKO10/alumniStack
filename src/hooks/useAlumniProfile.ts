'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { AlumniProfile } from '../types/alumni';

interface UseAlumniProfileReturn {
  profile: AlumniProfile | null;
  loading: boolean;
  error: string | null;
  isComplete: boolean;
  completionPercentage: number;
  hasProfile: boolean;
  refetch: () => Promise<void>;
}

/**
 * Hook personnalisé pour gérer le profil alumni de l'utilisateur connecté
 * Vérifie automatiquement si le profil existe et s'il est complet
 */
export function useAlumniProfile(): UseAlumniProfileReturn {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<AlumniProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!session?.user?.email) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/alumni?userId=${session.user.email}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          // Pas de profil alumni trouvé
          setProfile(null);
          return;
        }
        throw new Error('Erreur lors du chargement du profil');
      }

      const data = await response.json();
      
      if (data.profiles && data.profiles.length > 0) {
        setProfile(data.profiles[0]);
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error('Erreur useAlumniProfile:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.email]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProfile();
    } else if (status === 'unauthenticated') {
      setLoading(false);
      setProfile(null);
    }
  }, [status, fetchProfile]);

  // Calculs dérivés
  const hasProfile = profile !== null;
  const isComplete = profile?.status?.isComplete ?? false;
  const completionPercentage = profile?.status?.completionPercentage ?? 0;

  return {
    profile,
    loading,
    error,
    isComplete,
    completionPercentage,
    hasProfile,
    refetch: fetchProfile,
  };
}
