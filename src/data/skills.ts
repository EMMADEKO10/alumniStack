// Liste des compétences professionnelles pour le formulaire de profil Alumni
export const PROFESSIONAL_SKILLS = [
  // Gestion et Leadership
  'Gestion de projet',
  'Leadership',
  'Management d\'équipe',
  'Gestion du temps',
  'Prise de décision',
  'Résolution de problèmes',
  'Planification stratégique',
  'Gestion du changement',
  'Coaching et mentorat',
  'Négociation',

  // Communication
  'Communication orale',
  'Communication écrite',
  'Présentation',
  'Rédaction technique',
  'Communication interpersonnelle',
  'Communication interculturelle',
  'Formation et enseignement',
  'Relations publiques',

  // Technologies et Informatique
  'Développement Web',
  'Développement Mobile',
  'Programmation (JavaScript)',
  'Programmation (Python)',
  'Programmation (Java)',
  'Programmation (C++)',
  'Programmation (C#)',
  'Base de données (SQL)',
  'Base de données (NoSQL)',
  'DevOps',
  'Cloud Computing (AWS)',
  'Cloud Computing (Azure)',
  'Cloud Computing (Google Cloud)',
  'Intelligence Artificielle',
  'Machine Learning',
  'Data Science',
  'Analyse de données',
  'Cybersécurité',
  'Réseaux informatiques',
  'Administration système',
  'Automatisation',
  'Blockchain',

  // Design et Créativité
  'Design graphique',
  'UI/UX Design',
  'Design web',
  'Photographie',
  'Vidéo et montage',
  'Marketing digital',
  'Branding',
  'Créativité',

  // Finance et Comptabilité
  'Finance',
  'Comptabilité',
  'Analyse financière',
  'Gestion budgétaire',
  'Audit',
  'Fiscalité',
  'Investissement',
  'Banque',

  // Marketing et Ventes
  'Marketing',
  'Marketing digital',
  'SEO/SEM',
  'Réseaux sociaux',
  'Content Marketing',
  'Email Marketing',
  'Ventes',
  'Relation client',
  'E-commerce',
  'Publicité',

  // Santé et Médical
  'Médecine générale',
  'Médecine spécialisée',
  'Soins infirmiers',
  'Pharmacie',
  'Psychologie',
  'Thérapie',
  'Santé publique',
  'Recherche médicale',

  // Ingénierie
  'Ingénierie civile',
  'Ingénierie mécanique',
  'Ingénierie électrique',
  'Ingénierie chimique',
  'Ingénierie logicielle',
  'Architecture',
  'Conception technique',
  'Contrôle qualité',

  // Éducation et Formation
  'Enseignement',
  'Formation professionnelle',
  'Développement curriculaire',
  'Évaluation pédagogique',
  'Recherche académique',
  'Mentorat éducatif',

  // Droit et Juridique
  'Droit civil',
  'Droit commercial',
  'Droit pénal',
  'Droit international',
  'Conseil juridique',
  'Médiation',
  'Arbitrage',

  // Ressources Humaines
  'Recrutement',
  'Gestion des talents',
  'Formation du personnel',
  'Évaluation de performance',
  'Relations du travail',
  'Développement organisationnel',

  // Langues
  'Français (natif)',
  'Anglais (courant)',
  'Anglais (intermédiaire)',
  'Espagnol',
  'Portugais',
  'Arabe',
  'Chinois',
  'Traduction',
  'Interprétation',

  // Autres
  'Recherche',
  'Analyse critique',
  'Pensée analytique',
  'Innovation',
  'Entrepreneuriat',
  'Consulting',
  'Audit interne',
  'Contrôle qualité',
  'Logistique',
  'Supply Chain',
  'Gestion des risques',
  'Conformité réglementaire'
];

// Fonction utilitaire pour obtenir les compétences triées par ordre alphabétique
export const getSortedSkills = () => {
  return [...PROFESSIONAL_SKILLS].sort((a, b) => a.localeCompare(b, 'fr'));
};

// Fonction utilitaire pour rechercher une compétence
export const searchSkill = (query: string) => {
  const normalizedQuery = query.toLowerCase().trim();
  return PROFESSIONAL_SKILLS.filter(skill => 
    skill.toLowerCase().includes(normalizedQuery)
  );
};

// Fonction pour obtenir les compétences par catégorie
export const getSkillsByCategory = () => {
  return {
    'Gestion et Leadership': PROFESSIONAL_SKILLS.slice(0, 10),
    'Communication': PROFESSIONAL_SKILLS.slice(10, 18),
    'Technologies et Informatique': PROFESSIONAL_SKILLS.slice(18, 40),
    'Design et Créativité': PROFESSIONAL_SKILLS.slice(40, 48),
    'Finance et Comptabilité': PROFESSIONAL_SKILLS.slice(48, 56),
    'Marketing et Ventes': PROFESSIONAL_SKILLS.slice(56, 66),
    'Santé et Médical': PROFESSIONAL_SKILLS.slice(66, 74),
    'Ingénierie': PROFESSIONAL_SKILLS.slice(74, 82),
    'Éducation et Formation': PROFESSIONAL_SKILLS.slice(82, 88),
    'Droit et Juridique': PROFESSIONAL_SKILLS.slice(88, 95),
    'Ressources Humaines': PROFESSIONAL_SKILLS.slice(95, 101),
    'Langues': PROFESSIONAL_SKILLS.slice(101, 110),
    'Autres': PROFESSIONAL_SKILLS.slice(110)
  };
};
