'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaIdCard, FaUserTag, FaGraduationCap, FaBriefcase, FaMapMarkerAlt, FaEdit, FaUsers } from 'react-icons/fa';
import { LEADERSHIP_ACADEMY_FACULTIES } from '../../types/community';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [alumniProfile, setAlumniProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fonction utilitaire pour obtenir le prénom
  const getFirstName = () => {
    if (alumniProfile?.personalInfo?.firstName) {
      return alumniProfile.personalInfo.firstName;
    }
    if (session?.user?.firstName) {
      return session.user.firstName;
    }
    if (session?.user?.name) {
      const nameParts = session.user.name.trim().split(' ');
      return nameParts[0] || '';
    }
    return '';
  };

  // Fonction utilitaire pour obtenir le nom de famille
  const getLastName = () => {
    if (alumniProfile?.personalInfo?.lastName) {
      return alumniProfile.personalInfo.lastName;
    }
    if (session?.user?.lastName) {
      return session.user.lastName;
    }
    if (session?.user?.name) {
      const nameParts = session.user.name.trim().split(' ');
      return nameParts.slice(1).join(' ') || '';
    }
    return '';
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchAlumniProfile();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const fetchAlumniProfile = async () => {
    try {
      const response = await fetch(`/api/alumni?userId=${session?.user?.email}`);
      if (response.ok) {
        const data = await response.json();
        if (data.profiles && data.profiles.length > 0) {
          setAlumniProfile(data.profiles[0]);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil alumni:', error);
    } finally {
      setLoading(false);
    }
  };

  // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  // Afficher un état de chargement pendant la vérification de la session
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="pt-40 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Skeleton Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8 animate-pulse">
              <div className="flex items-center justify-between mb-6">
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                <div className="h-10 w-32 bg-gray-200 rounded"></div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-gray-200 rounded mt-1"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skeleton Statut Alumni */}
            <div className="bg-linear-to-r from-blue-600 to-blue-800 text-white rounded-lg p-6 mb-8 animate-pulse">
              <div className="h-6 bg-white/30 rounded w-1/2 mb-4"></div>
              <div className="flex gap-4">
                <div className="h-4 bg-white/30 rounded w-1/4"></div>
                <div className="h-4 bg-white/30 rounded w-1/4"></div>
              </div>
            </div>

            {/* Skeleton Sections */}
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-8 animate-pulse">
                  <div className="flex justify-between items-center mb-6">
                    <div className="h-7 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-10 w-24 bg-gray-200 rounded"></div>
                  </div>
                  <div className="space-y-4">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="h-4 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getFacultyName = (facultyId) => {
    const faculty = LEADERSHIP_ACADEMY_FACULTIES.find(f => f.id === facultyId);
    return faculty ? faculty.name : facultyId;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-40 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* En-tête de la page */}
          <div className="text-center mb-12 mt-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Mon Profil Alumni
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Gérez vos informations personnelles et restez connecté avec la communauté <span className="text-red-600 font-semibold">LAU</span>
            </p>
          </div>
      
          {/* Section Profil de base */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Informations personnelles</h2>
                <p className="text-sm text-gray-600">Vos données de base et coordonnées</p>
              </div>
              <button 
                className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-200 flex items-center gap-2 font-medium shadow-lg shadow-red-600/30 hover:shadow-xl hover:shadow-red-600/40 hover:-translate-y-0.5"
                onClick={() => router.push('/profile/complete')}
              >
                <FaEdit />
                {alumniProfile ? 'Modifier' : 'Compléter'}
              </button>
            </div>
        
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <FaUser className="text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Prénom</p>
                  <p className="font-semibold text-gray-900">
                    {getFirstName() || <span className="text-gray-400">Non renseigné</span>}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <FaIdCard className="text-blue-900" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Nom</p>
                  <p className="font-semibold text-gray-900">
                    {getLastName() || <span className="text-gray-400">Non renseigné</span>}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
                <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center shrink-0">
                  <FaEnvelope className="text-cyan-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="font-semibold text-gray-900 break-all">{alumniProfile?.personalInfo?.email || session.user.email}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                  <FaUserTag className="text-gray-900" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Rôle</p>
                  <p className="font-semibold text-gray-900 capitalize">
                    {session?.user?.role === 'admin' ? '👑 Administrateur' : 
                     session?.user?.role === 'user' ? '👤 Utilisateur' : 
                     session?.user?.role || '👤 Utilisateur'}
                  </p>
                </div>
              </div>
            </div>
          </div>

      {/* Section Profil Alumni */}
          {alumniProfile ? (
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Statut Alumni */}
              <div className="bg-red-600 text-white rounded-2xl shadow-xl p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <FaGraduationCap className="text-3xl" />
                      <h3 className="text-2xl font-bold">Statut Alumni LAU</h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                        <div className={`w-3 h-3 rounded-full ${alumniProfile.status.isVerified ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`}></div>
                        <span className="font-medium">{alumniProfile.status.isVerified ? '✓ Vérifié' : '⏳ En attente de vérification'}</span>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                        <span className="font-medium">📊 Profil complété à {alumniProfile.status.completionPercentage}%</span>
                      </div>
                    </div>
                    {/* Barre de progression */}
                    <div className="mt-4 bg-white/30 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full bg-cyan-400 transition-all duration-500"
                        style={{ width: `${alumniProfile.status.completionPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-4xl font-bold">{alumniProfile.status.completionPercentage}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informations Académiques */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <FaGraduationCap className="text-blue-900 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Informations Académiques</h3>
                    <p className="text-sm text-gray-600">Votre parcours universitaire</p>
                  </div>
                </div>
            
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <p className="text-sm text-blue-900 font-semibold mb-1">Faculté</p>
                    <p className="font-medium text-gray-900">{getFacultyName(alumniProfile.academicInfo.facultyId)}</p>
                  </div>
                  
                  {alumniProfile.academicInfo.departmentName && (
                    <div className="p-4 rounded-lg bg-cyan-50 border border-cyan-200">
                      <p className="text-sm text-cyan-900 font-semibold mb-1">Département</p>
                      <p className="font-medium text-gray-900">{alumniProfile.academicInfo.departmentName}</p>
                    </div>
                  )}
                  
                  <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                    <p className="text-sm text-red-900 font-semibold mb-1">Diplôme</p>
                    <p className="font-medium text-gray-900">{alumniProfile.academicInfo.degreeTitle}</p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <p className="text-sm text-gray-700 font-semibold mb-1">Année de fin</p>
                    <p className="font-medium text-gray-900">{alumniProfile.academicInfo.graduationYear}</p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <p className="text-sm text-blue-900 font-semibold mb-1">Niveau</p>
                    <p className="font-medium text-gray-900">{alumniProfile.academicInfo.degreeLevel}</p>
                  </div>
                  
                  {alumniProfile.academicInfo.honors && (
                    <div className="p-4 rounded-lg bg-cyan-50 border border-cyan-200">
                      <p className="text-sm text-cyan-900 font-semibold mb-1">Mentions</p>
                      <p className="font-medium text-gray-900">{alumniProfile.academicInfo.honors}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Informations Professionnelles */}
              {alumniProfile.professionalInfo.currentPosition && (
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                      <FaBriefcase className="text-red-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Informations Professionnelles</h3>
                      <p className="text-sm text-gray-600">Votre carrière actuelle</p>
                    </div>
                  </div>
              
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                      <p className="text-sm text-red-900 font-semibold mb-1">Poste actuel</p>
                      <p className="font-medium text-gray-900">{alumniProfile.professionalInfo.currentPosition.jobTitle}</p>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-cyan-50 border border-cyan-200">
                      <p className="text-sm text-cyan-900 font-semibold mb-1">Entreprise</p>
                      <p className="font-medium text-gray-900">{alumniProfile.professionalInfo.currentPosition.company}</p>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                      <p className="text-sm text-blue-900 font-semibold mb-1">Secteur</p>
                      <p className="font-medium text-gray-900">{alumniProfile.professionalInfo.currentPosition.industry}</p>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                      <p className="text-sm text-gray-700 font-semibold mb-1">Localisation</p>
                      <p className="font-medium text-gray-900 flex items-center gap-2">
                        <FaMapMarkerAlt className="text-red-600" />
                        {alumniProfile.professionalInfo.currentPosition.location}
                      </p>
                    </div>
                  </div>

                  {alumniProfile.professionalInfo.skills.length > 0 && (
                    <div className="mt-8 p-6 rounded-lg bg-cyan-50 border border-cyan-200">
                      <p className="text-sm text-cyan-900 font-semibold mb-4 flex items-center gap-2">
                        <span className="text-lg">💡</span>
                        Compétences professionnelles
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {alumniProfile.professionalInfo.skills.map((skill, index) => (
                          <span key={index} className="px-4 py-2 bg-white border-2 border-cyan-300 text-cyan-900 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-shadow">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Actions rapides */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Actions rapides</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <button
                    onClick={() => router.push('/communities')}
                    className="group flex items-center gap-4 p-6 bg-cyan-50 hover:bg-cyan-100 border-2 border-cyan-200 hover:border-cyan-400 rounded-xl transition-all duration-200 text-left shadow-md hover:shadow-xl hover:-translate-y-1"
                  >
                    <div className="w-14 h-14 rounded-full bg-cyan-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <FaUsers className="text-white text-2xl" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg mb-1">Explorer les communautés</p>
                      <p className="text-sm text-gray-600">Trouvez vos camarades de promotion</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => router.push('/profile/complete')}
                    className="group flex items-center gap-4 p-6 bg-red-50 hover:bg-red-100 border-2 border-red-200 hover:border-red-400 rounded-xl transition-all duration-200 text-left shadow-md hover:shadow-xl hover:-translate-y-1"
                  >
                    <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <FaEdit className="text-white text-2xl" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg mb-1">Modifier mon profil</p>
                      <p className="text-sm text-gray-600">Compléter mes informations</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Call-to-action pour compléter le profil */
            <div className="max-w-4xl mx-auto bg-red-600 text-white rounded-2xl shadow-2xl p-12 text-center relative overflow-hidden">
              {/* Décorations */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
              
              <div className="relative z-10">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <FaGraduationCap className="text-6xl" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-4">Devenez un Alumni LAU !</h3>
                <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
                  Complétez votre profil pour rejoindre la communauté des diplômés de <span className="font-bold">Leadership Academia University</span> et accéder à toutes les fonctionnalités exclusives.
                </p>
                <button
                  onClick={() => router.push('/profile/complete')}
                  className="px-10 py-4 bg-white text-red-600 rounded-full hover:bg-gray-100 transition-all duration-200 font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 inline-flex items-center gap-3"
                >
                  <FaEdit />
                  Compléter mon profil Alumni
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
