import React from 'react';
import { PublicAlumniProfile } from '../../types/alumni';

interface AlumniCardProps {
  alumni: PublicAlumniProfile;
  onClick?: (alumni: PublicAlumniProfile) => void;
}

const AlumniCard: React.FC<AlumniCardProps> = ({ alumni, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(alumni);
    }
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

  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-200 overflow-hidden"
      onClick={handleClick}
    >
      <div className="p-6">
        {/* Header avec photo et nom */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
            {alumni.personalInfo.profilePicture ? (
              <img 
                src={alumni.personalInfo.profilePicture} 
                alt={`${alumni.personalInfo.firstName} ${alumni.personalInfo.lastName}`}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              getInitials(alumni.personalInfo.firstName, alumni.personalInfo.lastName)
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {alumni.personalInfo.firstName} {alumni.personalInfo.lastName}
            </h3>
            <p className="text-sm text-gray-600 truncate">
              {alumni.professionalInfo.currentPosition?.jobTitle || 'Diplômé'}
            </p>
          </div>
        </div>

        {/* Informations académiques */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Faculté</span>
            <span className="text-sm font-medium text-gray-900">
              {getFacultyName(alumni.academicInfo.facultyId)}
            </span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Promotion</span>
            <span className="text-sm font-medium text-gray-900">
              {alumni.academicInfo.graduationYear}
            </span>
          </div>
          {alumni.academicInfo.degreeLevel && (
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Niveau</span>
              <span className="text-sm font-medium text-gray-900">
                {alumni.academicInfo.degreeLevel}
              </span>
            </div>
          )}
        </div>

        {/* Informations professionnelles */}
        {alumni.professionalInfo.currentPosition && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Entreprise</span>
              <span className="text-sm font-medium text-gray-900 truncate">
                {alumni.professionalInfo.currentPosition.company}
              </span>
            </div>
            {alumni.professionalInfo.currentPosition.industry && (
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Secteur</span>
                <span className="text-sm font-medium text-gray-900">
                  {alumni.professionalInfo.currentPosition.industry}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Compétences */}
        {alumni.professionalInfo.skills && alumni.professionalInfo.skills.length > 0 && (
          <div className="mb-4">
            <span className="text-sm text-gray-600 mb-2 block">Compétences</span>
            <div className="flex flex-wrap gap-1">
              {alumni.professionalInfo.skills.slice(0, 3).map((skill, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {skill}
                </span>
              ))}
              {alumni.professionalInfo.skills.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{alumni.professionalInfo.skills.length - 3} autres
                </span>
              )}
            </div>
          </div>
        )}

        {/* Bio */}
        {alumni.personalInfo.bio && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 line-clamp-2">
              {alumni.personalInfo.bio}
            </p>
          </div>
        )}

        {/* Liens sociaux */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex space-x-3">
            {alumni.personalInfo.linkedinUrl && (
              <a 
                href={alumni.personalInfo.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm"
                onClick={(e) => e.stopPropagation()}
              >
                LinkedIn
              </a>
            )}
            {alumni.personalInfo.websiteUrl && (
              <a 
                href={alumni.personalInfo.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800 text-sm"
                onClick={(e) => e.stopPropagation()}
              >
                Site web
              </a>
            )}
            {alumni.personalInfo.email && (
              <a 
                href={`mailto:${alumni.personalInfo.email}`}
                className="text-gray-600 hover:text-gray-800 text-sm"
                onClick={(e) => e.stopPropagation()}
              >
                Email
              </a>
            )}
          </div>
          <div className="text-xs text-gray-500">
            {alumni.contactInfo?.currentAddress && (
              <span>
                {alumni.contactInfo.currentAddress.city}, {alumni.contactInfo.currentAddress.country}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniCard; 