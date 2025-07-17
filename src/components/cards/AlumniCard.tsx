import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PublicAlumniProfile } from '../../types/alumni';
import { 
  FaGraduationCap, 
  FaBuilding, 
  FaMapMarkerAlt, 
  FaLinkedin, 
  FaGlobe, 
  FaEnvelope, 
  FaTimes,
  FaUser,
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

// Composant Modal séparé
const AlumniModal: React.FC<{
  alumni: PublicAlumniProfile;
  isOpen: boolean;
  onClose: () => void;
}> = ({ alumni, isOpen, onClose }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header du modal */}
            <div className={`bg-gradient-to-r ${getFacultyColor(alumni.academicInfo.facultyId)} p-6 text-white relative`}>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/20"
              >
                <FaTimes className="w-5 h-5" />
              </button>
              
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl backdrop-blur-sm">
                  {alumni.personalInfo.profilePicture ? (
                    <img 
                      src={alumni.personalInfo.profilePicture} 
                      alt={`${alumni.personalInfo.firstName} ${alumni.personalInfo.lastName}`}
                      className="w-full h-full rounded-2xl object-cover"
                    />
                  ) : (
                    getInitials(alumni.personalInfo.firstName, alumni.personalInfo.lastName)
                  )}
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    {alumni.personalInfo.firstName} {alumni.personalInfo.lastName}
                  </h2>
                  <p className="text-white/90 text-lg mb-1">
                    {alumni.professionalInfo.currentPosition?.jobTitle || 'Diplômé'}
                  </p>
                  <p className="text-white/80">
                    {alumni.professionalInfo.currentPosition?.company || 'Non spécifié'}
                  </p>
                </div>
              </div>
            </div>

            {/* Contenu du modal avec scroll */}
            <div className="overflow-y-auto max-h-[calc(90vh-160px)]">
              <div className="p-8 space-y-8">
                
                {/* Informations personnelles */}
                <div>
                  <h3 className="flex items-center text-xl font-bold text-gray-900 mb-4">
                    <FaUser className="w-5 h-5 mr-3 text-red-600" />
                    Informations personnelles
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-6">
                    {alumni.personalInfo.bio && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Biographie</h4>
                        <p className="text-gray-600 leading-relaxed">
                          {alumni.personalInfo.bio}
                        </p>
                      </div>
                    )}
                    {alumni.personalInfo.email && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Email</h4>
                        <p className="text-gray-600">{alumni.personalInfo.email}</p>
                      </div>
                    )}
                    {alumni.contactInfo?.currentAddress && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Localisation</h4>
                        <p className="text-gray-600">
                          {alumni.contactInfo.currentAddress.city}, {alumni.contactInfo.currentAddress.country}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Informations académiques */}
                <div>
                  <h3 className="flex items-center text-xl font-bold text-gray-900 mb-4">
                    <FaGraduationCap className="w-5 h-5 mr-3 text-red-600" />
                    Informations académiques
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Faculté</h4>
                        <p className="text-gray-600">{getFacultyName(alumni.academicInfo.facultyId)}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Promotion</h4>
                        <p className="text-gray-600">{alumni.academicInfo.graduationYear}</p>
                      </div>
                      {alumni.academicInfo.degreeTitle && (
                        <div className="md:col-span-2">
                          <h4 className="font-semibold text-gray-900 mb-2">Diplôme</h4>
                          <p className="text-gray-600">{alumni.academicInfo.degreeTitle}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Informations professionnelles */}
                {alumni.professionalInfo.currentPosition && (
                  <div>
                    <h3 className="flex items-center text-xl font-bold text-gray-900 mb-4">
                      <FaBriefcase className="w-5 h-5 mr-3 text-red-600" />
                      Informations professionnelles
                    </h3>
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Poste</h4>
                          <p className="text-gray-600">{alumni.professionalInfo.currentPosition.jobTitle}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Entreprise</h4>
                          <p className="text-gray-600">{alumni.professionalInfo.currentPosition.company}</p>
                        </div>
                        {alumni.professionalInfo.currentPosition.industry && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Secteur</h4>
                            <p className="text-gray-600">{alumni.professionalInfo.currentPosition.industry}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Compétences */}
                {alumni.professionalInfo.skills && alumni.professionalInfo.skills.length > 0 && (
                  <div>
                    <h3 className="flex items-center text-xl font-bold text-gray-900 mb-4">
                      <FaTools className="w-5 h-5 mr-3 text-red-600" />
                      Compétences
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {alumni.professionalInfo.skills.map((skill, index) => (
                        <span 
                          key={index}
                          className={`px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r ${getFacultyColor(alumni.academicInfo.facultyId)} text-white`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  {alumni.personalInfo.linkedinUrl && (
                    <a 
                      href={alumni.personalInfo.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      <FaLinkedin className="w-5 h-5" />
                      LinkedIn
                    </a>
                  )}
                  {alumni.personalInfo.email && (
                    <a 
                      href={`mailto:${alumni.personalInfo.email}`}
                      className="flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                    >
                      <FaEnvelope className="w-5 h-5" />
                      Contacter
                    </a>
                  )}
                  {alumni.personalInfo.websiteUrl && (
                    <a 
                      href={alumni.personalInfo.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                    >
                      <FaGlobe className="w-5 h-5" />
                      Site web
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

const AlumniCard: React.FC<AlumniCardProps> = ({ alumni, onClick }) => {
  const [showModal, setShowModal] = useState(false);

  const handleCardClick = () => {
    if (onClick) {
      onClick(alumni);
    }
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

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
    <>
      <motion.div 
        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden group relative"
        onClick={handleCardClick}
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        layout
      >
        {/* Badge de faculté */}
        <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${getFacultyColor(alumni.academicInfo.facultyId)} rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity`}></div>
        
        <div className="p-6 relative">
        {/* Header avec photo et nom */}
          <div className="flex items-start space-x-4 mb-4">
            <div className={`w-16 h-16 bg-gradient-to-br ${getFacultyColor(alumni.academicInfo.facultyId)} rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-xl transition-shadow`}>
            {alumni.personalInfo.profilePicture ? (
              <img 
                src={alumni.personalInfo.profilePicture} 
                alt={`${alumni.personalInfo.firstName} ${alumni.personalInfo.lastName}`}
                  className="w-full h-full rounded-2xl object-cover"
              />
            ) : (
              getInitials(alumni.personalInfo.firstName, alumni.personalInfo.lastName)
            )}
          </div>
          <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900 mb-1 leading-tight group-hover:text-red-600 transition-colors">
              {alumni.personalInfo.firstName} {alumni.personalInfo.lastName}
            </h3>
              <div className="flex items-center text-gray-600 mb-2">
                <FaUserTie className="w-3 h-3 mr-2" />
                <span className="text-sm font-medium truncate">
              {alumni.professionalInfo.currentPosition?.jobTitle || 'Diplômé'}
                </span>
          </div>
              <div className="flex items-center text-gray-500">
                <FaBuilding className="w-3 h-3 mr-2" />
                <span className="text-sm truncate">
                  {alumni.professionalInfo.currentPosition?.company || 'Non spécifié'}
            </span>
          </div>
            </div>
          </div>

          {/* Informations académiques */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4 group-hover:bg-gray-100 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center text-gray-600">
                <FaGraduationCap className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Faculté</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {getFacultyName(alumni.academicInfo.facultyId)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-600">
                <FaCalendarAlt className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Promotion</span>
        </div>
              <span className="text-sm font-semibold text-gray-900">
                {alumni.academicInfo.graduationYear}
              </span>
            </div>
          </div>

        {/* Compétences */}
        {alumni.professionalInfo.skills && alumni.professionalInfo.skills.length > 0 && (
          <div className="mb-4">
              <div className="flex items-center mb-2">
                <FaTools className="w-4 h-4 mr-2 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Compétences</span>
              </div>
            <div className="flex flex-wrap gap-1">
                {alumni.professionalInfo.skills.slice(0, 2).map((skill, index) => (
                <span 
                  key={index}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getFacultyColor(alumni.academicInfo.facultyId)} text-white shadow-sm`}
                >
                  {skill}
                </span>
              ))}
                {alumni.professionalInfo.skills.length > 2 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                    +{alumni.professionalInfo.skills.length - 2}
                </span>
              )}
            </div>
          </div>
        )}

          {/* Bio courte */}
        {alumni.personalInfo.bio && (
          <div className="mb-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                {truncateText(alumni.personalInfo.bio, 80)}
            </p>
          </div>
        )}

          {/* Localisation */}
          {alumni.contactInfo?.currentAddress && (
            <div className="flex items-center text-gray-500 mb-4">
              <FaMapMarkerAlt className="w-3 h-3 mr-2" />
              <span className="text-sm">
                {alumni.contactInfo.currentAddress.city}, {alumni.contactInfo.currentAddress.country}
              </span>
            </div>
          )}

          {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex space-x-3">
            {alumni.personalInfo.linkedinUrl && (
              <a 
                href={alumni.personalInfo.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 transition-colors hover:scale-110 transform"
                onClick={(e) => e.stopPropagation()}
              >
                  <FaLinkedin className="w-4 h-4" />
              </a>
            )}
            {alumni.personalInfo.websiteUrl && (
              <a 
                href={alumni.personalInfo.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-800 transition-colors hover:scale-110 transform"
                onClick={(e) => e.stopPropagation()}
              >
                  <FaGlobe className="w-4 h-4" />
              </a>
            )}
            {alumni.personalInfo.email && (
              <a 
                href={`mailto:${alumni.personalInfo.email}`}
                  className="text-gray-600 hover:text-gray-800 transition-colors hover:scale-110 transform"
                onClick={(e) => e.stopPropagation()}
              >
                  <FaEnvelope className="w-4 h-4" />
              </a>
            )}
          </div>
            <button
              onClick={handleViewDetails}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium text-sm transition-all duration-200 hover:scale-105 transform"
            >
              <FaEye className="w-4 h-4" />
              <span>Voir plus</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Modal utilisant un portal */}
      <AlumniModal 
        alumni={alumni}
        isOpen={showModal}
        onClose={closeModal}
      />
    </>
  );
};

export default AlumniCard; 