'use client';

import React, { useState, useEffect } from "react";
import PageTitle from "../../ui/navigation/PageTitle";
import { Libre_Baskerville } from "next/font/google";
import DonationCard from "../../components/cards/DonationCard";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaSpinner, 
  FaExclamationTriangle, 
  FaHeart, 
  FaGift, 
  FaHandHoldingHeart,
  FaUsers,
  FaPhone,
  FaEnvelope,
  FaUniversity,
  FaMobile,
  FaCheck,
  FaStar
} from "react-icons/fa";

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
      <div className="min-h-screen flex items-center justify-center pt-20">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <FaSpinner className="text-4xl text-red-600 mx-auto mb-4" />
          </motion.div>
          <p className="text-gray-600">Chargement des donations...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <motion.div 
          className="text-center max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FaExclamationTriangle className="text-4xl text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erreur de chargement</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <motion.button
            onClick={fetchDonations}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Réessayer
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Section Hero */}
      <motion.div 
        className="relative bg-gradient-to-br from-red-500 via-red-600 to-red-700 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Éléments décoratifs de fond */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 right-20 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 left-1/3 w-16 h-16 bg-white/15 rounded-full blur-lg"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div
              className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white/90 text-sm font-medium mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <FaHeart className="mr-2" />
              Plateforme de donation
            </motion.div>

            <h1 className={`text-4xl md:text-6xl font-bold text-white mb-6 ${libreBaskerville.className}`}>
              Donner à Legacy University
            </h1>
            
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Merci d&apos;avoir envisagé un don à la Legacy University. Votre générosité nous aide à bâtir l&apos;avenir de l&apos;éducation.
            </p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <motion.a
                href="#donations"
                className="bg-white text-red-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all shadow-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Voir les campagnes
              </motion.a>
              <motion.a
                href="tel:+243812345678"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-red-600 transition-all"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPhone className="inline mr-2" />
                Nous contacter
              </motion.a>
            </motion.div>
          </motion.div>
              </div>
      </motion.div>

      {/* Section des statistiques améliorée */}
      <motion.div 
        className="bg-white shadow-lg border-b border-gray-100"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: FaGift,
                value: stats.totalDonations,
                label: "Campagnes totales",
                color: "blue",
                suffix: ""
              },
              {
                icon: FaHandHoldingHeart,
                value: stats.totalAmount,
                label: "Montant collecté",
                color: "green",
                prefix: "$"
              },
              {
                icon: FaHeart,
                value: stats.activeCampaigns,
                label: "Campagnes actives",
                color: "yellow",
                suffix: ""
              },
              {
                icon: FaStar,
                value: stats.completedCampaigns,
                label: "Objectifs atteints",
                color: "purple",
                suffix: ""
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center group"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -5 }}
              >
                <div className={`bg-${stat.color}-50 group-hover:bg-${stat.color}-100 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110`}>
                  <stat.icon className={`text-${stat.color}-600 text-2xl`} />
            </div>
                <motion.p 
                  className="text-3xl font-bold text-gray-900 mb-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                >
                  {stat.prefix}{typeof stat.value === 'number' && stat.prefix === '$' ? formatAmount(stat.value).replace('$', '') : stat.value}{stat.suffix}
                </motion.p>
                <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Section d'informations améliorée */}
      <motion.div 
        className="bg-gradient-to-br from-red-50 via-white to-red-50 py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Comment faire un don */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-6">
                <div className="bg-red-100 rounded-full p-3 mr-4">
                  <FaHeart className="text-red-600 text-xl" />
                </div>
                <h2 className={`text-3xl font-bold text-gray-900 ${libreBaskerville.className}`}>
                Comment faire un don
              </h2>
              </div>
              
              <div className="space-y-6 text-gray-700">
                <motion.div
                  className="flex items-start space-x-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-red-100 rounded-full p-2 mt-1">
                    <FaCheck className="text-red-600 text-sm" />
                  </div>
                  <p>
                    <strong>Donations en ligne :</strong> Utilisez nos formulaires sécurisés pour les donations par carte de crédit, transfert d&apos;actions ou fonds communs de placement.
                  </p>
                </motion.div>

                <motion.div
                  className="flex items-start space-x-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-red-100 rounded-full p-2 mt-1">
                    <FaCheck className="text-red-600 text-sm" />
                  </div>
                  <p>
                    <strong>Donations planifiées :</strong> Explorez les options de dons qui vous rapportent un revenu en contactant nos professionnels.
                  </p>
                </motion.div>

                <motion.div
                  className="flex items-start space-x-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-red-100 rounded-full p-2 mt-1">
                    <FaCheck className="text-red-600 text-sm" />
                  </div>
                  <p>
                    <strong>Support personnalisé :</strong> Notre équipe est disponible pour vous accompagner dans votre démarche de donation.
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* Coordonnées améliorées */}
            <motion.div 
              className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center mb-6">
                <div className="bg-green-100 rounded-full p-3 mr-4">
                  <FaUniversity className="text-green-600 text-xl" />
            </div>
                <h3 className={`text-2xl font-bold text-gray-900 ${libreBaskerville.className}`}>
                Nos coordonnées
              </h3>
              </div>
              
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <FaUniversity className="text-red-600 mr-2" />
                    Comptes bancaires
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600 pl-6">
                    <p className="flex justify-between"><strong>Rawbank:</strong> <span className="font-mono">1234567890123456</span></p>
                    <p className="flex justify-between"><strong>EquityBCDC:</strong> <span className="font-mono">9876543210987654</span></p>
                    <p className="flex justify-between"><strong>FirstBank:</strong> <span className="font-mono">5555666677778888</span></p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <FaMobile className="text-green-600 mr-2" />
                    Mobile Money
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600 pl-6">
                    <p className="flex justify-between"><strong>Mpesa:</strong> <span className="font-mono">+243 000 000 000</span></p>
                    <p className="flex justify-between"><strong>Orange Money:</strong> <span className="font-mono">+243 111 111 111</span></p>
                    <p className="flex justify-between"><strong>Airtel Money:</strong> <span className="font-mono">+243 222 222 222</span></p>
                  </div>
                </motion.div>
              </div>

              <motion.div 
                className="mt-8 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <h4 className="font-semibold text-green-900 mb-2 flex items-center">
                  <FaEnvelope className="mr-2" />
                  Confirmation requise
                </h4>
                <p className="text-sm text-green-800 mb-3">
                  Envoyez un email de confirmation à{" "}
                  <span className="font-bold">dons@legacy.org</span> avec :
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-green-800">
                  <div className="flex items-center"><FaCheck className="mr-2 text-xs" />Nom du donneur</div>
                  <div className="flex items-center"><FaCheck className="mr-2 text-xs" />N° Téléphone</div>
                  <div className="flex items-center"><FaCheck className="mr-2 text-xs" />Date du paiement</div>
                  <div className="flex items-center"><FaCheck className="mr-2 text-xs" />Nom de la banque</div>
                  <div className="flex items-center"><FaCheck className="mr-2 text-xs" />Montant déposé</div>
              </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Section des causes */}
      <motion.div 
        className="py-20" 
        id="donations"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-4xl font-bold text-gray-900 mb-4 ${libreBaskerville.className}`}>
              Des causes à soutenir
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez nos différentes campagnes de financement et contribuez à l&apos;amélioration de notre université
            </p>
          </motion.div>

          {/* Filtres améliorés */}
          <motion.div 
            className="flex justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-2xl shadow-lg p-2 flex border border-gray-200">
              {[
                { key: 'all', label: 'Toutes', count: donations.length },
                { key: 'active', label: 'Actives', count: stats.activeCampaigns },
                { key: 'completed', label: 'Complétées', count: stats.completedCampaigns }
              ].map((filterOption) => (
                <motion.button
                  key={filterOption.key}
                  onClick={() => setFilter(filterOption.key as any)}
                  className={`px-6 py-3 rounded-xl transition-all font-medium ${
                    filter === filterOption.key
                      ? 'bg-red-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {filterOption.label} ({filterOption.count})
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Liste des donations */}
          <AnimatePresence mode="wait">
          {filteredDonations.length === 0 ? (
              <motion.div 
                className="text-center py-16"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <FaHeart className="text-4xl text-gray-400" />
                </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune campagne trouvée</h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? 'Aucune campagne de donation n\'est disponible pour le moment.'
                  : `Aucune campagne ${filter === 'active' ? 'active' : 'complétée'} trouvée.`
                }
              </p>
              </motion.div>
            ) : (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {filteredDonations.map((donation, index) => (
                  <motion.div
                    key={donation._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                <DonationCard
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
                  </motion.div>
              ))}
              </motion.div>
          )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default DonationsPage; 