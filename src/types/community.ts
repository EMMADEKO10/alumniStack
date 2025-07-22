// Types pour l'architecture communautaire de Leadership Academy
import { ObjectId } from 'mongodb';

export interface Faculty {
  id: string;
  name: string;
  code: string;
  description: string;
  departments: Department[];
  createdAt: Date;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  facultyId: string;
  description: string;
  createdAt: Date;
}

export enum CommunityType {
  PROMOTION = 'promotion',
  FACULTY = 'faculty',
  DEPARTMENT = 'department',
  REGION = 'region',
  PROFESSION = 'profession'
}

export interface Community {
  _id?: ObjectId;
  name: string;
  description: string;
  type: CommunityType;
  
  // Spécifique à chaque type
  promotionYear?: number; // Pour type 'promotion'
  facultyId?: string;     // Pour type 'faculty'
  departmentId?: string;  // Pour type 'department'
  region?: string;        // Pour type 'region'
  profession?: string;    // Pour type 'profession'
  
  // Métadonnées
  memberCount: number;
  isActive: boolean;
  privacy: 'public' | 'private' | 'restricted';
  
  // Administration
  moderators: string[]; // IDs des modérateurs
  rules?: string[];
  
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunityMember {
  _id?: ObjectId;
  userId: string;
  communityId: string;
  role: 'member' | 'moderator' | 'admin';
  joinedAt: Date;
  isActive: boolean;
}

export interface CommunityPost {
  _id?: ObjectId;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  communityId: string;
  
  // Classification
  category: string;
  tags: string[];
  
  // Engagement
  likes: string[]; // IDs des utilisateurs
  comments: CommunityComment[];
  
  // Média
  imageUrl?: string;
  attachments?: string[];
  
  // Modération
  isApproved: boolean;
  isPinned: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunityComment {
  _id?: ObjectId;
  content: string;
  authorId: string;
  authorName: string;
  parentCommentId?: ObjectId; // Pour les réponses
  likes: string[];
  createdAt: Date;
}

// Configuration des facultés de Leadership Academy (depuis 2012)
export const LEADERSHIP_ACADEMY_FACULTIES: Omit<Faculty, '_id' | 'createdAt'>[] = [
  {
    id: 'fac_medecine',
    name: 'Faculté de Médecine',
    code: 'MED',
    description: 'Formation en sciences médicales et santé',
    departments: [
      { id: 'dep_med_generale', name: 'Médecine Générale', code: 'MG', facultyId: 'fac_medecine', description: '', createdAt: new Date() },
      { id: 'dep_chirurgie', name: 'Chirurgie', code: 'CHR', facultyId: 'fac_medecine', description: '', createdAt: new Date() },
    ]
  },
  {
    id: 'fac_ingenierie',
    name: 'Faculté d\'Ingénierie',
    code: 'ING',
    description: 'Formation en sciences de l\'ingénieur',
    departments: [
      { id: 'dep_informatique', name: 'Informatique', code: 'INFO', facultyId: 'fac_ingenierie', description: '', createdAt: new Date() },
      { id: 'dep_civil', name: 'Génie Civil', code: 'GC', facultyId: 'fac_ingenierie', description: '', createdAt: new Date() },
    ]
  },
  {
    id: 'fac_economie',
    name: 'Faculté d\'Économie',
    code: 'ECO',
    description: 'Formation en sciences économiques et gestion',
    departments: [
      { id: 'dep_finance', name: 'Finance', code: 'FIN', facultyId: 'fac_economie', description: '', createdAt: new Date() },
      { id: 'dep_management', name: 'Management', code: 'MGT', facultyId: 'fac_economie', description: '', createdAt: new Date() },
    ]
  },
  {
    id: 'fac_droit',
    name: 'Faculté de Droit',
    code: 'DROIT',
    description: 'Formation en sciences juridiques',
    departments: []
  },
  {
    id: 'fac_lettres',
    name: 'Faculté des Lettres et Sciences Humaines',
    code: 'LSHS',
    description: 'Formation en lettres et sciences humaines',
    departments: []
  },
  {
    id: 'fac_sciences',
    name: 'Faculté des Sciences',
    code: 'SCI',
    description: 'Formation en sciences pures',
    departments: []
  },
  {
    id: 'fac_agriculture',
    name: 'Faculté d\'Agriculture',
    code: 'AGRI',
    description: 'Formation en sciences agricoles',
    departments: []
  },
  {
    id: 'fac_education',
    name: 'Faculté des Sciences de l\'Éducation',
    code: 'EDU',
    description: 'Formation pédagogique et éducative',
    departments: []
  }
];

// Régions principales pour la RDC
export const REGIONS = [
  'Kinshasa',
  'Gombe',
  'Lubumbashi',
  'Haut-Katanga',
  'Kikwit',
  'Matadi',
  'Mbandaka',
  'Kananga',
  'Mbuji-Mayi',
  'Bukavu',
  'Goma',
  'Autre'
];

// Secteurs professionnels principaux
export const PROFESSIONAL_SECTORS = [
  'Santé et Médecine',
  'Ingénierie et Technologie',
  'Finance et Banque',
  'Éducation et Formation',
  'Droit et Justice',
  'Agriculture et Environnement',
  'Commerce et Industrie',
  'Administration Publique',
  'ONG et Développement',
  'Recherche et Innovation',
  'Autre'
]; 