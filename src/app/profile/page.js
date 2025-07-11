'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import PageTitle from '../../ui/navigation/PageTitle';
import { FaUser, FaEnvelope, FaIdCard, FaUserTag } from 'react-icons/fa';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  // Afficher un état de chargement pendant la vérification de la session
  if (status === 'loading') {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <PageTitle title="Mon Profil" content="Gérez vos informations personnelles" />
      
      <div className="mt-10 max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Informations personnelles</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-start space-x-3">
            <FaUser className="text-blue-500 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Prénom</p>
              <p className="font-medium">{session.user.firstName || 'Non renseigné'}</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <FaIdCard className="text-blue-500 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Nom</p>
              <p className="font-medium">{session.user.lastName || 'Non renseigné'}</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <FaEnvelope className="text-blue-500 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{session.user.email}</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <FaUserTag className="text-blue-500 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Rôle</p>
              <p className="font-medium capitalize">{session.user.role || 'Utilisateur'}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            onClick={() => alert('Fonctionnalité en cours de développement')}
          >
            Modifier mon profil
          </button>
        </div>
      </div>
    </div>
  );
} 