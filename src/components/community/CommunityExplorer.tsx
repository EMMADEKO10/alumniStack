'use client';

import React, { useState, useEffect } from 'react';
import { CommunityType, Community, LEADERSHIP_ACADEMY_FACULTIES, REGIONS } from '../../types/community';

interface CommunityExplorerProps {
  onCommunitySelect?: (community: Community) => void;
}

const CommunityExplorer: React.FC<CommunityExplorerProps> = ({ onCommunitySelect }) => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '' as CommunityType | '',
    facultyId: '',
    region: '',
    promotionYear: '',
    searchTerm: ''
  });

  useEffect(() => {
    fetchCommunities();
  }, [filters]);

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.type) params.append('type', filters.type);
      if (filters.facultyId) params.append('facultyId', filters.facultyId);
      if (filters.region) params.append('region', filters.region);
      if (filters.promotionYear) params.append('promotionYear', filters.promotionYear);

      const response = await fetch(`/api/communities?${params.toString()}`);
      const data = await response.json();
      
      let filteredCommunities = data.communities || [];
      
      // Filtrage par terme de recherche
      if (filters.searchTerm) {
        filteredCommunities = filteredCommunities.filter((community: Community) =>
          community.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          community.description.toLowerCase().includes(filters.searchTerm.toLowerCase())
        );
      }

      setCommunities(filteredCommunities);
    } catch (error) {
      console.error('Erreur lors du chargement des communautés:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      type: '',
      facultyId: '',
      region: '',
      promotionYear: '',
      searchTerm: ''
    });
  };

  const getTypeIcon = (type: CommunityType) => {
    switch (type) {
      case CommunityType.PROMOTION:
        return '🎓';
      case CommunityType.FACULTY:
        return '🏛️';
      case CommunityType.DEPARTMENT:
        return '📚';
      case CommunityType.REGION:
        return '🌍';
      case CommunityType.PROFESSION:
        return '💼';
      default:
        return '👥';
    }
  };

  const getTypeLabel = (type: CommunityType) => {
    switch (type) {
      case CommunityType.PROMOTION:
        return 'Promotion';
      case CommunityType.FACULTY:
        return 'Faculté';
      case CommunityType.DEPARTMENT:
        return 'Département';
      case CommunityType.REGION:
        return 'Région';
      case CommunityType.PROFESSION:
        return 'Profession';
      default:
        return 'Communauté';
    }
  };

  const getFacultyName = (facultyId: string) => {
    const faculty = LEGACY_FACULTIES.find(f => f.id === facultyId);
    return faculty ? faculty.name : facultyId;
  };

  // Générer les années de promotion (2012 à année actuelle)
  const promotionYears = Array.from(
    { length: new Date().getFullYear() - 2012 + 1 },
    (_, i) => 2012 + i
  ).reverse();

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Communautés Alumni Legacy University
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explorez et rejoignez les communautés organisées par promotion, faculté, département, 
          région géographique et secteur professionnel.
        </p>
      </div>

      {/* Filtres */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-4">
          {/* Recherche globale */}
          <div className="xl:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rechercher
            </label>
            <input
              type="text"
              placeholder="Nom ou description..."
              value={filters.searchTerm}
              onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Type de communauté */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as CommunityType }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les types</option>
              <option value={CommunityType.PROMOTION}>🎓 Promotion</option>
              <option value={CommunityType.FACULTY}>🏛️ Faculté</option>
              <option value={CommunityType.DEPARTMENT}>📚 Département</option>
              <option value={CommunityType.REGION}>🌍 Région</option>
              <option value={CommunityType.PROFESSION}>💼 Profession</option>
            </select>
          </div>

          {/* Faculté */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Faculté
            </label>
            <select
              value={filters.facultyId}
              onChange={(e) => setFilters(prev => ({ ...prev, facultyId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Toutes les facultés</option>
              {LEGACY_FACULTIES.map(faculty => (
                <option key={faculty.id} value={faculty.id}>
                  {faculty.code} - {faculty.name}
                </option>
              ))}
            </select>
          </div>

          {/* Région */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Région
            </label>
            <select
              value={filters.region}
              onChange={(e) => setFilters(prev => ({ ...prev, region: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Toutes les régions</option>
              {REGIONS.map(region => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          {/* Année de promotion */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Promotion
            </label>
            <select
              value={filters.promotionYear}
              onChange={(e) => setFilters(prev => ({ ...prev, promotionYear: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Toutes les promotions</option>
              {promotionYears.map(year => (
                <option key={year} value={year}>
                  Promotion {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bouton reset */}
        <div className="flex justify-end">
          <button
            onClick={resetFilters}
            className="px-4 py-2 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Réinitialiser les filtres
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.values(CommunityType).map(type => {
          const count = communities.filter(c => c.type === type).length;
          return (
            <div key={type} className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-2xl mb-1">{getTypeIcon(type)}</div>
              <div className="text-lg font-semibold text-gray-900">{count}</div>
              <div className="text-sm text-gray-600">{getTypeLabel(type)}</div>
            </div>
          );
        })}
      </div>

      {/* Liste des communautés */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Communautés ({communities.length})
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des communautés...</p>
          </div>
        ) : communities.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune communauté trouvée
            </h3>
            <p className="text-gray-600">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {communities.map((community) => (
              <CommunityCard
                key={community._id?.toString() || Math.random().toString()}
                community={community}
                onSelect={onCommunitySelect}
                getFacultyName={getFacultyName}
                getTypeIcon={getTypeIcon}
                getTypeLabel={getTypeLabel}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Composant carte de communauté
interface CommunityCardProps {
  community: Community;
  onSelect?: (community: Community) => void;
  getFacultyName: (facultyId: string) => string;
  getTypeIcon: (type: CommunityType) => string;
  getTypeLabel: (type: CommunityType) => string;
}

const CommunityCard: React.FC<CommunityCardProps> = ({
  community,
  onSelect,
  getFacultyName,
  getTypeIcon,
  getTypeLabel
}) => {
  const getSubtitle = () => {
    switch (community.type) {
      case CommunityType.PROMOTION:
        return `Promotion ${community.promotionYear}`;
      case CommunityType.FACULTY:
        return community.facultyId ? getFacultyName(community.facultyId) : '';
      case CommunityType.DEPARTMENT:
        return `Département - ${community.facultyId ? getFacultyName(community.facultyId) : ''}`;
      case CommunityType.REGION:
        return `Région de ${community.region}`;
      case CommunityType.PROFESSION:
        return `Secteur: ${community.profession}`;
      default:
        return '';
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
      onClick={() => onSelect?.(community)}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{getTypeIcon(community.type)}</span>
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
              {getTypeLabel(community.type)}
            </span>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              {community.memberCount}
            </div>
            <div className="text-xs text-gray-500">membres</div>
          </div>
        </div>

        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
          {community.name}
        </h3>
        
        <p className="text-sm text-blue-600 mb-2">
          {getSubtitle()}
        </p>

        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
          {community.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`text-xs px-2 py-1 rounded-full ${
              community.privacy === 'public' 
                ? 'bg-green-100 text-green-800' 
                : community.privacy === 'private'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {community.privacy === 'public' ? '🌐 Public' : 
               community.privacy === 'private' ? '🔒 Privé' : '👥 Restreint'}
            </span>
          </div>
          
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            Rejoindre →
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityExplorer; 