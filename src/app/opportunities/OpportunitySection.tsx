"use client";
import React, { useState, useEffect } from "react";
import OpportunityCard from "../../components/cards/OpportunityCard";
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  BriefcaseIcon, 
  MapPinIcon, 
  CurrencyDollarIcon,
  CalendarIcon,
  BuildingOfficeIcon
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600">Erreur: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* En-tête avec recherche et filtres */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une opportunité..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Filtre par type */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent"
            >
              {getUniqueTypes().map(type => (
                <option key={type} value={type}>
                  {type === "all" ? "Tous les types" : type}
                </option>
              ))}
            </select>

            {/* Filtre par localisation */}
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent"
            >
              {getUniqueLocations().map(location => (
                <option key={location} value={location}>
                  {location === "all" ? "Toutes les localisations" : location}
                </option>
              ))}
            </select>

            {/* Tri */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent"
            >
              <option value="createdAt">Plus récentes</option>
              <option value="title">Alphabétique</option>
              <option value="company">Entreprise</option>
              <option value="location">Localisation</option>
              <option value="deadline">Date limite</option>
            </select>

            {/* Mode d'affichage */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 ${viewMode === "grid" ? "bg-red-800 text-white" : "bg-white text-gray-700"}`}
              >
                <BriefcaseIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-2 ${viewMode === "list" ? "bg-red-800 text-white" : "bg-white text-gray-700"}`}
              >
                <FunnelIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Résultats */}
      <div className="mb-6">
        <p className="text-gray-600">
          {filteredOpportunities.length} opportunité{filteredOpportunities.length !== 1 ? 's' : ''} trouvée{filteredOpportunities.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Grille des opportunités */}
      {filteredOpportunities.length > 0 ? (
        <div className={`grid gap-6 ${
          viewMode === "grid" 
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
            : "grid-cols-1"
        }`}>
          {filteredOpportunities.map((opportunity) => (
            <OpportunityCard key={opportunity._id} opportunity={opportunity} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune opportunité trouvée</h3>
          <p className="mt-1 text-sm text-gray-500">
            Essayez de modifier vos critères de recherche.
          </p>
        </div>
      )}
    </div>
  );
};

export default OpportunitySection; 