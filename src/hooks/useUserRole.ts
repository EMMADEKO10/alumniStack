import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export interface UserRole {
  role: 'admin' | 'alumni' | 'user';
  isVerified: boolean;
  isComplete: boolean;
}

export const useUserRole = () => {
  const { data: session } = useSession();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      try {
        // Utiliser la nouvelle route API pour récupérer le rôle
        const response = await fetch('/api/user/role');
        if (response.ok) {
          const roleData = await response.json();
          setUserRole(roleData);
        } else {
          // En cas d'erreur, définir comme utilisateur simple
          setUserRole({ role: 'user', isVerified: false, isComplete: false });
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du rôle utilisateur:', error);
        setUserRole({ role: 'user', isVerified: false, isComplete: false });
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [session?.user?.id]);

  const getRoleDisplayName = (role: UserRole['role']) => {
    switch (role) {
      case 'admin':
        return 'Administrateur';
      case 'alumni':
        return 'Alumni';
      case 'user':
        return 'Utilisateur';
      default:
        return 'Utilisateur';
    }
  };

  const getRoleColor = (role: UserRole['role']) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'alumni':
        return 'bg-blue-100 text-blue-800';
      case 'user':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return {
    userRole,
    loading,
    getRoleDisplayName,
    getRoleColor
  };
}; 
