'use client';

import Link from "next/link";
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { FaUserCircle, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaCog, FaBell, FaShieldAlt, FaUserGraduate } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserRole } from '../../hooks/useUserRole';

export default function UserNavbar() {
  const { data: session, status } = useSession();
  const { userRole, loading, getRoleDisplayName, getRoleColor } = useUserRole();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [notifications] = useState<number>(2); // Exemple de notifications
  const [isClient, setIsClient] = useState<boolean>(false);

  // S'assurer que le composant s'affiche seulement côté client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = async (): Promise<void> => {
    await signOut({ redirect: false });
    window.location.href = '/';
  };

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      const target = event.target as Element;
      if (isMenuOpen && !target.closest('.user-menu-container')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Obtenir l'icône du rôle
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <FaShieldAlt className="text-purple-600" />;
      case 'alumni':
        return <FaUserGraduate className="text-blue-600" />;
      default:
        return <FaUserCircle className="text-gray-600" />;
    }
  };

  // Éviter l'hydration mismatch en attendant que le composant soit côté client
  if (!isClient || status === 'loading') {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="relative user-menu-container">
      {session ? (
        <div className="flex items-center">
          {/* Icône de notification */}
          <div className="relative mr-3">
            <button className="p-1.5 rounded-full text-gray-500 hover:text-red-600 hover:bg-gray-100 transition-colors">
              <FaBell className="text-lg" />
              {notifications > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-600 rounded-full">
                  {notifications}
                </span>
              )}
            </button>
          </div>

          {/* Badge de rôle visible sur desktop */}
          {!loading && userRole && (
            <div className="hidden lg:flex items-center mr-3">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(userRole.role)}`}>
                <span className="mr-1">{getRoleIcon(userRole.role)}</span>
                {getRoleDisplayName(userRole.role)}
                {userRole.role === 'alumni' && userRole.isVerified && (
                  <FaShieldAlt className="ml-1 text-green-600" size={10} />
                )}
              </span>
            </div>
          )}
          
          {/* Avatar et menu utilisateur */}
          <button
            onClick={toggleMenu}
            className="flex items-center space-x-2 rounded-full p-1 text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white shadow-md">
                {session.user?.name ? session.user.name.charAt(0).toUpperCase() : session.user?.email?.charAt(0).toUpperCase()}
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <span className="hidden md:block text-sm font-medium truncate max-w-[100px]">
              {session.user?.name || session.user?.email?.split('@')[0]}
            </span>
          </button>
          
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-1 z-20 top-full border border-gray-100"
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white shadow-md">
                      {session.user?.name ? session.user.name.charAt(0).toUpperCase() : session.user?.email?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                    </div>
                  </div>
                  
                  {/* Informations de rôle détaillées */}
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      {!loading && userRole ? (
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(userRole.role)}`}>
                          <span className="mr-1">{getRoleIcon(userRole.role)}</span>
                          {getRoleDisplayName(userRole.role)}
                          {userRole.role === 'alumni' && userRole.isVerified && (
                            <FaShieldAlt className="ml-1 text-green-600" size={10} />
                          )}
                        </span>
                      ) : (
                        <div className="w-20 h-5 bg-gray-200 rounded animate-pulse"></div>
                      )}
                      <span className="text-xs text-gray-500">ID: {session.user?.id?.slice(-8)}</span>
                    </div>
                    
                    {/* Statut spécifique aux alumni */}
                    {!loading && userRole?.role === 'alumni' && (
                      <div className="flex items-center space-x-2 text-xs">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${userRole.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {userRole.isVerified ? 'Vérifié' : 'En attente'}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${userRole.isComplete ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                          {userRole.isComplete ? 'Profil complet' : 'Profil incomplet'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="py-1">
                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaUserCircle className="mr-3 text-gray-500" /> Mon profil
                  </Link>
                  
                  {/* Lien spécifique pour les alumni */}
                  {userRole?.role === 'alumni' && (
                    <Link
                      href="/profile/complete"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FaUserGraduate className="mr-3 text-blue-500" /> Profil Alumni
                    </Link>
                  )}
                  
                  {/* Lien admin */}
                  {userRole?.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FaShieldAlt className="mr-3 text-purple-500" /> Administration
                    </Link>
                  )}
                  
                  <Link
                    href="#settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaCog className="mr-3 text-gray-500" /> Paramètres
                  </Link>
                </div>
                
                <div className="py-1 border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <FaSignOutAlt className="mr-3" /> Déconnexion
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <Link
            href="/login"
            className="flex items-center text-sm text-gray-700 hover:text-red-600 px-3 py-1.5 rounded-md hover:bg-gray-50 transition-colors"
          >
            <FaSignInAlt className="mr-1.5" /> Connexion
          </Link>
          <Link
            href="/register"
            className="flex items-center text-sm bg-gradient-to-r from-red-500 to-red-700 text-white px-3 py-1.5 rounded-md hover:from-red-600 hover:to-red-800 shadow-sm transition-colors"
          >
            <FaUserPlus className="mr-1.5" /> Inscription
          </Link>
        </div>
      )}
    </div>
  );
} 