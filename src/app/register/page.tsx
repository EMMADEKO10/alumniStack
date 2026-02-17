'use client';

import RegisterForm from '../../components/auth/RegisterForm';
import Image from 'next/image';
import { FaUsers, FaBriefcase, FaGraduationCap } from 'react-icons/fa';

export default function RegisterPage() {
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
          <div className="lg:hidden text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Rejoignez <span className="text-red-600">LAU Alumni</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Créez votre compte pour accéder à la communauté
            </p>
          </div>

          {/* Avantages mobiles - version compacte */}
          <div className="lg:hidden grid grid-cols-1 gap-2 sm:gap-3 mb-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 sm:p-4 shadow-sm border border-red-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                  <FaUsers className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">Réseau professionnel</p>
                  <p className="text-xs sm:text-sm text-gray-600">Connectez avec des alumni</p>
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 sm:p-4 shadow-sm border border-cyan-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-cyan-100 rounded-lg flex items-center justify-center shrink-0">
                  <FaBriefcase className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">Opportunités exclusives</p>
                  <p className="text-xs sm:text-sm text-gray-600">Emploi et événements</p>
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 sm:p-4 shadow-sm border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <FaGraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-blue-900" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">Formation continue</p>
                  <p className="text-xs sm:text-sm text-gray-600">Développez vos compétences</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Colonne gauche - Image et informations */}
            <div className="hidden lg:block">
              {/* Image de félicitations */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white mt-8">
                <Image
                  src="/lau/felicitations_finalistes.jpg"
                  alt="LAU Félicitations"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h2 className="text-3xl font-bold mb-2">Devenez Alumni LAU</h2>
                  <p className="text-lg opacity-90">Rejoignez une communauté d&apos;excellence et d&apos;opportunités</p>
                </div>
              </div>

              {/* Avantages */}
              <div className="grid grid-cols-1 gap-4 mt-8">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-red-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Réseau professionnel</p>
                      <p className="text-sm text-gray-600">Connectez avec des alumni du monde entier</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-cyan-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Opportunités exclusives</p>
                      <p className="text-sm text-gray-600">Accédez à des offres d&apos;emploi et événements</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Formation continue</p>
                      <p className="text-sm text-gray-600">Développez vos compétences en permanence</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne droite - Formulaire */}
            <div>
              <RegisterForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
