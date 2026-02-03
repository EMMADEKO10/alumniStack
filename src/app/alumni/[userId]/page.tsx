'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  FaBuilding, 
  FaMapMarkerAlt, 
  FaLinkedin, 
  FaEnvelope, 
  FaArrowLeft,
  FaUserTie,
  FaTools,
  FaBriefcase
} from 'react-icons/fa';
import { AlumniProfile } from '@/types/alumni';

export default function AlumniProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;

  const [alumni, setAlumni] = useState<AlumniProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/alumni/${userId}`);
        if (!res.ok) {
          if (res.status === 403) throw new Error('Ce profil est privé');
          if (res.status === 404) throw new Error('Profil non trouvé');
          throw new Error('Erreur lors du chargement');
        }
        const data = await res.json();
        setAlumni(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchProfile();
  }, [userId]);

  const getFacultyName = (facultyId: string) => {
    const facultyMapping: { [key: string]: string } = {
      'FACULTE_INFORMATIQUE': 'Informatique',
      'FACULTE_GESTION': 'Gestion',
      'FACULTE_DROIT': 'Droit',
      'FACULTE_MEDECINE': 'Médecine',
      'FACULTE_INGENIERIE': 'Ingénierie',
      'FACULTE_SCIENCES': 'Sciences',
      'FACULTE_ARTS': 'Arts et Lettres',
      'FACULTE_ECONOMIE': 'Économie',
    };
    return facultyMapping[facultyId] || facultyId;
  };

  const getFacultyColor = (facultyId: string) => {
    const colorMapping: { [key: string]: string } = {
      'FACULTE_INFORMATIQUE': 'from-blue-500 to-blue-600',
      'FACULTE_GESTION': 'from-green-500 to-green-600',
      'FACULTE_DROIT': 'from-purple-500 to-purple-600',
      'FACULTE_MEDECINE': 'from-red-500 to-red-600',
      'FACULTE_INGENIERIE': 'from-orange-500 to-orange-600',
      'FACULTE_SCIENCES': 'from-cyan-500 to-cyan-600',
      'FACULTE_ARTS': 'from-pink-500 to-pink-600',
      'FACULTE_ECONOMIE': 'from-yellow-500 to-yellow-600',
    };
    return colorMapping[facultyId] || 'from-gray-500 to-gray-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error || !alumni) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || 'Erreur inconnue'}</h2>
        <Link href="/communities" className="text-red-600 hover:underline flex items-center gap-2">
          <FaArrowLeft /> Retour à la directory
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors font-medium"
        >
          <FaArrowLeft /> Retour
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar: Photo & Key Info */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-xl overflow-hidden"
            >
              <div className={`h-32 bg-linear-to-br ${getFacultyColor(alumni.academicInfo.facultyId)} overflow-hidden relative`}>
                <div className="absolute inset-0 bg-black/10"></div>
              </div>
              <div className="px-6 pb-8 text-center -mt-16">
                <div className="relative inline-block">
                  <div className={`w-32 h-32 rounded-3xl border-4 border-white shadow-2xl overflow-hidden bg-white mx-auto`}>
                    {alumni.personalInfo.profilePicture ? (
                      <Image 
                        src={alumni.personalInfo.profilePicture} 
                        alt={`${alumni.personalInfo.firstName} ${alumni.personalInfo.lastName}`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center text-3xl font-bold text-white bg-linear-to-br ${getFacultyColor(alumni.academicInfo.facultyId)}`}>
                        {alumni.personalInfo.firstName[0]}{alumni.personalInfo.lastName[0]}
                      </div>
                    )}
                  </div>
                </div>
                
                <h1 className="mt-4 text-2xl font-black text-gray-900 leading-tight">
                  {alumni.personalInfo.firstName} {alumni.personalInfo.lastName}
                </h1>
                <p className="text-red-600 font-bold text-sm mt-1 uppercase tracking-wider">
                  Promo {alumni.academicInfo.graduationYear}
                </p>
                <p className="text-gray-500 text-sm mt-2 flex items-center justify-center gap-2">
                  <FaBuilding className="shrink-0" />
                  {alumni.professionalInfo.currentPosition?.company || 'Indépendant'}
                </p>

                <div className="mt-8 flex flex-col gap-3">
                  {alumni.personalInfo.linkedinUrl && (
                    <a 
                      href={alumni.personalInfo.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-[#0077b5] text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-blue-100"
                    >
                      <FaLinkedin className="text-xl" />
                      Profil LinkedIn
                    </a>
                  )}
                  {alumni.personalInfo.email && (
                    <a 
                      href={`mailto:${alumni.personalInfo.email}`}
                      className="w-full bg-gray-900 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg shadow-gray-200"
                    >
                      <FaEnvelope />
                      Contacter par Email
                    </a>
                  )}
                  {alumni.personalInfo.websiteUrl && (
                    <a 
                      href={alumni.personalInfo.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold text-gray-500 hover:text-red-600 transition-colors py-2"
                    >
                      Visiter le site web
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Content: Bio, Experience, Skills */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-sm p-8"
            >
              <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                  <FaUserTie />
                </div>
                À propos
              </h2>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                {alumni.personalInfo.bio || "Aucune biographie fournie."}
              </p>
              
              {alumni.contactInfo?.currentAddress && (
                <div className="mt-6 flex items-center gap-3 text-gray-500 text-sm">
                  <FaMapMarkerAlt className="text-red-600" />
                  {alumni.contactInfo.currentAddress.city}, {alumni.contactInfo.currentAddress.country}
                </div>
              )}
            </motion.div>

            {/* Academic & Professional Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl shadow-sm p-8"
              >
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Formation</h3>
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    LAU
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 leading-tight">
                      {getFacultyName(alumni.academicInfo.facultyId)}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">{alumni.academicInfo.degreeLevel} - {alumni.academicInfo.graduationYear}</p>
                    {alumni.academicInfo.degreeTitle && (
                      <p className="text-xs text-red-600 font-bold mt-2 bg-red-50 inline-block px-2 py-1 rounded-md">
                        {alumni.academicInfo.degreeTitle}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-3xl shadow-sm p-8"
              >
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Emploi actuel</h3>
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                    <FaBriefcase />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 leading-tight">
                      {alumni.professionalInfo.currentPosition?.jobTitle || 'En poste'}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {alumni.professionalInfo.currentPosition?.company || 'Non spécifié'}
                    </p>
                    {alumni.professionalInfo.currentPosition?.industry && (
                      <p className="text-xs text-gray-400 mt-2">
                        Secteur : {alumni.professionalInfo.currentPosition.industry}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Skills */}
            {alumni.professionalInfo.skills && alumni.professionalInfo.skills.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-3xl shadow-sm p-8"
              >
                <h2 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <FaTools />
                  </div>
                  Expertise & Compétences
                </h2>
                <div className="flex flex-wrap gap-2">
                  {alumni.professionalInfo.skills.map((skill: string, index: number) => (
                    <span 
                      key={index}
                      className="px-4 py-2 bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl border border-gray-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
