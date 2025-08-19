// Types pour les données Alumni - Université de Kinshasa
import { ObjectId } from 'mongodb';
import { CommunityType } from './community';

export interface AlumniProfile {
  _id?: ObjectId;
  userId: string; // Référence vers l'utilisateur
  
  // Informations personnelles étendues
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    dateOfBirth?: Date;
    gender?: 'M' | 'F' | 'Autre' | 'Préfère ne pas dire';
    nationality?: string;
    profilePicture?: string;
    bio?: string;
    linkedinUrl?: string;
    websiteUrl?: string;
  };

  // Informations académiques
  academicInfo: {
    studentId?: string; // Numéro d'étudiant
    facultyId: string; // Référence vers LEGACY_FACULTIES
    departmentName?: string;
    specializationField?: string; // Spécialisation
    degreeLevel: 'Licence' | 'Master' | 'Doctorat' | 'Autre';
    degreeTitle: string; // Titre du diplôme
    graduationYear: number; // Année de fin d'études
    graduationDate?: Date; // Date exacte de diplôme
    honors?: 'Summa Cum Laude' | 'Magna Cum Laude' | 'Cum Laude' | 'Mention Bien' | 'Mention Très Bien' | 'Aucune';
    thesis?: {
      title: string;
      supervisor: string;
      abstract?: string;
    };
  };

  // Coordonnées et adresses
  contactInfo: {
    // Adresse actuelle
    currentAddress?: {
      street: string;
      city: string;
      province: string;
      country: string;
      postalCode?: string;
    };
    // Adresse d'origine
    originAddress?: {
      street?: string;
      city: string;
      province: string;
      country: string;
    };
    // Coordonnées d'urgence
    emergencyContact?: {
      name: string;
      relationship: string;
      phone: string;
      email?: string;
    };
  };

  // Informations professionnelles
  professionalInfo: {
    currentPosition?: {
      jobTitle: string;
      company: string;
      industry: string; // Référence vers PROFESSIONAL_SECTORS
      startDate: Date;
      location: string;
      description?: string;
    };
    experience: ProfessionalExperience[];
    skills: string[];
    certifications?: Certification[];
    languages: Language[];
  };

  // Préférences de communauté
  communityPreferences: {
    interestedCommunityTypes: CommunityType[];
    autoJoinByPromotion: boolean;
    autoJoinByFaculty: boolean;
    autoJoinByRegion: boolean;
    autoJoinByProfession: boolean;
    preferredRegions: string[];
    mentorshipInterest: 'Mentor' | 'Mentee' | 'Both' | 'None';
    networkingPreference: 'Active' | 'Modéré' | 'Minimal';
  };

  // Paramètres de confidentialité
  privacySettings: {
    profileVisibility: 'Public' | 'Alumni seulement' | 'Privé';
    showEmail: boolean;
    showPhone: boolean;
    showAddress: boolean;
    showWorkInfo: boolean;
    allowDirectMessages: boolean;
    allowJobOffers: boolean;
    newsletterSubscription: boolean;
  };

  // Statut et validation
  status: {
    isVerified: boolean; // Profil vérifié par l'administration
    isComplete: boolean; // Profil complet (calculé automatiquement)
    completionPercentage: number; // Pourcentage de complétion
    verificationDate?: Date;
    verifiedBy?: string; // ID de l'administrateur
    lastLoginDate?: Date;
  };

  // Métadonnées
  createdAt: Date;
  updatedAt: Date;
  lastProfileUpdate?: Date;
}

// Expérience professionnelle
export interface ProfessionalExperience {
  jobTitle: string;
  company: string;
  industry: string;
  location: string;
  startDate: Date;
  endDate?: Date; // null si poste actuel
  description?: string;
  achievements?: string[];
}

// Certifications
export interface Certification {
  name: string;
  issuingOrganization: string;
  issueDate: Date;
  expirationDate?: Date;
  credentialId?: string;
  credentialUrl?: string;
}

// Langues
export interface Language {
  language: string;
  proficiency: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Courant' | 'Natif';
  certificationLevel?: string; // ex: "B2", "C1", etc.
}

