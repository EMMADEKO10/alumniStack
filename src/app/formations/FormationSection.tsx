"use client";
import React, { useState, useEffect } from "react";
import FormationCard from "../../components/cards/FormationCard";
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  AcademicCapIcon
} from "@heroicons/react/24/outline";

interface Formation {
  _id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  instructor: string;
  price: number;
  startDate: Date;
  endDate: Date;
  location: string;
  maxStudents?: number;
  imageUrl: string;
  createdAt: Date;
}

const FormationSection: React.FC = () => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [filteredFormations, setFilteredFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [viewMode, setViewMode] = useState("grid");

  // Récupération des formations depuis l'API
  useEffect(() => {
    const fetchFormations = async () => {
      try {
        const response = await fetch("/api/formations");
        if (!response.ok) {
          // Si l'API échoue, utiliser des données de démonstration
          console.warn("API non disponible, utilisation des données de démonstration");
          const demoData: Formation[] = [
            {
              _id: "demo1",
              title: "Design d'expérience utilisateur (UX)",
              description: "Découvrez les principes fondamentaux du design d'expérience utilisateur (UX) et apprenez à créer des interfaces utilisateur intuitives et attrayantes.",
              duration: "5 semaines",
              level: "Débutant",
              instructor: "Sarah Martin",
              price: 300,
              startDate: new Date("2024-02-15"),
              endDate: new Date("2024-03-29"),
              location: "En ligne ou en presentiel",
              maxStudents: 25,
              imageUrl: "https://res.cloudinary.com/dzhpaf2vw/image/upload/v1747579799/_21bd88b7-e386-45d7-9db3-7ba43b135625_iokqbi.jpg",
              createdAt: new Date()
            },
            {
              _id: "demo2",
              title: "Développement Web avancé",
              description: "Apprenez les techniques de développement Web avancées, y compris les frameworks populaires tels que React et Vue.js.",
              duration: "8 semaines",
              level: "Avancé",
              instructor: "Jean Dupont",
              price: 499,
              startDate: new Date("2024-03-01"),
              endDate: new Date("2024-04-26"),
              location: "Paris, France",
              maxStudents: 20,
              imageUrl: "https://res.cloudinary.com/dzhpaf2vw/image/upload/c_fill,w_800,h_600/v1747579800/web-development-course_abc123.jpg",
              createdAt: new Date()
            },
            {
              _id: "demo3",
              title: "Marketing numérique pour les entrepreneurs",
              description: "Découvrez les stratégies et les outils du marketing numérique pour développer votre entreprise en ligne.",
              duration: "4 semaines",
              level: "Intermédiaire",
              instructor: "Marie Dubois",
              price: 199,
              startDate: new Date("2024-02-20"),
              endDate: new Date("2024-03-20"),
              location: "Lyon, France",
              maxStudents: 30,
              imageUrl: "https://res.cloudinary.com/dzhpaf2vw/image/upload/c_scale,w_800,h_600,q_auto,f_auto/v1747579801/digital-marketing-course_def456.jpg",
              createdAt: new Date()
            }
          ];
          setFormations(demoData);
          setFilteredFormations(demoData);
          setLoading(false);
          return;
        }
        const data = await response.json();
        setFormations(data || []);
        setFilteredFormations(data || []);
      } catch (err) {
        console.error("Erreur lors de la récupération des formations:", err);
        setError("Erreur lors du chargement des formations");
      } finally {
        setLoading(false);
      }
    };

    fetchFormations();
  }, []);

  // Filtrage et tri des formations
  useEffect(() => {
    let filtered = [...formations];

    // Filtrage par recherche
    if (searchTerm) {
      filtered = filtered.filter(formation =>
        formation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formation.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrage par niveau
    if (filterLevel !== "all") {
      filtered = filtered.filter(formation => formation.level === filterLevel);
    }

    // Filtrage par localisation
    if (filterLocation !== "all") {
      filtered = filtered.filter(formation => formation.location === filterLocation);
    }

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "price":
          return a.price - b.price;
        case "startDate":
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        case "createdAt":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    setFilteredFormations(filtered);
  }, [formations, searchTerm, sortBy, filterLevel, filterLocation]);

  const getUniqueLevels = () => {
    return ["all", ...Array.from(new Set(formations.map(f => f.level)))];
  };

  const getUniqueLocations = () => {
    return ["all", ...Array.from(new Set(formations.map(f => f.location)))];
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
                placeholder="Rechercher une formation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Filtre par niveau */}
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent"
            >
              {getUniqueLevels().map(level => (
                <option key={level} value={level}>
                  {level === "all" ? "Tous les niveaux" : level}
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
              <option value="price">Prix</option>
              <option value="startDate">Date de début</option>
            </select>

            {/* Mode d'affichage */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 ${viewMode === "grid" ? "bg-red-800 text-white" : "bg-white text-gray-700"}`}
              >
                <AcademicCapIcon className="h-5 w-5" />
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
          {filteredFormations.length} formation{filteredFormations.length !== 1 ? 's' : ''} trouvée{filteredFormations.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Grille des formations */}
      {filteredFormations.length > 0 ? (
        <div className={`grid gap-6 ${
          viewMode === "grid" 
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
            : "grid-cols-1"
        }`}>
          {filteredFormations.map((formation) => (
            <FormationCard key={formation._id} formation={formation} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune formation trouvée</h3>
          <p className="mt-1 text-sm text-gray-500">
            Essayez de modifier vos critères de recherche.
          </p>
        </div>
      )}
    </div>
  );
};

export default FormationSection; 