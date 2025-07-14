'use client';

import React from 'react';
import CommunityExplorer from '../../components/community/CommunityExplorer';
import { Community } from '../../types/community';

const CommunitiesPage = () => {
  const handleCommunitySelect = (community: Community) => {
    // Rediriger vers la page de la communauté spécifique
    console.log('Communauté sélectionnée:', community);
    // TODO: Implémenter la navigation vers la page de la communauté
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CommunityExplorer onCommunitySelect={handleCommunitySelect} />
      </div>
    </div>
  );
};

export default CommunitiesPage; 