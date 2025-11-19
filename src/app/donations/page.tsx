'use client';

import React, { useState, useEffect } from "react";
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
  ChartBarIcon,
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

  const handleDonate = (donationId: string) => {
    // TODO: Implémenter la logique de donation
    console.log('Donation pour:', donationId);
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

        {/* Skeleton Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 animate-pulse">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-24 mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          ))}
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
    <div className="max-w-7xl mx-auto px-4 pt-32 pb-16 relative">
      {/* Décorations de fond */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-red-200/20 to-pink-200/20 rounded-full blur-3xl"
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
          className="absolute top-1/2 -right-24 w-96 h-96 bg-gradient-to-br from-pink-200/20 to-red-200/20 rounded-full blur-3xl"
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
        className="text-center mb-12 mt-8 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-gray-900">Soutenez </span>
          <span className="bg-gradient-to-r from-red-600 via-rose-600 to-red-500 bg-clip-text text-transparent">
            Notre Mission
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          Merci d&apos;avoir envisagé un don au Leadership AcademiaUniversity (LAU). Votre générosité nous aide à bâtir l&apos;avenir de l&apos;éducation.
        </p>
      </motion.div>

      {/* Grille de fonctionnalités */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
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
            className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            whileHover={{ y: -8 }}
          >
            <div className="bg-gradient-to-br from-red-50 to-pink-50 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <feature.icon className="text-2xl text-red-600" />
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

      {/* Barre de recherche et filtres */}
      <motion.div 
        className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-6 mb-8 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Recherche */}
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une campagne..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Filtres et tri */}
          <div className="flex flex-wrap gap-3">
            {/* Filtre par catégorie */}
            <div className="flex items-center gap-2">
              <FunnelIcon className="h-5 w-5 text-gray-500" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="date">Trier par date</option>
              <option value="title">Trier par titre</option>
              <option value="amount">Trier par montant</option>
              <option value="progress">Trier par progression</option>
            </select>

            {/* Mode d'affichage */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 text-sm font-medium ${
                  viewMode === "grid"
                    ? "bg-red-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Grille
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 text-sm font-medium ${
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
        <div className="flex flex-wrap gap-2 mt-4">
          {[
            { key: 'all', label: 'Toutes', count: donations.length },
            { key: 'active', label: 'Actives', count: stats.activeCampaigns },
            { key: 'completed', label: 'Complétées', count: stats.completedCampaigns }
          ].map((filterOption) => (
            <button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key as "all" | "active" | "completed")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === filterOption.key
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
              }`}
            >
              {filterOption.label} ({filterOption.count})
            </button>
          ))}
        </div>
      </motion.div>

      {/* Statistiques */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {[
          {
            icon: HeartIcon,
            value: filteredDonations.length,
            label: "Campagnes trouvées",
            color: "red",
            bgColor: "bg-gradient-to-br from-red-50 to-pink-50",
            iconColor: "text-red-600",
            borderColor: "border-red-100"
          },
          {
            icon: CurrencyDollarIcon,
            value: stats.totalAmount,
            label: "Montant total collecté",
            color: "green",
            bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
            iconColor: "text-green-600",
            borderColor: "border-green-100",
            format: "currency"
          },
          {
            icon: UsersIcon,
            value: stats.totalDonors,
            label: "Donateurs",
            color: "blue",
            bgColor: "bg-gradient-to-br from-blue-50 to-indigo-50",
            iconColor: "text-blue-600",
            borderColor: "border-blue-100"
          },
          {
            icon: ChartBarIcon,
            value: stats.completedCampaigns,
            label: "Objectifs atteints",
            color: "purple",
            bgColor: "bg-gradient-to-br from-purple-50 to-pink-50",
            iconColor: "text-purple-600",
            borderColor: "border-purple-100"
          }
        ].map((stat, index) => (
          <motion.div 
            key={stat.label} 
            className={`${stat.bgColor} rounded-xl p-6 border ${stat.borderColor} shadow-sm hover:shadow-md transition-all duration-300`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {stat.format === 'currency' ? formatAmount(stat.value) : stat.value}
            </p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </motion.div>
        ))}
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
                <div className="p-6">
                  <div className="flex items-center gap-6">
                    <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center">
                      <HeartIcon className="h-8 w-8 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{donation.title}</h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{donation.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                          <span>{formatAmount(donation.currentAmount)} / {formatAmount(donation.targetAmount)}</span>
                        </div>
                        <div className="flex items-center">
                          <UsersIcon className="h-4 w-4 mr-1" />
                          <span>{donation.donorCount || 0} donateurs</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => handleDonate(donation._id)}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                      >
                        Donner
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
                />
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Section d'informations sur les dons */}
      <motion.div 
        className="bg-gradient-to-br from-red-50 via-white to-red-50 rounded-xl p-8 mt-12 relative z-10 border border-red-100 shadow-lg"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Comment faire un don */}
          <div>
            <div className="flex items-center mb-6">
              <div className="bg-red-100 rounded-full p-3 mr-4">
                <FaHeart className="text-red-600 text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 font-sans">
                Comment faire un don
              </h2>
            </div>
            
            <div className="space-y-4 text-gray-700">
              <div className="flex items-start space-x-3">
                <div className="bg-red-100 rounded-full p-2 mt-1">
                  <FaCheck className="text-red-600 text-sm" />
                </div>
                <p className="text-sm">
                  <strong>Donations en ligne :</strong> Utilisez nos formulaires sécurisés pour les donations par carte de crédit.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-red-100 rounded-full p-2 mt-1">
                  <FaCheck className="text-red-600 text-sm" />
                </div>
                <p className="text-sm">
                  <strong>Donations planifiées :</strong> Contactez notre équipe pour explorer les options de dons.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-red-100 rounded-full p-2 mt-1">
                  <FaCheck className="text-red-600 text-sm" />
                </div>
                <p className="text-sm">
                  <strong>Support personnalisé :</strong> Notre équipe vous accompagne dans votre démarche.
                </p>
              </div>
            </div>
          </div>

          {/* Coordonnées */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 rounded-full p-3 mr-4">
                <FaUniversity className="text-green-600 text-lg" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 font-sans">
                Nos coordonnées
              </h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center text-sm">
                  <FaUniversity className="text-red-600 mr-2" />
                  Comptes bancaires
                </h4>
                <div className="space-y-1 text-xs text-gray-600 pl-6">
                  <p className="flex justify-between"><strong>Rawbank:</strong> <span className="font-mono">1234567890123456</span></p>
                  <p className="flex justify-between"><strong>EquityBCDC:</strong> <span className="font-mono">9876543210987654</span></p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center text-sm">
                  <FaMobile className="text-green-600 mr-2" />
                  Mobile Money
                </h4>
                <div className="space-y-1 text-xs text-gray-600 pl-6">
                  <p className="flex justify-between"><strong>Mpesa:</strong> <span className="font-mono">+243 000 000 000</span></p>
                  <p className="flex justify-between"><strong>Orange Money:</strong> <span className="font-mono">+243 111 111 111</span></p>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
              <p className="text-xs text-green-800">
                📧 Confirmez votre don par email à <strong>dons@lau.org</strong>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DonationsPage; 