'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import PageTitle from '../../ui/navigation/PageTitle';
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
        <div className="pt-32 pb-16">
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
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-6 mb-8 animate-pulse">
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
    <div className="container mx-auto py-10">
      <PageTitle title="Mon Profil" content="Gérez vos informations personnelles et alumni" />
      
      {/* Section Profil de base */}
      <div className="mt-10 max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Informations personnelles</h2>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
            onClick={() => router.push('/profile/complete')}
          >
            <FaEdit />
            {alumniProfile ? 'Modifier' : 'Compléter'}
          </button>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-start space-x-3">
            <FaUser className="text-blue-500 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Prénom</p>
              <p className="font-medium">
                {getFirstName() || 'Non renseigné'}
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <FaIdCard className="text-blue-500 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Nom</p>
              <p className="font-medium">
                {getLastName() || 'Non renseigné'}
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <FaEnvelope className="text-blue-500 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{alumniProfile?.personalInfo?.email || session.user.email}</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <FaUserTag className="text-blue-500 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Rôle</p>
              <p className="font-medium capitalize">
                {session?.user?.role === 'admin' ? 'Administrateur' : 
                 session?.user?.role === 'user' ? 'Utilisateur' : 
                 session?.user?.role || 'Utilisateur'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section Profil Alumni */}
      {alumniProfile ? (
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Statut Alumni */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Statut Alumni Legacy University</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${alumniProfile.status.isVerified ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                    <span>{alumniProfile.status.isVerified ? 'Vérifié' : 'En attente de vérification'}</span>
                  </div>
                  <div className="text-sm opacity-90">
                    Profil complété à {alumniProfile.status.completionPercentage}%
                  </div>
                </div>
              </div>
              <FaGraduationCap className="text-4xl opacity-80" />
            </div>
          </div>

          {/* Informations Académiques */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FaGraduationCap className="text-blue-600" />
              Informations Académiques
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Faculté</p>
                <p className="font-medium">{getFacultyName(alumniProfile.academicInfo.facultyId)}</p>
              </div>
              
              {alumniProfile.academicInfo.departmentName && (
                <div>
                  <p className="text-sm text-gray-500">Département</p>
                  <p className="font-medium">{alumniProfile.academicInfo.departmentName}</p>
                </div>
              )}
              
              <div>
                <p className="text-sm text-gray-500">Diplôme</p>
                <p className="font-medium">{alumniProfile.academicInfo.degreeTitle}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Année de fin</p>
                <p className="font-medium">{alumniProfile.academicInfo.graduationYear}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Niveau</p>
                <p className="font-medium">{alumniProfile.academicInfo.degreeLevel}</p>
              </div>
              
              {alumniProfile.academicInfo.honors && (
                <div>
                  <p className="text-sm text-gray-500">Mentions</p>
                  <p className="font-medium">{alumniProfile.academicInfo.honors}</p>
                </div>
              )}
            </div>
          </div>

          {/* Informations Professionnelles */}
          {alumniProfile.professionalInfo.currentPosition && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FaBriefcase className="text-blue-600" />
                Informations Professionnelles
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Poste actuel</p>
                  <p className="font-medium">{alumniProfile.professionalInfo.currentPosition.jobTitle}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Entreprise</p>
                  <p className="font-medium">{alumniProfile.professionalInfo.currentPosition.company}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Secteur</p>
                  <p className="font-medium">{alumniProfile.professionalInfo.currentPosition.industry}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Localisation</p>
                  <p className="font-medium flex items-center gap-1">
                    <FaMapMarkerAlt className="text-red-500" />
                    {alumniProfile.professionalInfo.currentPosition.location}
                  </p>
                </div>
              </div>

              {alumniProfile.professionalInfo.skills.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm text-gray-500 mb-2">Compétences</p>
                  <div className="flex flex-wrap gap-2">
                    {alumniProfile.professionalInfo.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions rapides */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Actions rapides</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => router.push('/communities')}
                className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left"
              >
                <FaUsers className="text-blue-600 text-xl" />
                <div>
                  <p className="font-medium text-gray-900">Explorer les communautés</p>
                  <p className="text-sm text-gray-600">Trouvez vos camarades de promotion</p>
                </div>
              </button>
              
              <button
                onClick={() => router.push('/profile/complete')}
                className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left"
              >
                <FaEdit className="text-green-600 text-xl" />
                <div>
                  <p className="font-medium text-gray-900">Modifier mon profil</p>
                  <p className="text-sm text-gray-600">Compléter mes informations</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Call-to-action pour compléter le profil */
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-8 text-center">
          <FaGraduationCap className="text-6xl mx-auto mb-4 opacity-80" />
          <h3 className="text-2xl font-bold mb-4">Devenez un Alumni Leadership Academia University(LAU) !</h3>
          <p className="text-lg mb-6 opacity-90">
            Complétez votre profil pour rejoindre la communauté des diplômés et accéder à toutes les fonctionnalités.
          </p>
          <button
            onClick={() => router.push('/profile/complete')}
            className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Compléter mon profil Alumni
          </button>
        </div>
      )}
    </div>
  );
} 