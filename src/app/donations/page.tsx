'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import DonationCard from "../../components/cards/DonationCard";
import { motion } from "framer-motion";
import { 
  FaHeart, 
  FaUniversity,
  FaMobile,
  FaCheck
} from "react-icons/fa";
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  UsersIcon,
  CurrencyDollarIcon,
  HeartIcon
} from "@heroicons/react/24/outline";

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
  category?: string;
  priority?: string;
  location?: string;
  endDate?: string;
  donorCount?: number;
}

interface DonationStats {
  totalDonations: number;
  totalAmount: number;
  activeCampaigns: number;
  completedCampaigns: number;
  totalDonors: number;
  averageDonation: number;
}

const DonationsPage = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [filteredDonations, setFilteredDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isPaying, setIsPaying] = useState<string | null>(null);

  useEffect(() => {
    fetchDonations();
  }, []);

  // Effet pour filtrer et trier
  useEffect(() => {
    let filtered = [...donations];

    // Filtrage par recherche
    if (searchTerm) {
      filtered = filtered.filter(donation =>
        donation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrage par statut
    if (filter !== 'all') {
      filtered = filtered.filter(donation => {
        if (filter === 'active') return donation.isActive;
        if (filter === 'completed') return donation.currentAmount >= donation.targetAmount;
        return true;
      });
    }

    // Filtrage par catégorie
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(donation => donation.category === categoryFilter);
    }

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'amount':
          return b.currentAmount - a.currentAmount;
        case 'progress':
          const progressA = (a.currentAmount / a.targetAmount) * 100;
          const progressB = (b.currentAmount / b.targetAmount) * 100;
          return progressB - progressA;
        default:
          return 0;
      }
    });

    setFilteredDonations(filtered);
  }, [donations, searchTerm, filter, sortBy, categoryFilter]);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/donations');
      if (!response.ok) {
        // Si l'API échoue, utiliser des données de démonstration
        console.warn("API non disponible, utilisation des données de démonstration");
        const demoData: Donation[] = [
          {
            _id: "demo1",
            title: "Bibliothèque Universitaire",
            description: "Modernisation et extension de notre bibliothèque universitaire pour offrir un environnement d'apprentissage optimal à nos étudiants.",
            image: "/graduation.jpg",
            targetAmount: 100000,
            currentAmount: 75000,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            category: "infrastructure",
            priority: "high",
            location: "Campus Principal",
            donorCount: 150
          },
          {
            _id: "demo2",
            title: "Bourses d'Excellence",
            description: "Programme de bourses pour soutenir les étudiants méritants issus de familles à revenus modestes.",
            image: "/graduation.jpg",
            targetAmount: 50000,
            currentAmount: 35000,
            isActive: true,
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date().toISOString(),
            category: "bourse",
            priority: "high",
            location: "Tous campus",
            donorCount: 89
          },
          {
            _id: "demo3",
            title: "Laboratoire de Recherche",
            description: "Équipement moderne pour le nouveau laboratoire de recherche en sciences appliquées.",
            image: "/graduation.jpg",
            targetAmount: 80000,
            currentAmount: 80000,
            isActive: false,
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date().toISOString(),
            category: "recherche",
            priority: "medium",
            location: "Faculté des Sciences",
            donorCount: 120
          }
        ];
        setDonations(demoData);
        setFilteredDonations(demoData);
        setLoading(false);
        return;
      }
      const data = await response.json();
      setDonations(data || []);
      setFilteredDonations(data || []);
    } catch (err) {
      console.error("Erreur lors de la récupération des donations:", err);
      // En cas d'erreur, utiliser des données de démonstration
      const demoData: Donation[] = [
        {
          _id: "demo1",
          title: "Bibliothèque Universitaire",
          description: "Modernisation et extension de notre bibliothèque universitaire pour offrir un environnement d'apprentissage optimal à nos étudiants.",
          image: "/graduation.jpg",
          targetAmount: 100000,
          currentAmount: 75000,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          category: "infrastructure",
          priority: "high",
          location: "Campus Principal",
          donorCount: 150
        },
        {
          _id: "demo2",
          title: "Bourses d'Excellence",
          description: "Programme de bourses pour soutenir les étudiants méritants issus de familles à revenus modestes.",
          image: "/graduation.jpg",
          targetAmount: 50000,
          currentAmount: 35000,
          isActive: true,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
          category: "bourse",
          priority: "high",
          location: "Tous campus",
          donorCount: 89
        },
        {
          _id: "demo3",
          title: "Laboratoire de Recherche",
          description: "Équipement moderne pour le nouveau laboratoire de recherche en sciences appliquées.",
          image: "/graduation.jpg",
          targetAmount: 80000,
          currentAmount: 80000,
          isActive: false,
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
          category: "recherche",
          priority: "medium",
          location: "Faculté des Sciences",
          donorCount: 120
        }
      ];
      setDonations(demoData);
      setFilteredDonations(demoData);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = async (donationId: string) => {
    const amount = window.prompt("Entrez le montant de votre don (USD):", "10");
    if (!amount || isNaN(parseFloat(amount))) return;

    const method = window.confirm("Souhaitez-vous payer par Mobile Money ? (Annuler pour Carte Bancaire)") ? "MOBILEMONEY" : "CARD";
    
    let phoneNumber = "";
    let provider = "";
    let walletID = "";

    if (method === "MOBILEMONEY") {
      provider = window.prompt("Entrez votre opérateur (ORANGE, MPESA, AIRTEL) :", "ORANGE")?.toUpperCase() || "ORANGE";
      walletID = window.prompt("Entrez votre numéro de téléphone Mobile Money :", "+243810000001") || "";
      if (!walletID) return;
      phoneNumber = walletID;
    } else {
      phoneNumber = window.prompt("Entrez votre numéro de contact :", "+243810000001") || "";
    }

    const customerName = window.prompt("Entrez votre nom complet :", "Donateur LAU") || "Anonyme";

    setIsPaying(donationId);
    try {
      console.log('Initiation du don pour:', donationId);
      
      const response = await fetch('/api/donations/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount),
          donationId,
          phoneNumber,
          customerName,
          paymentMethod: method,
          provider: method === "MOBILEMONEY" ? provider : undefined,
          walletID: method === "MOBILEMONEY" ? walletID : undefined
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonErr) {
        console.error('Erreur parsing JSON:', jsonErr);
        throw new Error("Réponse du serveur invalide ou vide.");
      }

      if (data.paymentUrl) {
        // Redirection pour carte ou confirmation mobile
        console.log('Redirection vers:', data.paymentUrl);
        window.location.href = data.paymentUrl;
      } else if (data.success && method === "MOBILEMONEY") {
        alert("Paiement initié ! Veuillez valider sur votre téléphone. Une fois validé, vous recevrez une confirmation.");
        window.location.href = `/donations/success?transactionId=${data.transactionId}`;
      } else {
        const errorMsg = data.error || "Impossible d'initialiser le paiement";
        console.error('Erreur API:', errorMsg);
        alert("Erreur: " + errorMsg);
        setIsPaying(null); // Reset manually if error alert shown
      }
    } catch (err: unknown) {
      console.error('Erreur de paiement:', err);
      const error = err as Error;
      if (error.name === 'AbortError') {
        alert("Le délai d'attente a été dépassé. Vérifiez votre connexion.");
      } else {
        alert("Une erreur est survenue lors de la connexion au service de paiement : " + (error.message || "Erreur inconnue"));
      }
      setIsPaying(null);
    } finally {
      // Note: isPaying is set to null in catch/else branches to ensure it resets 
      // even if redirect takes time or alert blocks.
      setTimeout(() => setIsPaying(null), 5000); // Fail-safe fallback
    }
  };

  const getStats = (): DonationStats => {
    const totalDonors = donations.reduce((sum, d) => sum + (d.donorCount || 0), 0);
    const totalAmount = donations.reduce((sum, d) => sum + d.currentAmount, 0);
    
    return {
      totalDonations: donations.length,
      totalAmount,
      activeCampaigns: donations.filter(d => d.isActive).length,
      completedCampaigns: donations.filter(d => d.currentAmount >= d.targetAmount).length,
      totalDonors,
      averageDonation: totalDonors > 0 ? totalAmount / totalDonors : 0
    };
  };

  const getCategories = (): string[] => {
    const categories = [...new Set(donations.map(d => d.category).filter((category): category is string => Boolean(category)))];
    return categories;
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">
        {/* Skeleton Titre principal */}
        <div className="text-center mb-12 mt-8 animate-pulse">
          <div className="h-12 bg-gray-200 rounded-lg w-3/4 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto"></div>
        </div>

        {/* Skeleton Grille de fonctionnalités */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 animate-pulse">
              <div className="w-14 h-14 bg-gray-200 rounded-xl mb-4"></div>
              <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          ))}
        </div>

        {/* Skeleton Barre de recherche */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 animate-pulse">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-4">
            <div className="h-12 bg-gray-200 rounded-lg flex-1 max-w-md"></div>
            <div className="flex gap-3">
              <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
              <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
              <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
            <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
            <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
          </div>
        </div>

        {/* Skeleton Cartes de donations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden border border-gray-200 animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                <div className="h-2 bg-gray-200 rounded mb-2"></div>
                <div className="flex justify-between mb-4">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-medium">Erreur : {error}</p>
          <motion.button
            onClick={fetchDonations}
            className="mt-4 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Réessayer
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pt-16 sm:pt-20 lg:pt-24 pb-16 relative">
      {/* Décorations de fond */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-24 -left-24 w-96 h-96 bg-linear-to-br from-red-200/20 to-pink-200/20 rounded-full blur-3xl"
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
          className="absolute top-1/2 -right-24 w-96 h-96 bg-linear-to-br from-pink-200/20 to-red-200/20 rounded-full blur-3xl"
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

      {/* Titre principal avec gradient */}
      <motion.div 
        className="text-center mb-8 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
          <span className="text-gray-900">Soutenez </span>
          <span className="bg-linear-to-r from-red-600 via-rose-600 to-red-500 bg-clip-text text-transparent">
            Notre Mission
          </span>
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto px-4">
          Merci d&apos;avoir envisagé un don au Leadership Academia University (LAU). Votre générosité nous aide à bâtir l&apos;avenir de l&apos;éducation.
        </p>
      </motion.div>

      {/* Barre de recherche et filtres */}
      <motion.div 
        className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-8 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Recherche */}
          <div className="relative flex-1 w-full lg:max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une campagne..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-sm sm:text-base"
            />
          </div>

          {/* Filtres et tri */}
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-3 w-full lg:w-auto">
            {/* Filtre par catégorie */}
            <div className="flex items-center gap-2 flex-1 sm:flex-none min-w-35">
              <FunnelIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 hidden sm:block" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
              >
                <option value="all">Toutes les catégories</option>
                {getCategories().map((category) => (
                  <option key={category} value={category}>
                    {category ? category.charAt(0).toUpperCase() + category.slice(1) : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Tri */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 sm:flex-none min-w-30 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
            >
              <option value="date">Date</option>
              <option value="title">Titre</option>
              <option value="amount">Montant</option>
              <option value="progress">Progression</option>
            </select>

            {/* Mode d'affichage */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden shrink-0">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium ${
                  viewMode === "grid"
                    ? "bg-red-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Grille
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium ${
                  viewMode === "list"
                    ? "bg-red-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Liste
              </button>
            </div>
          </div>
        </div>

        {/* Filtres par statut */}
        <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
          {[
            { key: 'all', label: 'Toutes', count: donations.length },
            { key: 'active', label: 'Actives', count: stats.activeCampaigns },
            { key: 'completed', label: 'Complétées', count: stats.completedCampaigns }
          ].map((filterOption) => (
            <button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key as "all" | "active" | "completed")}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                filter === filterOption.key
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
              }`}
            >
              {filterOption.label} ({filterOption.count})
            </button>
          ))}
        </div>
      </motion.div>

      {/* Liste des donations */}
      {filteredDonations.length === 0 ? (
        <motion.div 
          className="text-center py-12 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <HeartIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            Aucune campagne trouvée
          </h3>
          <p className="mt-1 text-gray-500">
            Essayez de modifier vos critères de recherche ou de filtrage.
          </p>
        </motion.div>
      ) : (
        <div className={`relative z-10 ${
          viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-4"
        }`}>
          {filteredDonations.map((donation, index) => (
            <motion.div
              key={donation._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 + index * 0.05 }}
              className={viewMode === "list" ? "bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200" : ""}
            >
              {viewMode === "list" ? (
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    <div className="shrink-0 w-full sm:w-24 h-48 sm:h-24 bg-linear-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center overflow-hidden relative">
                      {donation.image ? (
                        <Image src={donation.image} alt={donation.title} fill className="object-cover" />
                      ) : (
                        <HeartIcon className="h-8 w-8 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{donation.title}</h3>
                      <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2">{donation.description}</p>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
                        <div className="flex items-center">
                          <CurrencyDollarIcon className="h-4 w-4 mr-1 text-red-500" />
                          <span>{formatAmount(donation.currentAmount)} / {formatAmount(donation.targetAmount)}</span>
                        </div>
                        <div className="flex items-center">
                          <UsersIcon className="h-4 w-4 mr-1 text-red-500" />
                          <span>{donation.donorCount || 0} donateurs</span>
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                      <button
                        onClick={() => handleDonate(donation._id)}
                        disabled={isPaying === donation._id}
                        className={`w-full sm:w-auto bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center justify-center ${isPaying === donation._id ? 'opacity-70 cursor-wait' : ''}`}
                      >
                        {isPaying === donation._id ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            ...
                          </>
                        ) : 'Donner'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
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
                  isLoading={isPaying === donation._id}
                />
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Section d'informations sur les dons */}
      <motion.div 
        className="bg-linear-to-br from-red-50 via-white to-red-50 rounded-xl p-6 sm:p-8 mt-12 relative z-10 border border-red-100 shadow-lg"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Comment faire un don */}
          <div>
            <div className="flex items-center mb-6">
              <div className="bg-red-100 rounded-full p-2.5 sm:p-3 mr-4">
                <FaHeart className="text-red-600 text-lg sm:text-xl" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 font-sans">
                Comment faire un don
              </h2>
            </div>
            
            <div className="space-y-4 text-gray-700">
              <div className="flex items-start space-x-3">
                <div className="bg-red-100 rounded-full p-1.5 sm:p-2 mt-1 shrink-0">
                  <FaCheck className="text-red-600 text-[10px] sm:text-sm" />
                </div>
                <p className="text-sm sm:text-base">
                  <strong className="text-gray-900 font-semibold block sm:inline">Donations en ligne :</strong> Utilisez nos formulaires sécurisés pour les donations par carte de crédit.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-red-100 rounded-full p-1.5 sm:p-2 mt-1 shrink-0">
                  <FaCheck className="text-red-600 text-[10px] sm:text-sm" />
                </div>
                <p className="text-sm sm:text-base">
                  <strong className="text-gray-900 font-semibold block sm:inline">Donations planifiées :</strong> Contactez notre équipe pour explorer les options de dons.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-red-100 rounded-full p-1.5 sm:p-2 mt-1 shrink-0">
                  <FaCheck className="text-red-600 text-[10px] sm:text-sm" />
                </div>
                <p className="text-sm sm:text-base">
                  <strong className="text-gray-900 font-semibold block sm:inline">Support personnalisé :</strong> Notre équipe vous accompagne dans votre démarche.
                </p>
              </div>
            </div>
          </div>

          {/* Coordonnées */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6">
            <div className="flex items-center mb-5">
              <div className="bg-green-100 rounded-full p-2.5 sm:p-3 mr-4">
                <FaUniversity className="text-green-600 text-base sm:text-lg" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 font-sans">
                Nos coordonnées
              </h3>
            </div>
            
            <div className="space-y-5">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2.5 flex items-center text-sm sm:text-base">
                  <FaUniversity className="text-red-600 mr-2" />
                  Comptes bancaires
                </h4>
                <div className="space-y-2 text-[11px] sm:text-xs text-gray-600 sm:pl-6 overflow-x-auto">
                  <p className="flex justify-between items-center gap-2 min-w-50">
                    <strong className="shrink-0 font-medium">Rawbank:</strong> 
                    <span className="font-mono bg-gray-50 px-2 py-1 rounded">1234567890123456</span>
                  </p>
                  <p className="flex justify-between items-center gap-2 min-w-50">
                    <strong className="shrink-0 font-medium">EquityBCDC:</strong> 
                    <span className="font-mono bg-gray-50 px-2 py-1 rounded">9876543210987654</span>
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2.5 flex items-center text-sm sm:text-base">
                  <FaMobile className="text-green-600 mr-2" />
                  Mobile Money
                </h4>
                <div className="space-y-2 text-[11px] sm:text-xs text-gray-600 sm:pl-6">
                  <p className="flex justify-between items-center bg-gray-50 p-2 rounded">
                    <strong className="font-medium">Mpesa:</strong> 
                    <span className="font-mono">+243 000 000 000</span>
                  </p>
                  <p className="flex justify-between items-center bg-gray-50 p-2 rounded">
                    <strong className="font-medium">Orange Money:</strong> 
                    <span className="font-mono">+243 111 111 111</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 p-3.5 bg-linear-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
              <p className="text-xs text-green-800 leading-relaxed text-center sm:text-left">
                📧 Confirmez votre don par email à <strong className="whitespace-nowrap">dons@lau.org</strong>
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Grille de fonctionnalités d'impact (Déplacée en bas) */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        {[
          {
            icon: FaHeart,
            title: "Impact Direct",
            description: "Votre don a un impact immédiat sur la vie de nos étudiants et la qualité de notre enseignement."
          },
          {
            icon: FaUniversity,
            title: "Projets Variés",
            description: "Soutenez des projets d'infrastructure, de recherche, ou des programmes de bourses d'excellence."
          },
          {
            icon: FaCheck,
            title: "Transparence Totale",
            description: "Suivez en temps réel la progression de chaque campagne et l'utilisation des fonds collectés."
          }
        ].map((feature, index) => (
          <motion.div
            key={index}
            className="bg-white/80 backdrop-blur-sm rounded-none p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            viewport={{ once: true }}
          >
            <div className="bg-linear-to-br from-red-50 to-pink-50 w-14 h-14 rounded-none flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <feature.icon className="text-2xl text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 font-sans">
              {feature.title}
            </h3>
            <p className="text-gray-600 text-sm">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

    </div>
  );
};

export default DonationsPage; 
