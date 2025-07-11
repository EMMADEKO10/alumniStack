'use client';

import React, { useState, useEffect } from "react";
import PageTitle from "../../ui/navigation/PageTitle";
import { Libre_Baskerville } from "next/font/google";
import DonationCard from "../../components/cards/DonationCard";
import { FaSpinner, FaExclamationTriangle, FaHeart, FaGift, FaHandHoldingHeart } from "react-icons/fa";

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
});

interface Donation {
  _id: string;
  title: string;
  description: string;
  image: string;
  targetAmount: number;
  currentAmount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DonationStats {
  totalDonations: number;
  totalAmount: number;
  activeCampaigns: number;
  completedCampaigns: number;
}

const DonationsPage = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/donations');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des donations');
      }
      const data = await response.json();
      setDonations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = (donationId: string) => {
    // TODO: Implémenter la logique de donation
    console.log('Donation pour:', donationId);
    // Vous pouvez rediriger vers une page de paiement ou ouvrir une modal
  };

  const getFilteredDonations = () => {
    return donations.filter(donation => {
      if (filter === 'active') return donation.isActive;
      if (filter === 'completed') return donation.currentAmount >= donation.targetAmount;
      return true;
    });
  };

  const getStats = (): DonationStats => {
    return {
      totalDonations: donations.length,
      totalAmount: donations.reduce((sum, d) => sum + d.currentAmount, 0),
      activeCampaigns: donations.filter(d => d.isActive).length,
      completedCampaigns: donations.filter(d => d.currentAmount >= d.targetAmount).length,
    };
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const stats = getStats();
  const filteredDonations = getFilteredDonations();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-4xl text-red-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement des donations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <FaExclamationTriangle className="text-4xl text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erreur de chargement</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchDonations}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageTitle
        title="Donner à Legacy University"
        content="Merci d'avoir envisagé un don à la Legacy University. Si vous avez des questions ou avez besoin d'aide pour faire un cadeau, vous pouvez appeler le +243812345678 ou envoyer un e-mail à dons@legacy-university.org"
      />

      {/* Section des statistiques */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <FaGift className="text-blue-600 text-xl" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDonations}</p>
              <p className="text-sm text-gray-600">Campagnes totales</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <FaHandHoldingHeart className="text-green-600 text-xl" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatAmount(stats.totalAmount)}</p>
              <p className="text-sm text-gray-600">Montant collecté</p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <FaHeart className="text-yellow-600 text-xl" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.activeCampaigns}</p>
              <p className="text-sm text-gray-600">Campagnes actives</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <FaGift className="text-purple-600 text-xl" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.completedCampaigns}</p>
              <p className="text-sm text-gray-600">Objectifs atteints</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section d'informations de donation */}
      <div className="bg-gradient-to-r from-red-50 to-red-100 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Comment faire un don */}
            <div>
              <h2 className={`text-3xl font-bold text-gray-900 mb-6 ${libreBaskerville.className}`}>
                Comment faire un don
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Il existe plusieurs façons de faire un cadeau. Si vous souhaitez faire un don aujourd&apos;hui 
                  à l&apos;université, aux écoles ou à des sociétés affiliées, vous pouvez le faire par carte de crédit, 
                  transfert d&apos;actions ou transfert de fonds communs de placement en utilisant nos formulaires de dons en ligne.
                </p>
                <p>
                  Si vous souhaitez planifier un don pour l&apos;avenir, offrir un don autre qu&apos;en espèces ou en titres, 
                  ou explorer un don qui vous rapportera un revenu, veuillez contacter un professionnel des dons 
                  planifiés de la Legacy University.
                </p>
              </div>
            </div>

            {/* Coordonnées */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className={`text-2xl font-bold text-gray-900 mb-6 ${libreBaskerville.className}`}>
                Nos coordonnées
              </h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
                    Banque
                  </h4>
                  <div className="space-y-1 text-sm text-gray-600 pl-4">
                    <p><strong>Rawbank:</strong> 1234567890123456</p>
                    <p><strong>EquityBCDC:</strong> 9876543210987654</p>
                    <p><strong>FirstBank:</strong> 5555666677778888</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                    Mobile Money
                  </h4>
                  <div className="space-y-1 text-sm text-gray-600 pl-4">
                    <p><strong>Mpesa:</strong> +243 000 000 000</p>
                    <p><strong>Orange Money:</strong> +243 111 111 111</p>
                    <p><strong>Airtel Money:</strong> +243 222 222 222</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Important</h4>
                <p className="text-sm text-green-800 mb-3">
                  Pour garantir un traitement précis, les donateurs doivent envoyer un e-mail de confirmation à{" "}
                  <span className="font-bold">dons@legacy.org</span> avec les détails suivants :
                </p>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Nom du donneur</li>
                  <li>• N° Tél du donneur</li>
                  <li>• Date du paiement</li>
                  <li>• Nom de la banque</li>
                  <li>• Montant déposé</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section des causes */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-4xl font-bold text-gray-900 mb-4 ${libreBaskerville.className}`}>
              Des causes à soutenir
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez nos différentes campagnes de financement et contribuez à l&apos;amélioration de notre université
            </p>
          </div>

          {/* Filtres */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg shadow-md p-1 flex">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  filter === 'all'
                    ? 'bg-red-600 text-white'
                    : 'text-gray-600 hover:text-red-600'
                }`}
              >
                Toutes ({donations.length})
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  filter === 'active'
                    ? 'bg-red-600 text-white'
                    : 'text-gray-600 hover:text-red-600'
                }`}
              >
                Actives ({stats.activeCampaigns})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  filter === 'completed'
                    ? 'bg-red-600 text-white'
                    : 'text-gray-600 hover:text-red-600'
                }`}
              >
                Complétées ({stats.completedCampaigns})
              </button>
            </div>
          </div>

          {/* Liste des donations */}
          {filteredDonations.length === 0 ? (
            <div className="text-center py-12">
              <FaHeart className="text-4xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune campagne trouvée</h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? 'Aucune campagne de donation n\'est disponible pour le moment.'
                  : `Aucune campagne ${filter === 'active' ? 'active' : 'complétée'} trouvée.`
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDonations.map((donation) => (
                <DonationCard
                  key={donation._id}
                  _id={donation._id}
                  title={donation.title}
                  description={donation.description}
                  image={donation.image}
                  targetAmount={donation.targetAmount}
                  currentAmount={donation.currentAmount}
                  isActive={donation.isActive}
                  createdAt={donation.createdAt}
                  onDonate={handleDonate}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationsPage; 