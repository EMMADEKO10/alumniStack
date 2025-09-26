'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { 
  AlumniProfile, 
  DEGREE_LEVELS, 
  LANGUAGE_PROFICIENCY, 
  MENTORSHIP_TYPES,
  NETWORKING_PREFERENCES,
  PROFILE_VISIBILITY 
} from '../../types/alumni';
import { LEADERSHIP_ACADEMY_FACULTIES, REGIONS, PROFESSIONAL_SECTORS } from '../../types/community';
import { NATIONALITIES } from '../../data/nationalities';
import { PROFESSIONAL_SKILLS } from '../../data/skills';
import SearchableSelect from '../ui/SearchableSelect';

interface AlumniProfileFormProps {
  initialData?: Partial<AlumniProfile>;
  onSubmit?: (data: Partial<AlumniProfile>) => void;
  isEditing?: boolean;
}

const AlumniProfileForm: React.FC<AlumniProfileFormProps> = ({ 
  initialData, 
  onSubmit, 
  isEditing = false 
}) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<AlumniProfile>>({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: session?.user?.email || '',
      phone: '',
      bio: '',
      linkedinUrl: '',
      websiteUrl: '',
      nationality: 'République Démocratique du Congo',
      ...initialData?.personalInfo
    },
    academicInfo: {
      facultyId: '',
      departmentName: '',
      specializationField: '',
      degreeLevel: 'Licence',
      graduationYear: new Date().getFullYear(),
      ...initialData?.academicInfo
    },
    contactInfo: {
      currentAddress: {
        city: '',
        province: '',
        country: 'République Démocratique du Congo'
      },
      ...initialData?.contactInfo
    },
    professionalInfo: {
      currentPosition: undefined,
      experience: [],
      skills: [],
      certifications: [],
      languages: [
        { language: 'Français', proficiency: 'Natif' },
        { language: 'Lingala', proficiency: 'Natif' }
      ],
      ...initialData?.professionalInfo
    },
    communityPreferences: {
      interestedCommunityTypes: [],
      autoJoinByPromotion: true,
      autoJoinByFaculty: true,
      autoJoinByRegion: false,
      autoJoinByProfession: false,
      preferredRegions: [],
      mentorshipInterest: 'None',
      networkingPreference: 'Modéré',
      mentorshipDescription: '',
      ...initialData?.communityPreferences
    },
    privacySettings: {
      profileVisibility: 'Alumni seulement',
      showEmail: false,
      showPhone: false,
      showAddress: false,
      showWorkInfo: true,
      allowDirectMessages: true,
      allowJobOffers: true,
      newsletterSubscription: true,
      ...initialData?.privacySettings
    }
  });

  const totalSteps = 5;

  const updateFormData = (section: keyof typeof formData, field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as Record<string, unknown>),
        [field]: value
      }
    }));
  };

  const updateNestedFormData = (section: keyof typeof formData, nestedField: string, field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as Record<string, unknown>),
        [nestedField]: {
          ...((prev[section] as Record<string, unknown>)?.[nestedField] as Record<string, unknown>),
          [field]: value
        }
      }
    }));
  };

  const addArrayItem = (section: keyof typeof formData, field: string, item: unknown) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as Record<string, unknown>),
        [field]: [...((prev[section] as Record<string, unknown>)?.[field] as unknown[] || []), item]
      }
    }));
  };

  const removeArrayItem = (section: keyof typeof formData, field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as Record<string, unknown>),
        [field]: ((prev[section] as Record<string, unknown>)?.[field] as unknown[] || []).filter((_, i) => i !== index)
      }
    }));
  };

  const toggleSkill = (skill: string) => {
    setFormData(prev => {
      const previousProfessionalInfo = prev.professionalInfo || {
        currentPosition: undefined,
        experience: [],
        skills: [],
        certifications: [],
        languages: [],
      };
      const currentSkills = (previousProfessionalInfo.skills || []) as string[];
      const hasSkill = currentSkills.includes(skill);
      const updatedSkills = hasSkill
        ? currentSkills.filter(s => s !== skill)
        : [...currentSkills, skill];
      return {
        ...prev,
        professionalInfo: {
          ...previousProfessionalInfo,
          skills: updatedSkills,
        }
      };
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      const method = isEditing ? 'PUT' : 'POST';
      const response = await fetch('/api/alumni', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        if (onSubmit) {
          onSubmit(result);
        } else {
          alert(isEditing ? 'Profil mis à jour avec succès !' : 'Profil créé avec succès !');
          window.location.href = '/profile';
        }
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.error}`);
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      alert('Erreur lors de la sauvegarde du profil');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = 2012; year <= currentYear + 1; year++) {
      years.push(year);
    }
    return years.reverse();
  };

  // Étape 1: Informations personnelles
  const renderPersonalInfoStep = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Informations Personnelles</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prénom *
          </label>
          <input
            type="text"
            value={formData.personalInfo?.firstName || ''}
            onChange={(e) => updateFormData('personalInfo', 'firstName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom *
          </label>
          <input
            type="text"
            value={formData.personalInfo?.lastName || ''}
            onChange={(e) => updateFormData('personalInfo', 'lastName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            value={formData.personalInfo?.email || ''}
            onChange={(e) => updateFormData('personalInfo', 'email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Téléphone
          </label>
          <input
            type="tel"
            value={formData.personalInfo?.phone || ''}
            onChange={(e) => updateFormData('personalInfo', 'phone', e.target.value)}
            placeholder="+243 XXX XXX XXX"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Genre
          </label>
          <select
            value={formData.personalInfo?.gender || ''}
            onChange={(e) => updateFormData('personalInfo', 'gender', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionner</option>
            <option value="M">Masculin</option>
            <option value="F">Féminin</option>
            <option value="Autre">Autre</option>
            <option value="Préfère ne pas dire">Préfère ne pas dire</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nationalité
          </label>
          <SearchableSelect
            options={NATIONALITIES}
            value={formData.personalInfo?.nationality || ''}
            onChange={(value) => updateFormData('personalInfo', 'nationality', value)}
            placeholder="Sélectionner une nationalité"
            maxHeight="200px"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Profil LinkedIn
        </label>
        <input
          type="url"
          value={formData.personalInfo?.linkedinUrl || ''}
          onChange={(e) => updateFormData('personalInfo', 'linkedinUrl', e.target.value)}
          placeholder="https://linkedin.com/in/votre-profil"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Biographie
        </label>
        <textarea
          value={formData.personalInfo?.bio || ''}
          onChange={(e) => updateFormData('personalInfo', 'bio', e.target.value)}
          rows={4}
          placeholder="Parlez-nous de vous, vos passions, vos objectifs..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  // Étape 2: Informations académiques
  const renderAcademicInfoStep = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Informations Académiques</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Faculté *
          </label>
          <SearchableSelect
            options={LEADERSHIP_ACADEMY_FACULTIES.map(faculty => `${faculty.name} (${faculty.code})`)}
            value={formData.academicInfo?.facultyId ? 
              LEADERSHIP_ACADEMY_FACULTIES.find(f => f.id === formData.academicInfo?.facultyId)?.name + 
              ' (' + LEADERSHIP_ACADEMY_FACULTIES.find(f => f.id === formData.academicInfo?.facultyId)?.code + ')' 
              : ''}
            onChange={(value) => {
              const faculty = LEADERSHIP_ACADEMY_FACULTIES.find(f => `${f.name} (${f.code})` === value);
              updateFormData('academicInfo', 'facultyId', faculty?.id || '');
            }}
            placeholder="Sélectionner une faculté"
            maxHeight="200px"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Département
          </label>
          <input
            type="text"
            value={formData.academicInfo?.departmentName || ''}
            onChange={(e) => updateFormData('academicInfo', 'departmentName', e.target.value)}
            placeholder="Ex: Informatique, Médecine Générale..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Niveau de diplôme *
          </label>
          <select
            value={formData.academicInfo?.degreeLevel || ''}
            onChange={(e) => updateFormData('academicInfo', 'degreeLevel', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            {DEGREE_LEVELS.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Année de fin d&apos;études *
          </label>
          <SearchableSelect
            options={generateYearOptions().map(year => year.toString())}
            value={formData.academicInfo?.graduationYear?.toString() || ''}
            onChange={(value) => updateFormData('academicInfo', 'graduationYear', parseInt(value))}
            placeholder="Sélectionner une année"
            maxHeight="200px"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Spécialisation
          </label>
          <input
            type="text"
            value={formData.academicInfo?.specializationField || ''}
            onChange={(e) => updateFormData('academicInfo', 'specializationField', e.target.value)}
            placeholder="Ex: Intelligence Artificielle, Cardiologie..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );

  // Étape 3: Informations de contact et localisation
  const renderContactInfoStep = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Informations de Contact</h3>
      <p className="text-sm text-gray-600 mb-4">
        Ces informations nous aident à vous connecter avec les communautés géographiques appropriées.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Région actuelle *
          </label>
          <SearchableSelect
            options={REGIONS}
            value={formData.contactInfo?.currentAddress?.province || ''}
            onChange={(value) => updateNestedFormData('contactInfo', 'currentAddress', 'province', value)}
            placeholder="Sélectionner une région"
            maxHeight="200px"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pays de résidence
          </label>
          <SearchableSelect
            options={NATIONALITIES}
            value={formData.contactInfo?.currentAddress?.country || ''}
            onChange={(value) => updateNestedFormData('contactInfo', 'currentAddress', 'country', value)}
            placeholder="Sélectionner un pays"
            maxHeight="200px"
          />
        </div>
      </div>
    </div>
  );

  // Étape 4: Informations professionnelles
  const renderProfessionalInfoStep = () => {
    const currentPosition = formData.professionalInfo?.currentPosition;
    const skills = formData.professionalInfo?.skills || [];
    const languages = formData.professionalInfo?.languages || [];

    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Informations Professionnelles</h3>
        <p className="text-sm text-gray-600 mb-4">
          Ces informations nous aident à vous connecter avec les bonnes communautés professionnelles.
        </p>
        
        <div className="space-y-6">
          {/* Position actuelle */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Position Actuelle</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre du poste *
                </label>
                                 <input
                   type="text"
                   value={currentPosition?.jobTitle || ''}
                   onChange={(e) => updateFormData('professionalInfo', 'currentPosition', {
                     ...currentPosition,
                     jobTitle: e.target.value
                   })}
                  placeholder="Ex: Développeur Full-Stack, Médecin..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Entreprise/Organisation *
                </label>
                <input
                  type="text"
                  value={currentPosition?.company || ''}
                  onChange={(e) => updateFormData('professionalInfo', 'currentPosition', {
                    ...currentPosition,
                    company: e.target.value
                  })}
                  placeholder="Nom de l'entreprise"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Secteur professionnel *
                </label>
                <SearchableSelect
                  options={PROFESSIONAL_SECTORS}
                  value={currentPosition?.industry || ''}
                  onChange={(value) => updateFormData('professionalInfo', 'currentPosition', {
                    ...currentPosition,
                    industry: value
                  })}
                  placeholder="Sélectionner un secteur"
                  maxHeight="200px"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description du poste
                </label>
                <textarea
                  value={currentPosition?.description || ''}
                  onChange={(e) => updateFormData('professionalInfo', 'currentPosition', {
                    ...currentPosition,
                    description: e.target.value
                  })}
                  rows={3}
                  placeholder="Décrivez vos responsabilités et réalisations..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Compétences */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Compétences</h4>
            
            <div className="space-y-4">
              {/* Sélection de compétences */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ajouter une compétence
                </label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <SearchableSelect
                      options={PROFESSIONAL_SKILLS}
                      value=""
                      onChange={(value) => {
                        if (value && !(skills as string[]).includes(value)) {
                          addArrayItem('professionalInfo', 'skills', value);
                        }
                      }}
                      placeholder="Rechercher une compétence..."
                      maxHeight="200px"
                    />
                  </div>
                </div>
              </div>

              {/* Compétences sélectionnées */}
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Compétences sélectionnées ({skills.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeArrayItem('professionalInfo', 'skills', index)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                {skills.length === 0 && (
                  <p className="text-sm text-gray-500 italic">
                    Aucune compétence sélectionnée. Utilisez le champ ci-dessus pour en ajouter.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Langues */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Langues</h4>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Langue..."
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="newLanguage"
                />
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="newLanguageProficiency"
                >
                  {['Débutant','Intermédiaire','Avancé'].map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => {
                    const langInput = document.getElementById('newLanguage') as HTMLInputElement;
                    const profSelect = document.getElementById('newLanguageProficiency') as HTMLSelectElement;
                    
                    if (langInput?.value.trim() && profSelect?.value) {
                      addArrayItem('professionalInfo', 'languages', {
                        language: langInput.value.trim(),
                        proficiency: profSelect.value
                      });
                      langInput.value = '';
                      profSelect.selectedIndex = 0;
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Ajouter
                </button>
              </div>

              <div className="space-y-2">
                {languages.map((lang, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-white rounded border"
                  >
                    <span>
                      <strong>{(lang as {language: string; proficiency: string}).language}</strong> - {(lang as {language: string; proficiency: string}).proficiency}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeArrayItem('professionalInfo', 'languages', index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Étape 5: Préférences communautaires
  const renderCommunityPreferencesStep = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Préférences Communautaires</h3>
      <p className="text-sm text-gray-600 mb-4">
        Configurez vos préférences pour rejoindre automatiquement les communautés qui vous intéressent.
      </p>
      
      <div className="space-y-6">
        {/* Adhésion automatique */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Adhésion Automatique</h4>
          
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.communityPreferences?.autoJoinByPromotion || false}
                onChange={(e) => updateFormData('communityPreferences', 'autoJoinByPromotion', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2">🎓 Rejoindre automatiquement ma promotion</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.communityPreferences?.autoJoinByFaculty || false}
                onChange={(e) => updateFormData('communityPreferences', 'autoJoinByFaculty', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2">🏛️ Rejoindre automatiquement ma faculté</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.communityPreferences?.autoJoinByRegion || false}
                onChange={(e) => updateFormData('communityPreferences', 'autoJoinByRegion', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2">🌍 Rejoindre automatiquement ma région</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.communityPreferences?.autoJoinByProfession || false}
                onChange={(e) => updateFormData('communityPreferences', 'autoJoinByProfession', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2">💼 Rejoindre automatiquement mon secteur professionnel</span>
            </label>
          </div>
        </div>

        {/* Préférences de mentorat */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Mentorat</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Intérêt pour le mentorat
            </label>
            <select
              value={formData.communityPreferences?.mentorshipInterest || 'None'}
              onChange={(e) => updateFormData('communityPreferences', 'mentorshipInterest', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {MENTORSHIP_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mentorat (description)
            </label>
            <textarea
              rows={3}
              value={formData.communityPreferences?.mentorshipDescription || ''}
              onChange={(e) => updateFormData('communityPreferences', 'mentorshipDescription', e.target.value)}
              placeholder="Décrivez vos attentes ou votre offre de mentorat (domaines, disponibilité, objectifs...)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Préférences de networking */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Networking</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Préférence de networking
            </label>
            <select
              value={formData.communityPreferences?.networkingPreference || 'Modéré'}
              onChange={(e) => updateFormData('communityPreferences', 'networkingPreference', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {NETWORKING_PREFERENCES.map(pref => (
                <option key={pref} value={pref}>{pref}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Paramètres de confidentialité */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Confidentialité</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Visibilité du profil
              </label>
              <select
                value={formData.privacySettings?.profileVisibility || 'Alumni seulement'}
                onChange={(e) => updateFormData('privacySettings', 'profileVisibility', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {PROFILE_VISIBILITY.map(visibility => (
                  <option key={visibility} value={visibility}>{visibility}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.privacySettings?.showEmail || false}
                  onChange={(e) => updateFormData('privacySettings', 'showEmail', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2">Afficher mon email</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.privacySettings?.showPhone || false}
                  onChange={(e) => updateFormData('privacySettings', 'showPhone', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2">Afficher mon téléphone</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.privacySettings?.allowDirectMessages || false}
                  onChange={(e) => updateFormData('privacySettings', 'allowDirectMessages', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2">Autoriser les messages directs</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.privacySettings?.allowJobOffers || false}
                  onChange={(e) => updateFormData('privacySettings', 'allowJobOffers', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2">Recevoir des offres d&apos;emploi</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Navigation
  const renderNavigation = () => (
    <div className="flex justify-between items-center pt-6 border-t">
      <button
        type="button"
        onClick={prevStep}
        disabled={currentStep === 1}
        className="px-6 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Précédent
      </button>
      
      <div className="flex space-x-2">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i + 1 <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {currentStep < totalSteps ? (
        <button
          type="button"
          onClick={nextStep}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Suivant
        </button>
      ) : (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Sauvegarde...' : (isEditing ? 'Mettre à jour' : 'Créer le profil')}
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isEditing ? 'Modifier mon profil Alumni' : 'Compléter mon profil Alumni'}
        </h2>
        <p className="text-gray-600">
          Étape {currentStep} sur {totalSteps} - Renseignez vos informations pour rejoindre automatiquement les bonnes communautés
        </p>
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        {currentStep === 1 && renderPersonalInfoStep()}
        {currentStep === 2 && renderAcademicInfoStep()}
        {currentStep === 3 && renderContactInfoStep()}
        {currentStep === 4 && renderProfessionalInfoStep()}
        {currentStep === 5 && renderCommunityPreferencesStep()}
        
        {renderNavigation()}
      </form>
    </div>
  );
};

export default AlumniProfileForm; 