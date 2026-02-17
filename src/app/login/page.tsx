'use client';

import LoginForm from '../../components/auth/LoginForm';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-cyan-50/30 relative overflow-hidden">
      {/* Décorations de fond */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-100/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-cyan-100/20 rounded-full blur-3xl"></div>
      </div>

      <div className="pt-24 sm:pt-28 pb-8 sm:pb-12 relative z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          
          {/* En-tête mobile uniquement */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:hidden text-center mb-6"
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Bon retour chez <span className="text-red-600">LAU Alumni</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Connectez-vous pour accéder à votre espace
            </p>
          </motion.div>

          {/* Statistiques mobiles */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:hidden grid grid-cols-3 gap-2 sm:gap-3 mb-6"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 sm:p-4 shadow-sm border border-red-100">
              <p className="text-xl sm:text-2xl font-bold text-red-600">500+</p>
              <p className="text-xs sm:text-sm text-gray-600">Alumni</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 sm:p-4 shadow-sm border border-blue-100">
              <p className="text-xl sm:text-2xl font-bold text-blue-900">50+</p>
              <p className="text-xs sm:text-sm text-gray-600">Événements</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 sm:p-4 shadow-sm border border-cyan-100">
              <p className="text-xl sm:text-2xl font-bold text-cyan-600">20+</p>
              <p className="text-xs sm:text-sm text-gray-600">Communautés</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Colonne gauche - Image et informations */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="hidden lg:block"
            >
              {/* Image de graduation */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white mt-8">
                <Image
                  src="/lau/collation.jpg"
                  alt="LAU Graduation"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h2 className="text-3xl font-bold mb-2">Rejoignez la Famille LAU</h2>
                  <p className="text-lg opacity-90">Connectez-vous avec des milliers d&apos;alumni à travers le monde</p>
                </div>
              </div>

              {/* Statistiques */}
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-red-100">
                  <p className="text-2xl font-bold text-red-600">500+</p>
                  <p className="text-sm text-gray-600">Alumni</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100">
                  <p className="text-2xl font-bold text-blue-900">50+</p>
                  <p className="text-sm text-gray-600">Événements</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-cyan-100">
                  <p className="text-2xl font-bold text-cyan-600">20+</p>
                  <p className="text-sm text-gray-600">Communautés</p>
                </div>
              </div>
            </motion.div>

            {/* Colonne droite - Formulaire */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <LoginForm />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} 
