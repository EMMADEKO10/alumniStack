'use client';

import React, { useState, useEffect } from 'react';
import { CommunityType, Community, LEGACY_FACULTIES, REGIONS, PROFESSIONAL_SECTORS } from '../../types/community';

const CommunityAdmin: React.FC = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '' as CommunityType | '',
    promotionYear: '',
    facultyId: '',
    departmentId: '',
    region: '',
    profession: '',
    privacy: 'public' as 'public' | 'private' | 'restricted'
  });

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/communities');
      const data = await response.json();
      setCommunities(data.communities || []);
    } catch (error) {
      console.error('Erreur lors du chargement des communautés:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await fetch('/api/communities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newCommunity = await response.json();
        setCommunities(prev => [newCommunity, ...prev]);
        setShowCreateForm(false);
        resetForm();
        alert('Communauté créée avec succès !');
      } else {
        const errorData = await response.json();
        alert(`Erreur: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      alert('Erreur lors de la création de la communauté');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: '',
      promotionYear: '',
      facultyId: '',
      departmentId: '',
      region: '',
      profession: '',
      privacy: 'public'
    });
  };

  const getTypeLabel = (type: CommunityType) => {
    switch (type) {
      case CommunityType.PROMOTION: return 'Promotion';
      case CommunityType.FACULTY: return 'Faculté';
      case CommunityType.DEPARTMENT: return 'Département';
      case CommunityType.REGION: return 'Région';
      case CommunityType.PROFESSION: return 'Profession';
      default: return 'Non défini';
    }
  };

  const generatePromotionYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = 2012; year <= currentYear; year++) {
      years.push(year);
    }
    return years.reverse();
  };

  // Composant pour les champs conditionnels selon le type
  const renderConditionalFields = () => {
    switch (formData.type) {
      case CommunityType.PROMOTION:
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Année de promotion *
            </label>
            <select
              value={formData.promotionYear}
              onChange={(e) => setFormData(prev => ({ ...prev, promotionYear: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner une année</option>
              {generatePromotionYears().map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        );

      case CommunityType.FACULTY:
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Faculté *
            </label>
            <select
              value={formData.facultyId}
              onChange={(e) => setFormData(prev => ({ ...prev, facultyId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner une faculté</option>
              {LEGACY_FACULTIES.map(faculty => (
                <option key={faculty.id} value={faculty.id}>
                  {faculty.code} - {faculty.name}
                </option>
              ))}
            </select>
          </div>
        );

      case CommunityType.DEPARTMENT:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Faculté *
              </label>
              <select
                value={formData.facultyId}
                onChange={(e) => setFormData(prev => ({ ...prev, facultyId: e.target.value, departmentId: '' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionner une faculté</option>
                {LEGACY_FACULTIES.map(faculty => (
                  <option key={faculty.id} value={faculty.id}>
                    {faculty.code} - {faculty.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Département *
              </label>
              <input
                type="text"
                value={formData.departmentId}
                onChange={(e) => setFormData(prev => ({ ...prev, departmentId: e.target.value }))}
                placeholder="Ex: Informatique, Génie Civil..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        );

      case CommunityType.REGION:
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Région *
            </label>
            <select
              value={formData.region}
              onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner une région</option>
              {REGIONS.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
        );

      case CommunityType.PROFESSION:
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Secteur professionnel *
            </label>
            <select
              value={formData.profession}
              onChange={(e) => setFormData(prev => ({ ...prev, profession: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner un secteur</option>
              {PROFESSIONAL_SECTORS.map(sector => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Administration des Communautés
        </h1>
        <p className="text-gray-600">
          Gérez les communautés organisées par promotion, faculté, département, région et profession.
        </p>
      </div>

      {/* Bouton de création */}
      <div className="mb-6">
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showCreateForm ? 'Annuler' : 'Créer une nouvelle communauté'}
        </button>
      </div>

      {/* Formulaire de création */}
      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Nouvelle Communauté
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informations de base */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de la communauté *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Promotion 2020, Alumni Médecine..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de communauté *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    type: e.target.value as CommunityType,
                    // Reset des champs conditionnels
                    promotionYear: '',
                    facultyId: '',
                    departmentId: '',
                    region: '',
                    profession: ''
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner un type</option>
                  <option value={CommunityType.PROMOTION}>🎓 Par Promotion</option>
                  <option value={CommunityType.FACULTY}>🏛️ Par Faculté</option>
                  <option value={CommunityType.DEPARTMENT}>📚 Par Département</option>
                  <option value={CommunityType.REGION}>🌍 Par Région</option>
                  <option value={CommunityType.PROFESSION}>💼 Par Profession</option>
                </select>
              </div>
            </div>

            {/* Champs conditionnels */}
            {formData.type && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Paramètres spécifiques
                </h3>
                {renderConditionalFields()}
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Décrivez l'objectif et les activités de cette communauté..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Confidentialité */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confidentialité
              </label>
              <select
                value={formData.privacy}
                onChange={(e) => setFormData(prev => ({ ...prev, privacy: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="public">🌐 Public - Visible par tous</option>
                <option value="restricted">👥 Restreint - Sur invitation</option>
                <option value="private">🔒 Privé - Membres approuvés</option>
              </select>
            </div>

            {/* Boutons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => { setShowCreateForm(false); resetForm(); }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Création...' : 'Créer la communauté'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des communautés existantes */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Communautés existantes ({communities.length})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Communauté
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Membres
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Créée le
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {communities.map((community) => (
                <tr key={community._id?.toString()} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {community.name}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {community.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {getTypeLabel(community.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {community.memberCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      community.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {community.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(community.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CommunityAdmin; 