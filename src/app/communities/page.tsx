'use client';

import React from 'react';
import AlumniDirectory from '../../components/alumni/AlumniDirectory';
import { PublicAlumniProfile } from '../../types/alumni';

const CommunitiesPage = () => {
  const handleAlumniSelect = (alumni: PublicAlumniProfile) => {
    // Afficher plus d'informations sur l'alumni ou rediriger vers son profil
    console.log('Alumni sélectionné:', alumni);
    // TODO: Implémenter la navigation vers le profil détaillé ou modal
  };

  return (
    <AlumniDirectory onAlumniSelect={handleAlumniSelect} />
  );
};

export default CommunitiesPage; 
