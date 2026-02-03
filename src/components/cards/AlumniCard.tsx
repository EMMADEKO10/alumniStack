import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { PublicAlumniProfile } from '../../types/alumni';
import { 
  FaGraduationCap, 
  FaBuilding, 
  FaMapMarkerAlt, 
  FaLinkedin, 
  FaGlobe, 
  FaEnvelope, 
  FaBriefcase,
  FaTools,
  FaCalendarAlt,
  FaEye,
  FaUserTie
} from 'react-icons/fa';

interface AlumniCardProps {
  alumni: PublicAlumniProfile;
  onClick?: (alumni: PublicAlumniProfile) => void;
}

const AlumniCard: React.FC<AlumniCardProps> = ({ alumni, onClick }) => {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

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

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Link href={`/alumni/${alumni.userId}`}>
      <motion.div 
        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden group relative h-full flex flex-col"
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        layout
      >
        {/* Badge de faculté */}
        <div className={`absolute top-0 right-0 w-20 h-20 bg-linear-to-br ${getFacultyColor(alumni.academicInfo.facultyId)} rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity`}></div>
        
        <div className="p-4 sm:p-6 relative flex flex-col flex-1">
          {/* Header avec photo et nom */}
          <div className="flex items-start space-x-3 sm:space-x-4 mb-3 sm:mb-4">
            <div className={`w-12 h-12 sm:w-16 sm:h-16 shrink-0 relative bg-linear-to-br ${getFacultyColor(alumni.academicInfo.facultyId)} rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-md group-hover:shadow-lg transition-shadow overflow-hidden`}>
              {alumni.personalInfo.profilePicture ? (
                <Image 
                  src={alumni.personalInfo.profilePicture} 
                  alt={`${alumni.personalInfo.firstName} ${alumni.personalInfo.lastName}`}
                  fill
                  className="object-cover"
                />
              ) : (
                getInitials(alumni.personalInfo.firstName, alumni.personalInfo.lastName)
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-0.5 sm:mb-1 leading-tight group-hover:text-red-600 transition-colors truncate">
                {alumni.personalInfo.firstName} {alumni.personalInfo.lastName}
              </h3>
              <div className="flex items-center text-gray-600 mb-1 sm:mb-2">
                <FaUserTie className="w-3 h-3 mr-1.5 sm:mr-2 shrink-0" />
                <span className="text-xs sm:text-sm font-medium truncate">
                  {alumni.professionalInfo.currentPosition?.jobTitle || 'Diplômé'}
                </span>
              </div>
              <div className="flex items-center text-gray-500">
                <FaBuilding className="w-3 h-3 mr-1.5 sm:mr-2 shrink-0" />
                <span className="text-xs sm:text-sm truncate">
                  {alumni.professionalInfo.currentPosition?.company || 'Non spécifié'}
                </span>
              </div>
            </div>
          </div>

          {/* Informations académiques */}
          <div className="bg-gray-50 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 group-hover:bg-gray-100 transition-colors">
            <div className="flex items-center justify-between mb-1.5 sm:mb-2 text-xs sm:text-sm">
              <div className="flex items-center text-gray-600">
                <FaGraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                <span className="font-medium">Faculté</span>
              </div>
              <span className="font-semibold text-gray-900">
                {getFacultyName(alumni.academicInfo.facultyId)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center text-gray-600">
                <FaCalendarAlt className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                <span className="font-medium">Promotion</span>
              </div>
              <span className="font-semibold text-gray-900">
                {alumni.academicInfo.graduationYear}
              </span>
            </div>
          </div>

          {/* Compétences */}
          {alumni.professionalInfo.skills && alumni.professionalInfo.skills.length > 0 && (
            <div className="mb-3 sm:mb-4">
              <div className="flex items-center mb-1.5 sm:mb-2 text-gray-600 text-xs sm:text-sm">
                <FaTools className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                <span className="font-medium">Compétences</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {alumni.professionalInfo.skills.slice(0, 2).map((skill, index) => (
                  <span 
                    key={index}
                    className={`inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium bg-linear-to-r ${getFacultyColor(alumni.academicInfo.facultyId)} text-white shadow-sm`}
                  >
                    {skill}
                  </span>
                ))}
                {alumni.professionalInfo.skills.length > 2 && (
                  <span className="inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium bg-gray-200 text-gray-700">
                    +{alumni.professionalInfo.skills.length - 2}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Bio courte - Auto push to bottom */}
          {alumni.personalInfo.bio && (
            <div className="mb-3 sm:mb-4 flex-1">
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2">
                {truncateText(alumni.personalInfo.bio, 80)}
              </p>
            </div>
          )}

          {/* Localisation */}
          {alumni.contactInfo?.currentAddress && (
            <div className="flex items-center text-gray-500 mb-3 sm:mb-4 text-xs sm:text-sm">
              <FaMapMarkerAlt className="w-3 h-3 mr-1.5 sm:mr-2 shrink-0" />
              <span className="truncate">
                {alumni.contactInfo.currentAddress.city}, {alumni.contactInfo.currentAddress.country}
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-200 mt-auto">
            <div className="flex space-x-2.5 sm:space-x-3">
              {alumni.personalInfo.linkedinUrl && (
                <span className="text-blue-600 hover:text-blue-800 transition-colors hover:scale-110 transform">
                  <FaLinkedin className="w-4 h-4" />
                </span>
              )}
              {alumni.personalInfo.email && (
                <span className="text-gray-600 hover:text-gray-800 transition-colors hover:scale-110 transform">
                  <FaEnvelope className="w-4 h-4" />
                </span>
              )}
            </div>
            <div className="flex items-center space-x-1.5 sm:space-x-2 text-red-600 hover:text-red-700 font-bold text-xs sm:text-sm transition-all duration-200">
              <FaEye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Voir le profil</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default AlumniCard; 
