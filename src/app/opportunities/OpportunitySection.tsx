"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import OpportunityCard from "../../components/cards/OpportunityCard";
import { 
  MagnifyingGlassIcon, 
  BriefcaseIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ChartBarIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

interface Opportunity {
  _id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  requirements?: string[];
  deadline: Date;
  contactEmail?: string;
  contactPhone?: string;
  imageUrl: string;
  applicants?: unknown[];
  isActive?: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

const OpportunitySection: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [filterType, setFilterType] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [showStats, setShowStats] = useState(false);

  // Récupération des opportunités depuis l'API
  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await fetch("/api/opportunities");
        if (!response.ok) {
          // Si l'API échoue, utiliser des données de démonstration
          console.warn("API non disponible, utilisation des données de démonstration");
          const demoData: Opportunity[] = [
            {
              _id: "demo1",
              title: "Développeur Full Stack",
              description: "Rejoignez notre équipe en tant que développeur Full Stack et participez à la conception, au développement et à la maintenance de nos applications Web.",
              company: "TechCorp",
              location: "Paris, France",
              type: "CDI",
              salary: "45 000 - 55 000 €",
              deadline: new Date("2024-03-15"),
              imageUrl: "/graduation.jpg",
              createdAt: new Date()
            },
            {
              _id: "demo2",
              title: "Spécialiste en Marketing Digital",
              description: "Nous recherchons un spécialiste en marketing numérique pour élaborer et exécuter des stratégies de marketing en ligne innovantes pour nos clients.",
              company: "DigitalAgency",
              location: "Lyon, France",
              type: "CDD",
              salary: "40 000 - 50 000 €",
              deadline: new Date("2024-02-28"),
              imageUrl: "/graduation.jpg",
              createdAt: new Date()
            },
            {
              _id: "demo3",
              title: "Consultant en Finance",
              description: "Poste de consultant junior en finance d'entreprise. Excellente opportunité pour débuter votre carrière dans le conseil financier.",
              company: "Finance Conseil",
              location: "Marseille, France",
              type: "Stage",
              salary: "1 200 € / mois",
              deadline: new Date("2024-04-10"),
              imageUrl: "/graduation.jpg",
              createdAt: new Date()
            },
            {
              _id: "demo4",
              title: "Développeur Frontend React",
              description: "Développeur frontend spécialisé en React pour créer des interfaces utilisateur modernes et responsive.",
              company: "WebTech Solutions",
              location: "Toulouse, France",
              type: "Freelance",
              salary: "400 - 600 € / jour",
              deadline: new Date("2024-03-30"),
              imageUrl: "/graduation.jpg",
              createdAt: new Date()
            }
          ];
          setOpportunities(demoData);
          setFilteredOpportunities(demoData);
          setLoading(false);
          return;
        }
        const data = await response.json();
        setOpportunities(data || []);
        setFilteredOpportunities(data || []);
      } catch (err) {
        console.error("Erreur lors de la récupération des opportunités:", err);
        setError("Erreur lors du chargement des opportunités");
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  // Filtrage et tri des opportunités
  useEffect(() => {
    let filtered = [...opportunities];

    // Filtrage par recherche
    if (searchTerm) {
      filtered = filtered.filter(
        (opportunity) =>
          opportunity.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          opportunity.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          opportunity.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          opportunity.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrage par type
    if (filterType !== "all") {
      filtered = filtered.filter((opportunity) => opportunity.type === filterType);
    }

    // Filtrage par localisation
    if (filterLocation !== "all") {
      filtered = filtered.filter((opportunity) => 
        opportunity.location?.toLowerCase().includes(filterLocation.toLowerCase())
      );
    }

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "createdAt":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "title":
          return a.title?.localeCompare(b.title) || 0;
        case "company":
          return a.company?.localeCompare(b.company) || 0;
        case "location":
          return a.location?.localeCompare(b.location) || 0;
        case "deadline":
          if (!a.deadline && !b.deadline) return 0;
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        default:
          return 0;
      }
    });

    setFilteredOpportunities(filtered);
  }, [opportunities, searchTerm, sortBy, filterType, filterLocation]);

  const getUniqueTypes = () => {
    return ["all", ...Array.from(new Set(opportunities.map(o => o.type)))];
  };

  const getUniqueLocations = () => {
    return ["all", ...Array.from(new Set(opportunities.map(o => o.location)))];
  };

  // Statistiques
  const stats = useMemo(() => {
    const total = opportunities.length;
    const types = opportunities.reduce((acc, opp) => {
      acc[opp.type] = (acc[opp.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const avgSalary = opportunities
      .filter(o => o.salary && !isNaN(parseFloat(o.salary)))
      .reduce((sum, o) => {
        const salaryMatch = o.salary.match(/\d+/);
        return sum + (salaryMatch ? parseFloat(salaryMatch[0]) : 0);
      }, 0) / opportunities.filter(o => o.salary && !isNaN(parseFloat(o.salary))).length;

    return {
      total,
      types,
      avgSalary: isNaN(avgSalary) ? 0 : avgSalary,
      locations: new Set(opportunities.map(o => o.location)).size,
    };
  }, [opportunities]);

  // Pagination
  const paginatedOpportunities = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredOpportunities.slice(startIndex, endIndex);
  }, [filteredOpportunities, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredOpportunities.length / itemsPerPage);

  // Reset à la page 1 quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType, filterLocation, sortBy]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Skeleton Statistiques */}
        <div className="bg-linear-to-r from-red-50 to-rose-50 rounded-xl p-6 border border-red-100 mb-6 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <div className="h-10 w-16 bg-gray-200 rounded mx-auto mb-2"></div>
                <div className="h-4 w-24 bg-gray-200 rounded mx-auto"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Skeleton Barre de recherche */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 animate-pulse">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="h-12 bg-gray-200 rounded-lg flex-1"></div>
            <div className="flex gap-3">
              <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
              <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
              <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 w-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>

        {/* Skeleton Cartes d'opportunités */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <div className="flex gap-2 mb-3">
                  <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                  <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="border-t border-gray-100 pt-4 space-y-2 mb-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-12 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-6 text-center"
        >
          <BriefcaseIcon className="mx-auto h-12 w-12 text-red-400 mb-3" />
          <p className="text-red-800 font-semibold mb-2">Erreur de chargement</p>
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Réessayer
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
      {/* Statistiques */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="bg-linear-to-r from-red-50 to-rose-50 rounded-xl p-4 sm:p-6 border border-red-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                  <ChartBarIcon className="h-5 w-5 text-red-600" />
                  Statistiques des opportunités
                </h3>
                <button
                  onClick={() => setShowStats(false)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-red-50 text-center sm:text-left">
                  <p className="text-[10px] sm:text-sm text-gray-500 uppercase font-semibold">Total</p>
                  <p className="text-xl sm:text-2xl font-bold text-red-600 leading-tight">{stats.total}</p>
                </div>
                <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-blue-50 text-center sm:text-left">
                  <p className="text-[10px] sm:text-sm text-gray-500 uppercase font-semibold">Villes</p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600 leading-tight">{stats.locations}</p>
                </div>
                <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-green-50 text-center sm:text-left">
                  <p className="text-[10px] sm:text-sm text-gray-500 uppercase font-semibold">Types</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600 leading-tight">{Object.keys(stats.types).length}</p>
                </div>
                <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-purple-50 text-center sm:text-left">
                  <p className="text-[10px] sm:text-sm text-gray-500 uppercase font-semibold">CDI</p>
                  <p className="text-xl sm:text-2xl font-bold text-purple-600 leading-tight">{stats.types['CDI'] || 0}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* En-tête avec recherche et filtres */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Barre de recherche et boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Titre, entreprise, ville..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent shadow-sm text-sm sm:text-base transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg transition shadow-sm text-sm font-medium ${showFilters ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                <AdjustmentsHorizontalIcon className="h-5 w-5" />
                Filtres
              </button>
              <button
                onClick={() => setShowStats(!showStats)}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg transition shadow-sm text-sm font-medium ${showStats ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                <ChartBarIcon className="h-5 w-5" />
                Stats
              </button>
            </div>
          </div>

          {/* Panneau de filtres */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-white rounded-lg p-4 sm:p-5 border border-gray-200 shadow-md">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Filtre par type */}
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Contrat</label>
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent bg-white shadow-sm text-sm"
                      >
                        {getUniqueTypes().map(type => (
                          <option key={type} value={type}>
                            {type === "all" ? "Tous les types" : type}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Filtre par localisation */}
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Localisation</label>
                      <select
                        value={filterLocation}
                        onChange={(e) => setFilterLocation(e.target.value)}
                        className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent bg-white shadow-sm text-sm"
                      >
                        {getUniqueLocations().map(location => (
                          <option key={location} value={location}>
                            {location === "all" ? "Toutes les villes" : location}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Tri */}
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Trier par</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent bg-white shadow-sm text-sm"
                      >
                        <option value="createdAt">Plus récentes</option>
                        <option value="title">Alphabétique</option>
                        <option value="company">Entreprise</option>
                        <option value="location">Localisation</option>
                        <option value="deadline">Date limite</option>
                      </select>
                    </div>

                    {/* Mode d'affichage */}
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 text-center sm:text-left">Affichage</label>
                      <div className="flex border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                        <button
                          onClick={() => setViewMode("grid")}
                          className={`flex-1 py-2 sm:py-2.5 transition flex justify-center items-center ${viewMode === "grid" ? "bg-red-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                        >
                          <Squares2X2Icon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setViewMode("list")}
                          className={`flex-1 py-2 sm:py-2.5 transition flex justify-center items-center ${viewMode === "list" ? "bg-red-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                        >
                          <ListBulletIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Résultats et badges de filtres actifs */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-gray-700 font-medium">
            {filteredOpportunities.length} opportunité{filteredOpportunities.length !== 1 ? 's' : ''} trouvée{filteredOpportunities.length !== 1 ? 's' : ''}
          </p>
          {(filterType !== "all" || filterLocation !== "all" || searchTerm) && (
            <div className="flex flex-wrap gap-2">
              {filterType !== "all" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                  {filterType}
                  <button onClick={() => setFilterType("all")} className="hover:text-red-900">
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </span>
              )}
              {filterLocation !== "all" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {filterLocation}
                  <button onClick={() => setFilterLocation("all")} className="hover:text-blue-900">
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </span>
              )}
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  &ldquo;{searchTerm}&rdquo;
                  <button onClick={() => setSearchTerm("")} className="hover:text-green-900">
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </span>
              )}
              <button
                onClick={() => {
                  setFilterType("all");
                  setFilterLocation("all");
                  setSearchTerm("");
                }}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Réinitialiser tout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Grille des opportunités */}
      {filteredOpportunities.length > 0 ? (
        <>
          <motion.div
            layout
            className={`grid gap-6 ${
              viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                : "grid-cols-1"
            }`}
          >
            <AnimatePresence mode="popLayout">
              {paginatedOpportunities.map((opportunity, index) => (
                <motion.div
                  key={opportunity._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <OpportunityCard opportunity={opportunity} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 flex justify-center items-center gap-2"
            >
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                  // Afficher seulement les pages pertinentes
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg transition ${
                          currentPage === page
                            ? "bg-red-600 text-white font-semibold"
                            : "border border-gray-300 hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="px-2 py-2 text-gray-400">...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </motion.div>
          )}
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-linear-to-br from-gray-50 to-red-50 rounded-xl border border-gray-200"
        >
          <BriefcaseIcon className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">Aucune opportunité trouvée</h3>
          <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto">
            Aucune opportunité ne correspond à vos critères de recherche.
            Essayez de modifier vos filtres ou votre recherche.
          </p>
          {(filterType !== "all" || filterLocation !== "all" || searchTerm) && (
            <button
              onClick={() => {
                setFilterType("all");
                setFilterLocation("all");
                setSearchTerm("");
              }}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Réinitialiser les filtres
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default OpportunitySection; 
