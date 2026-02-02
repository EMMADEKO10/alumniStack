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
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
        <div className="pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Skeleton Header */}
            <div className="text-center mb-12 animate-pulse">
              <div className="h-12 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto"></div>
            </div>

            {/* Skeleton Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-pulse">
                  <div className="h-6 w-12 bg-gray-200 rounded mb-2"></div>
                  <div className="h-10 bg-gray-200 rounded w-16 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              ))}
            </div>

            {/* Skeleton Filtres */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 animate-pulse">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="h-12 bg-gray-200 rounded-lg flex-1"></div>
                <div className="flex gap-3">
                  <div className="h-12 w-32 bg-gray-200 rounded-lg"></div>
                  <div className="h-12 w-32 bg-gray-200 rounded-lg"></div>
                  <div className="h-12 w-32 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            </div>

            {/* Skeleton Cartes Alumni */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                    <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center">
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
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-cyan-50/30 relative">
      {/* Décorations de fond avec palette LAU */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-24 -left-24 w-96 h-96 bg-linear-to-br from-red-200/20 to-cyan-200/20 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 -right-24 w-96 h-96 bg-linear-to-br from-blue-900/10 to-red-200/20 rounded-full blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Espacement pour le header fixe */}
      <div className="pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          
          {/* Header avec titre harmonisé - Palette LAU */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12 mt-4 sm:mt-8"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-gray-900">Découvrez </span>
              <span className="text-red-600">
                Notre Communauté
              </span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
              Connectez-vous avec les diplômés de Leadership Academia University (LAU) à travers le monde
            </p>
          </motion.div>

          {/* Grille de fonctionnalités - Palette LAU */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {[
              {
                icon: FaUsers,
                title: "Réseau Alumni",
                description: "Rejoignez une communauté mondiale d'anciens étudiants brillants et engagés.",
                gradient: "from-red-50 to-red-100/50",
                iconBg: "from-red-100 to-red-200",
                iconColor: "text-red-600",
                border: "border-red-100"
              },
              {
                icon: FaGraduationCap,
                title: "Toutes Promotions",
                description: "Explorez les profils d'alumni de toutes les facultés et années de graduation.",
                gradient: "from-blue-50 to-blue-100/50",
                iconBg: "from-blue-900/10 to-blue-900/20",
                iconColor: "text-blue-900",
                border: "border-blue-100"
              },
              {
                icon: FaBuilding,
                title: "Secteurs Variés",
                description: "Découvrez des professionnels actifs dans de nombreux domaines d'expertise.",
                gradient: "from-cyan-50 to-cyan-100/50",
                iconBg: "from-cyan-100 to-cyan-200",
                iconColor: "text-cyan-600",
                border: "border-cyan-100"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className={`bg-linear-to-br ${feature.gradient} backdrop-blur-sm rounded-xl p-6 border ${feature.border} hover:shadow-lg transition-all duration-300 group ${index === 2 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <div className={`bg-linear-to-br ${feature.iconBg} w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`text-xl sm:text-2xl ${feature.iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Statistiques améliorées - Palette LAU */}
          <motion.div
            variants={staggerChildren}
            initial="initial"
            animate="animate"
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8"
          >
            {[
              {
                icon: FaUsers,
                value: alumni.length,
                label: "Alumni inscrits",
                bgColor: "bg-linear-to-br from-red-50 to-red-100/50",
                iconBg: "bg-linear-to-br from-red-100 to-red-200",
                iconColor: "text-red-600",
                borderColor: "border-red-100"
              },
              {
                icon: FaSearch,
                value: filteredAlumni.length,
                label: "Résultats trouvés",
                bgColor: "bg-linear-to-br from-cyan-50 to-cyan-100/50",
                iconBg: "bg-linear-to-br from-cyan-100 to-cyan-200",
                iconColor: "text-cyan-600",
                borderColor: "border-cyan-100"
              },
              {
                icon: FaGraduationCap,
                value: faculties.length,
                label: "Facultés",
                bgColor: "bg-linear-to-br from-blue-50 to-blue-100/50",
                iconBg: "bg-linear-to-br from-blue-900/10 to-blue-900/20",
                iconColor: "text-blue-900",
                borderColor: "border-blue-100"
              },
              {
                icon: FaBuilding,
                value: industries.length,
                label: "Secteurs",
                bgColor: "bg-linear-to-br from-gray-50 to-gray-100/50",
                iconBg: "bg-linear-to-br from-gray-200 to-gray-300",
                iconColor: "text-gray-900",
                borderColor: "border-gray-200"
              }
            ].map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeInUp}
                className={`${stat.bgColor} rounded-xl p-6 border ${stat.borderColor} shadow-sm hover:shadow-md transition-all duration-300`}
                whileHover={{ y: -4 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`${stat.iconBg} p-3 rounded-lg`}>
                    <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Barre de recherche et filtres */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-6 mb-8 border border-gray-200"
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200"
                />
              </div>

              {/* Bouton filtres */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    showFilters || activeFiltersCount > 0
                      ? 'bg-red-600 text-white shadow-md hover:bg-red-700'
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
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600"
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
                className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm"
              >
                <div className="bg-linear-to-br from-red-50 to-cyan-50 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <FaUsers className="text-red-600 text-2xl" />
            </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {alumni.length === 0 ? 'Aucun alumni dans la base de données' : 'Aucun alumni trouvé'}
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {alumni.length === 0 
                    ? 'Il semble qu\'il n\'y ait pas encore d\'alumni enregistrés dans la base de données.'
                    : 'Essayez de modifier vos critères de recherche ou de réinitialiser les filtres.'
                  }
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
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
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    whileHover={{ y: -8 }}
                    className="transition-all duration-300"
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
