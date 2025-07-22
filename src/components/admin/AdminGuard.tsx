'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useUserRole } from '../../hooks/useUserRole';

interface AdminGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children, fallback }) => {
  const { data: session, status } = useSession();
  const { userRole, loading } = useUserRole();
  const router = useRouter();

  useEffect(() => {
    // Si pas de session et que le chargement est terminé, rediriger vers login
    if (status !== 'loading' && !session) {
      router.push('/login?redirect=/admin');
      return;
    }

    // Si le rôle est chargé et que ce n'est pas un admin, rediriger
    if (!loading && userRole && userRole.role !== 'admin') {
      router.push('/');
      return;
    }
  }, [session, status, userRole, loading, router]);

  // Afficher un loader pendant le chargement
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification des autorisations...</p>
        </div>
      </div>
    );
  }

  // Si pas de session, ne rien afficher (redirection en cours)
  if (!session) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès restreint</h2>
          <p className="text-gray-600">Redirection vers la page de connexion...</p>
        </div>
      </div>
    );
  }

  // Si le rôle n'est pas admin, ne rien afficher (redirection en cours)
  if (!userRole || userRole.role !== 'admin') {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès non autorisé</h2>
          <p className="text-gray-600">Vous n&apos;avez pas les permissions nécessaires pour accéder à cette page.</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retour à l&apos;accueil
          </button>
        </div>
      </div>
    );
  }

  // Si tout est ok, afficher le contenu
  return <>{children}</>;
};

export default AdminGuard; 