// Type pour la création/mise à jour partielle
export type AlumniProfileUpdate = Partial<AlumniProfile>;

// Type pour l'affichage public (informations filtrées selon les préférences)
export interface PublicAlumniProfile {
  _id: ObjectId;
  personalInfo: {
    firstName: string;
    lastName: string;
    email?: string; // Selon préférences
    profilePicture?: string;
    bio?: string;
    linkedinUrl?: string;
    websiteUrl?: string;
  };
  academicInfo: {
    facultyId: string;
    departmentName?: string;
    degreeLevel: string;
    degreeTitle: string;
    graduationYear: number;
  };
  professionalInfo: {
    currentPosition?: {
      jobTitle: string;
      company: string;
      industry: string;
      location: string;
    };
    skills: string[];
  };
  contactInfo?: {
    currentAddress?: {
      city: string;
      province: string;
      country: string;
    };
  };
  createdAt?: Date; // Date de création du profil
}

// Statistiques du profil
export interface ProfileStats {
  totalAlumni: number;
  verifiedProfiles: number;
  completeProfiles: number;
  averageCompletionRate: number;
  profilesByFaculty: Record<string, number>;
  profilesByGraduationYear: Record<number, number>;
  profilesByRegion: Record<string, number>;
  profilesByIndustry: Record<string, number>;
}

// Validation et helpers
export const DEGREE_LEVELS = [
  'Licence',
  'Master', 
  'Doctorat',
  'Autre'
] as const;

export const HONORS_LEVELS = [
  'Summa Cum Laude',
  'Magna Cum Laude', 
  'Cum Laude',
  'Mention Bien',
  'Mention Très Bien',
  'Aucune'
] as const;

export const LANGUAGE_PROFICIENCY = [
  'Débutant',
  'Intermédiaire',
  'Avancé',
  'Courant',
  'Natif'
] as const;

export const MENTORSHIP_TYPES = [
  'Mentor',
  'Mentee', 
  'Both',
  'None'
] as const;

export const NETWORKING_PREFERENCES = [
  'Active',
  'Modéré',
  'Minimal'
] as const;

export const PROFILE_VISIBILITY = [
  'Public',
  'Alumni seulement',
  'Privé'
] as const;

// Fonction pour calculer le pourcentage de complétion
export function calculateProfileCompletion(profile: AlumniProfile): number {
  const requiredFields = [
    // Informations personnelles (30%)
    profile.personalInfo.firstName,
    profile.personalInfo.lastName,
    profile.personalInfo.email,
    
    // Informations académiques (40%)
    profile.academicInfo.facultyId,
    profile.academicInfo.degreeLevel,
    profile.academicInfo.degreeTitle,
    profile.academicInfo.graduationYear,
    
    // Informations de contact (20%)
    profile.contactInfo.currentAddress?.city,
    profile.contactInfo.currentAddress?.province,
    profile.contactInfo.currentAddress?.country,
  ];

  const optionalFields = [
    // Informations personnelles étendues (10%)
    profile.personalInfo.phone,
    profile.personalInfo.bio,
    profile.personalInfo.linkedinUrl,
    
    // Informations académiques étendues
    profile.academicInfo.departmentName,
    profile.academicInfo.specializationField,
    
    // Informations professionnelles
    profile.professionalInfo.currentPosition,
    profile.professionalInfo.skills.length > 0,
    
    // Préférences
    profile.communityPreferences.interestedCommunityTypes.length > 0,
  ];

  const filledRequired = requiredFields.filter(field => 
    field !== undefined && field !== null && field !== ''
  ).length;
  
  const filledOptional = optionalFields.filter(field => 
    field !== undefined && field !== null && field !== '' && field !== false
  ).length;

  const requiredScore = (filledRequired / requiredFields.length) * 80; // 80% pour les champs obligatoires
  const optionalScore = (filledOptional / optionalFields.length) * 20; // 20% pour les champs optionnels

  return Math.round(requiredScore + optionalScore);
}

// Fonction pour valider si un profil est complet
export function isProfileComplete(profile: AlumniProfile): boolean {
  return calculateProfileCompletion(profile) >= 80; // 80% minimum pour être considéré comme complet
} 