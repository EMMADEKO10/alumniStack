import React, { useState, useEffect } from 'react';
import AlumniCard from '../cards/AlumniCard';
import { PublicAlumniProfile } from '../../types/alumni';

interface AlumniDirectoryProps {
  onAlumniSelect?: (alumni: PublicAlumniProfile) => void;
}

interface FilterState {
  search: string;
  facultyId: string;
  graduationYear: string;
  industry: string;
  sortBy: 'name' | 'graduation' | 'recent';
}

const AlumniDirectory: React.FC<AlumniDirectoryProps> = ({ onAlumniSelect }) => {
  const [alumni, setAlumni] = useState<PublicAlumniProfile[]>([]);
  const [filteredAlumni, setFilteredAlumni] = useState<PublicAlumniProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    facultyId: '',
    graduationYear: '',
    industry: '',
    sortBy: 'name'
  });

  // Facultés disponibles
  const faculties = [
    { id: 'FACULTE_INFORMATIQUE', name: 'Informatique' },
    { id: 'FACULTE_GESTION', name: 'Gestion' },
    { id: 'FACULTE_DROIT', name: 'Droit' },
    { id: 'FACULTE_MEDECINE', name: 'Médecine' },
    { id: 'FACULTE_INGENIERIE', name: 'Ingénierie' },
    { id: 'FACULTE_SCIENCES', name: 'Sciences' },
    { id: 'FACULTE_ARTS', name: 'Arts et Lettres' },
    { id: 'FACULTE_ECONOMIE', name: 'Économie' },
  ];

  // Années de graduation disponibles
  const currentYear = new Date().getFullYear();
  const graduationYears = Array.from({ length: currentYear - 2011 }, (_, i) => currentYear - i);

  // Secteurs d'activité courants
  const industries = [
    'Technologie',
    'Finance',
    'Santé',
    'Éducation',
    'Conseil',
    'Marketing',
    'Ingénierie',
    'Média',
    'Gouvernement',
    'Startup',
    'ONG',
    'Autre'
  ];

  // Charger les profils alumni
  useEffect(() => {
    fetchAlumni();
  }, []);

  // Appliquer les filtres
  useEffect(() => {
    applyFilters();
  }, [alumni, filters]);

  const fetchAlumni = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/alumni?public_only=true');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des profils');
      }
      
      const data = await response.json();
      setAlumni(data.profiles || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...alumni];

    // Filtre par recherche
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(alumni =>
        alumni.personalInfo.firstName.toLowerCase().includes(searchTerm) ||
        alumni.personalInfo.lastName.toLowerCase().includes(searchTerm) ||
        alumni.academicInfo.degreeTitle?.toLowerCase().includes(searchTerm) ||
        alumni.professionalInfo.currentPosition?.jobTitle?.toLowerCase().includes(searchTerm) ||
        alumni.professionalInfo.currentPosition?.company?.toLowerCase().includes(searchTerm) ||
        alumni.professionalInfo.skills?.some(skill => skill.toLowerCase().includes(searchTerm))
      );
    }

    // Filtre par faculté
    if (filters.facultyId) {
      filtered = filtered.filter(alumni => alumni.academicInfo.facultyId === filters.facultyId);
    }

    // Filtre par année de graduation
    if (filters.graduationYear) {
      filtered = filtered.filter(alumni => alumni.academicInfo.graduationYear === parseInt(filters.graduationYear));
    }

    // Filtre par secteur
    if (filters.industry) {
      filtered = filtered.filter(alumni => 
        alumni.professionalInfo.currentPosition?.industry === filters.industry
      );
    }

    // Tri
    switch (filters.sortBy) {
      case 'name':
        filtered.sort((a, b) => 
          `${a.personalInfo.firstName} ${a.personalInfo.lastName}`.localeCompare(
            `${b.personalInfo.firstName} ${b.personalInfo.lastName}`
          )
        );
        break;
      case 'graduation':
        filtered.sort((a, b) => b.academicInfo.graduationYear - a.academicInfo.graduationYear);
        break;
      case 'recent':
        filtered.sort((a, b) => {
          const aDate = new Date(a.createdAt || 0);
          const bDate = new Date(b.createdAt || 0);
          return bDate.getTime() - aDate.getTime();
        });
        break;
    }

    setFilteredAlumni(filtered);
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      facultyId: '',
      graduationYear: '',
      industry: '',
      sortBy: 'name'
    });
  };

  const handleAlumniClick = (alumni: PublicAlumniProfile) => {
    if (onAlumniSelect) {
      onAlumniSelect(alumni);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des profils alumni...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchAlumni}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Annuaire des Alumni
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez et connectez-vous avec les diplômés de Legacy University
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{alumni.length}</div>
              <div className="text-sm text-gray-600">Alumni inscrits</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{filteredAlumni.length}</div>
              <div className="text-sm text-gray-600">Résultats trouvés</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{faculties.length}</div>
              <div className="text-sm text-gray-600">Facultés représentées</div>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-wrap gap-4 mb-4">
            {/* Recherche */}
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Rechercher par nom, entreprise, compétence..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Faculté */}
            <select
              value={filters.facultyId}
              onChange={(e) => handleFilterChange('facultyId', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Toutes les facultés</option>
              {faculties.map(faculty => (
                <option key={faculty.id} value={faculty.id}>{faculty.name}</option>
              ))}
            </select>

            {/* Année de graduation */}
            <select
              value={filters.graduationYear}
              onChange={(e) => handleFilterChange('graduationYear', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Toutes les promotions</option>
              {graduationYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            {/* Secteur */}
            <select
              value={filters.industry}
              onChange={(e) => handleFilterChange('industry', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tous les secteurs</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>

            {/* Tri */}
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value as FilterState['sortBy'])}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name">Tri par nom</option>
              <option value="graduation">Tri par promotion</option>
              <option value="recent">Plus récents</option>
            </select>

            {/* Reset */}
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Réinitialiser
            </button>
          </div>
        </div>

        {/* Résultats */}
        {filteredAlumni.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun alumnus trouvé</h3>
            <p className="text-gray-600 mb-4">
              Essayez de modifier vos critères de recherche ou de réinitialiser les filtres.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlumni.map((alumni) => (
              <AlumniCard
                key={alumni._id.toString()}
                alumni={alumni}
                onClick={handleAlumniClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlumniDirectory; 