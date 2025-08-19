import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AlumniCard from '../cards/AlumniCard';
import { PublicAlumniProfile } from '../../types/alumni';
import { FaSearch, FaFilter, FaTimes, FaUsers, FaGraduationCap, FaBuilding, FaSort } from 'react-icons/fa';

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
  const [showFilters, setShowFilters] = useState(false);
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

  // Appliquer les filtres automatiquement
  useEffect(() => {
    applyFilters();
  }, [alumni, filters]);

  const fetchAlumni = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/alumni?public_only=true');
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Gérer différents formats de réponse
      let profiles = [];
      if (Array.isArray(data)) {
        profiles = data;
      } else if (data.profiles && Array.isArray(data.profiles)) {
        profiles = data.profiles;
      } else if (data.data && Array.isArray(data.data)) {
        profiles = data.data;
      } else if (data.alumni && Array.isArray(data.alumni)) {
        profiles = data.alumni;
      }
      
      setAlumni(profiles);
      // Forcer l'affichage immédiat
      if (profiles.length > 0) {
        setFilteredAlumni(profiles);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    if (!alumni || alumni.length === 0) {
      setFilteredAlumni([]);
      return;
    }

    let filtered = [...alumni];

    // Filtre par recherche
    if (filters.search && filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase().trim();
      filtered = filtered.filter(alumni => {
        try {
          return (
            (alumni.personalInfo?.firstName || '').toLowerCase().includes(searchTerm) ||
            (alumni.personalInfo?.lastName || '').toLowerCase().includes(searchTerm) ||
            (alumni.academicInfo?.degreeTitle || '').toLowerCase().includes(searchTerm) ||
            (alumni.professionalInfo?.currentPosition?.jobTitle || '').toLowerCase().includes(searchTerm) ||
            (alumni.professionalInfo?.currentPosition?.company || '').toLowerCase().includes(searchTerm) ||
            (alumni.professionalInfo?.skills || []).some(skill => skill.toLowerCase().includes(searchTerm))
          );
        } catch (error) {
          console.warn('Error filtering alumni:', error);
          return true;
        }
      });
    }

    // Filtre par faculté
    if (filters.facultyId && filters.facultyId.trim()) {
      filtered = filtered.filter(alumni => {
        try {
          return alumni.academicInfo?.facultyId === filters.facultyId;
        } catch (error) {
          console.warn('Error filtering by faculty:', error);
          return true;
        }
      });
    }

    // Filtre par année de graduation
    if (filters.graduationYear && filters.graduationYear.trim()) {
      filtered = filtered.filter(alumni => {
        try {
          return alumni.academicInfo?.graduationYear === parseInt(filters.graduationYear);
        } catch (error) {
          console.warn('Error filtering by graduation year:', error);
          return true;
        }
      });
    }

    // Filtre par secteur
    if (filters.industry && filters.industry.trim()) {
      filtered = filtered.filter(alumni => {
        try {
          return alumni.professionalInfo?.currentPosition?.industry === filters.industry;
        } catch (error) {
          console.warn('Error filtering by industry:', error);
          return true;
        }
      });
    }

    // Tri avec gestion d'erreurs
    try {
    switch (filters.sortBy) {
      case 'name':
          filtered.sort((a, b) => {
            const nameA = `${a.personalInfo?.firstName || ''} ${a.personalInfo?.lastName || ''}`.trim();
            const nameB = `${b.personalInfo?.firstName || ''} ${b.personalInfo?.lastName || ''}`.trim();
            return nameA.localeCompare(nameB);
          });
        break;
      case 'graduation':
          filtered.sort((a, b) => (b.academicInfo?.graduationYear || 0) - (a.academicInfo?.graduationYear || 0));
        break;
      case 'recent':
        filtered.sort((a, b) => {
          const aDate = new Date(a.createdAt || 0);
          const bDate = new Date(b.createdAt || 0);
          return bDate.getTime() - aDate.getTime();
        });
        break;
      }
    } catch (error) {
      console.warn('Error sorting alumni:', error);
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

  const activeFiltersCount = Object.values(filters).filter(value => value && value !== 'name').length;

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-200 border-t-red-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FaUsers className="text-red-600 text-lg animate-pulse" />
            </div>
        </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-gray-600 font-medium"
          >
            Chargement des profils alumni...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="bg-red-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Erreur de chargement</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchAlumni}
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors transform hover:scale-105"
          >
            Réessayer
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Espacement pour le header fixe */}
      <div className="pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header avec titre et stats */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Annuaire des Alumni
          </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Découvrez et connectez-vous avec les diplômés de Université de Kinshasa (Unikin)
          </p>
          </motion.div>

          {/* Statistiques améliorées */}
          <motion.div
            variants={staggerChildren}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl">
                  <FaUsers className="text-white text-xl" />
        </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">{alumni.length}</div>
                  <div className="text-sm text-gray-500 font-medium">Alumni inscrits</div>
            </div>
          </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl">
                  <FaSearch className="text-white text-xl" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">{filteredAlumni.length}</div>
                  <div className="text-sm text-gray-500 font-medium">Résultats trouvés</div>
            </div>
          </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-xl">
                  <FaGraduationCap className="text-white text-xl" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">{faculties.length}</div>
                  <div className="text-sm text-gray-500 font-medium">Facultés</div>
            </div>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-xl">
                  <FaBuilding className="text-white text-xl" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">{industries.length}</div>
                  <div className="text-sm text-gray-500 font-medium">Secteurs</div>
          </div>
        </div>
            </motion.div>
          </motion.div>

          {/* Barre de recherche et filtres */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100"
          >
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              
              {/* Barre de recherche */}
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
              <input
                type="text"
                placeholder="Rechercher par nom, entreprise, compétence..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                />
              </div>

              {/* Bouton filtres */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    showFilters || activeFiltersCount > 0
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FaFilter className="text-sm" />
                  Filtres
                  {activeFiltersCount > 0 && (
                    <span className="bg-white text-red-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                {/* Tri rapide */}
                <div className="flex items-center gap-2">
                  <FaSort className="text-gray-400" />
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value as FilterState['sortBy'])}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                  >
                    <option value="name">Nom</option>
                    <option value="graduation">Promotion</option>
                    <option value="recent">Récents</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Filtres avancés */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 pt-6 border-t border-gray-200"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Faculté */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Faculté
                      </label>
            <select
              value={filters.facultyId}
              onChange={(e) => handleFilterChange('facultyId', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">Toutes les facultés</option>
              {faculties.map(faculty => (
                <option key={faculty.id} value={faculty.id}>{faculty.name}</option>
              ))}
            </select>
                    </div>

            {/* Année de graduation */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Promotion
                      </label>
            <select
              value={filters.graduationYear}
              onChange={(e) => handleFilterChange('graduationYear', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">Toutes les promotions</option>
              {graduationYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
                    </div>

            {/* Secteur */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Secteur
                      </label>
            <select
              value={filters.industry}
              onChange={(e) => handleFilterChange('industry', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">Tous les secteurs</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
                    </div>
                  </div>

                  {/* Bouton reset */}
                  <div className="mt-4 flex justify-end">
            <button
              onClick={resetFilters}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
                      <FaTimes className="text-xs" />
              Réinitialiser
            </button>
          </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        {/* Résultats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
        {filteredAlumni.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="bg-gray-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <FaUsers className="text-gray-400 text-2xl" />
            </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {alumni.length === 0 ? 'Aucun alumni dans la base de données' : 'Aucun alumni trouvé avec ces filtres'}
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {alumni.length === 0 
                    ? 'Il semble qu\'il n\'y ait pas encore d\'alumni enregistrés dans la base de données.'
                    : 'Essayez de modifier vos critères de recherche ou de réinitialiser les filtres.'
                  }
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              </motion.div>
            ) : (
              <motion.div
                variants={staggerChildren}
                initial="initial"
                animate="animate"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredAlumni.map((alumni, index) => (
                  <motion.div
                    key={alumni._id ? alumni._id.toString() : index}
                    variants={fadeInUp}
                    transition={{ delay: index * 0.05 }}
                    className="transform hover:scale-105 transition-transform duration-200"
                  >
              <AlumniCard
                alumni={alumni}
                onClick={handleAlumniClick}
              />
                  </motion.div>
            ))}
              </motion.div>
            )}
          </motion.div>
          </div>
      </div>
    </div>
  );
};

export default AlumniDirectory; 